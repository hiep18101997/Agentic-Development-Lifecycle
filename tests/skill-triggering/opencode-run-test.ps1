#!/usr/bin/env pwsh
# OpenCode Skill Triggering Test — Single Test Runner
# Usage: ./opencode-run-test.ps1 <prompt-file> [max-turns=3]
param(
    [Parameter(Mandatory=$true)]
    [string]$PromptFile,
    [int]$MaxTurns = 3
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $PromptFile)) {
    Write-Error "Prompt file not found: $PromptFile"
    exit 1
}

# Derive expected skill name from filename: ba-spec.txt -> ba:spec
$basename = [System.IO.Path]::GetFileNameWithoutExtension($PromptFile)
$expectedSkill = $basename -replace '^(.*?)-(.*?)$', '$1:$2'

# Output directory
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\..\.."
$safeName = $expectedSkill -replace ':', '-'
$resultsDir = Join-Path $repoRoot "tests\skill-triggering\opencode-results\$timestamp\$safeName"
New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null

$logFile = Join-Path $resultsDir 'log.txt'

Write-Host "Testing: $expectedSkill"
Write-Host "  Prompt: $PromptFile"
Write-Host "  Log:    $logFile"

$promptContent = Get-Content $PromptFile -Raw

# For OpenCode, skill triggering is determined by description matching.
# This test simulates the matching by checking if the prompt content
# contains keywords from the expected skill's description.

# Determine prompt language from its parent directory: opencode-prompts (vi, default),
# opencode-prompts-en, opencode-prompts-ja. This must match the skill variant we compare
# against — comparing an EN/JA prompt against the VN skill file's trigger phrases (the
# previous bug here) produces spurious passes/fails unrelated to real trigger accuracy.
$promptDirName = Split-Path -Leaf (Split-Path -Parent $PromptFile)
$promptLanguage = if ($promptDirName -match '-en$') { 'en' } elseif ($promptDirName -match '-ja$') { 'ja' } else { 'vi' }
$langSuffix = switch ($promptLanguage) { 'en' { '.en' } 'ja' { '.ja' } default { '' } }

$skillDir = Join-Path $repoRoot ".opencode\skills"
$role = $expectedSkill.Split(':')[0]
$cmd = $expectedSkill.Split(':')[1]
$skillFile = Join-Path $skillDir "$role\$cmd$langSuffix.md"
if ((-not (Test-Path $skillFile)) -and $langSuffix -ne '') {
  # No translated variant for this skill — fall back to the VN base file (matches the
  # installer's own fallback behavior for skills without a translated variant).
  $skillFile = Join-Path $skillDir "$role\$cmd.md"
}

if (-not (Test-Path $skillFile)) {
    Write-Host "  SKIP — skill file not found (expected: $skillFile)"
    exit 0
}

# Read skill description and check for trigger keyword matching
$skillContent = Get-Content $skillFile -Raw

# Extract description from frontmatter — each continuation line must itself
# start with >= 2 spaces of indent, so the match stops at the first
# unindented line (blank line or closing `---`) instead of running into the
# rest of the file body.
$descMatch = [regex]::Match($skillContent, '(?m)^description:\s*>\s*\r?\n((?:^[ \t]{2,}.*\r?\n?)*)')

function Write-FailResult([string]$reason, [string[]]$triggerPhrases = @()) {
    $result = @{
        prompt_file = $PromptFile
        expected_skill = $expectedSkill
        skill_file = $skillFile
        skill_exists = $true
        matched = $false
        reason = $reason
        trigger_phrases = $triggerPhrases
        timestamp = $timestamp
    }
    $result | ConvertTo-Json -Depth 3 | Out-File $logFile -Encoding UTF8
}

if (-not $descMatch.Success) {
    Write-FailResult 'description frontmatter not found'
    Write-Host "  FAIL — could not parse description frontmatter in: $skillFile"
    exit 1
}

$descriptionBlock = $descMatch.Groups[1].Value

# Trigger phrases live after "Trigger khi:" (vi) / "Triggers when:" (en), quoted
# like "phrase one", "phrase two". Fall back to the whole block if the marker
# is absent so unusually-formatted descriptions still get a chance to match.
$triggerMatch = [regex]::Match($descriptionBlock, '(?:Trigger khi|Triggers when):(.*)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$triggerText = if ($triggerMatch.Success) { $triggerMatch.Groups[1].Value } else { $descriptionBlock }

$triggerPhrases = @([regex]::Matches($triggerText, '["「]([^"」]+)["」]') | ForEach-Object { $_.Groups[1].Value })

if ($triggerPhrases.Count -eq 0) {
    Write-FailResult 'no quoted trigger phrases found in description'
    Write-Host "  FAIL — no quoted trigger phrases found in description: $skillFile"
    exit 1
}

$promptLower = $promptContent.ToLowerInvariant()
$matchedPhrase = $null

foreach ($phrase in $triggerPhrases) {
    $phraseLower = $phrase.ToLowerInvariant()

    # Strong signal: the exact trigger phrase appears verbatim in the prompt.
    if ($promptLower.Contains($phraseLower)) {
        $matchedPhrase = $phrase
        break
    }

    # Fallback: tolerate paraphrasing — require (almost) all of the phrase's
    # significant words (length >= 3, dropping short particles/prepositions)
    # to show up somewhere in the prompt. Short phrases (<=2 words) must match
    # fully so a single generic word can't produce a false positive.
    $words = @(($phraseLower -split '\W+') | Where-Object { $_.Length -ge 3 })
    if ($words.Count -eq 0) { continue }

    $hitCount = @($words | Where-Object { [regex]::IsMatch($promptLower, "\b$([regex]::Escape($_))\b") }).Count
    $required = if ($words.Count -le 2) { $words.Count } else { $words.Count - 1 }

    if ($hitCount -ge $required) {
        $matchedPhrase = $phrase
        break
    }
}

$matched = $null -ne $matchedPhrase

$result = @{
    prompt_file = $PromptFile
    expected_skill = $expectedSkill
    skill_file = $skillFile
    skill_exists = $true
    trigger_phrases = $triggerPhrases
    matched = $matched
    matched_phrase = $matchedPhrase
    timestamp = $timestamp
}

# Log the result
$result | ConvertTo-Json -Depth 3 | Out-File $logFile -Encoding UTF8

if (-not $matched) {
    Write-Host "  FAIL — prompt content has no overlap with trigger phrases for: $role/$(Split-Path -Leaf $skillFile)"
    Write-Host "         trigger phrases: $($triggerPhrases -join ', ')"
    Write-Host "  HINT — for full trigger validation, run the prompt in an OpenCode session"
    Write-Host "         and verify the correct skill is auto-loaded."
    exit 1
}

Write-Host "  PASS — prompt matches trigger phrase: `"$matchedPhrase`" ($role/$(Split-Path -Leaf $skillFile))"
Write-Host "  HINT — for full trigger validation, run the prompt in an OpenCode session"
Write-Host "         and verify the correct skill is auto-loaded."
exit 0
