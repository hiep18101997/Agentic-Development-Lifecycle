# Agentic Development Lifecycle — Setup Script
# Usage: .\setup.ps1 -TargetPath "C:\path\to\your\project"
# Usage: .\setup.ps1                        (install to current directory)
# Usage: .\setup.ps1 -Update                (overwrite framework files)
# Usage: .\setup.ps1 -Yes                   (skip confirmation prompt)

param(
    [string]$TargetPath = (Get-Location).Path,
    [switch]$Yes,
    [switch]$Update,
    [ValidateSet('ja','en','vi','all')]
    [string]$Language = 'all'
)

function Test-LangFilter {
    param([string]$Filename)
    if ($Language -eq 'all') { return $true }
    if ($Filename -notmatch '\.(md|txt)$') { return $true }
    $isJa = $Filename -match '\.ja\.(md|txt)$'
    $isEn = $Filename -match '\.en\.(md|txt)$'
    $isBase = (-not $isJa) -and (-not $isEn)
    switch ($Language) {
        'vi' { return $isBase }
        'en' { return $isEn -or $isBase }
        'ja' { return $isJa -or $isBase }
    }
    return $true
}

$SourcePath = $PSScriptRoot
$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/hiepdnh/Agentic-Development-Lifecycle"

$mode = if ($Update) { "Update" } else { "Setup" }

Write-Host ""
Write-Host "Agentic Development Lifecycle — $mode" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Source   : $SourcePath"
Write-Host "Target   : $TargetPath"
Write-Host "Language : $Language  (-Language ja|en|vi|all)"
Write-Host ""

# Validate target
if (-not (Test-Path $TargetPath)) {
    Write-Host "ERROR: Target path does not exist: $TargetPath" -ForegroundColor Red
    exit 1
}

if ($SourcePath -eq $TargetPath) {
    Write-Host "ERROR: Source and target are the same directory." -ForegroundColor Red
    exit 1
}

# IB-032: -Update (even with -Yes) must never silently write into a directory that doesn't
# already look like an ADLC install — an update-into-empty-dir is almost always a mistake, not
# something to allow non-interactively. Checked regardless of -Yes.
if ($Update) {
    $claudeMdCheck = Join-Path $TargetPath "CLAUDE.md"
    $skillsCheck = Join-Path $TargetPath ".claude\skills"
    if (-not (Test-Path $claudeMdCheck) -and -not (Test-Path $skillsCheck)) {
        Write-Host "ERROR: -Update specified but $TargetPath doesn't look like an existing ADLC install (no CLAUDE.md or skill directory found) — remove -Update to do a fresh install, or verify the target path is correct" -ForegroundColor Red
        exit 1
    }
}

# Confirm
if (-not $Yes) {
    $verb = if ($Update) { "Update" } else { "Install" }
    $confirm = Read-Host "$verb framework into '$TargetPath'? [y/N]"
    if ($confirm -notmatch '^(y|yes)$') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""

# Helper
function Copy-Dir {
    param([string]$Src, [string]$Dst, [string]$Label, [bool]$ApplyFilter = $true)
    if (-not (Test-Path $Src)) { return }
    if (-not (Test-Path $Dst)) { New-Item -ItemType Directory -Path $Dst -Force | Out-Null }
    $copied = 0; $skipped = 0; $updated = 0; $filtered = 0
    Get-ChildItem -Path $Src -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($Src.Length).TrimStart('\','/')
        $target = Join-Path $Dst $rel
        $targetDir = Split-Path $target -Parent
        if ($ApplyFilter -and -not (Test-LangFilter $_.Name)) {
            $filtered++
            return
        }
        if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
        if (Test-Path $target) {
            if ($Update) {
                Copy-Item -Path $_.FullName -Destination $target -Force
                $updated++
            } else {
                $skipped++
            }
        } else {
            Copy-Item -Path $_.FullName -Destination $target -Force
            $copied++
        }
    }
    $parts = @()
    if ($copied -gt 0)   { $parts += "$copied added" }
    if ($updated -gt 0)  { $parts += "$updated updated" }
    if ($skipped -gt 0)  { $parts += "$skipped skipped" }
    if ($filtered -gt 0) { $parts += "$filtered filtered" }
    $summary = $parts -join ', '
    if ($copied -eq 0 -and $updated -eq 0) {
        if ($summary) {
            Write-Host "  [SKIP] $Label — $summary" -ForegroundColor Yellow
        } else {
            Write-Host "  [SKIP] $Label" -ForegroundColor Yellow
        }
    } else {
        if ($summary) {
            Write-Host "  [OK]   $Label — $summary" -ForegroundColor Green
        } else {
            Write-Host "  [OK]   $Label" -ForegroundColor Green
        }
    }
}

# 1. Copy .claude/skills (Agent Skills — copies each skill folder verbatim, incl. SKILL.en/ja.md)
Write-Host "Copying Claude Code skills..."
$claudeTarget = Join-Path $TargetPath ".claude"
$commandsTarget = Join-Path $claudeTarget "skills"
if (-not (Test-Path $claudeTarget)) { New-Item -ItemType Directory -Path $claudeTarget | Out-Null }
Copy-Dir (Join-Path $SourcePath ".claude\skills") $commandsTarget ".claude/skills/"

# 2. Copy agents
Write-Host "Copying agent definitions..."
Copy-Dir (Join-Path $SourcePath "agents") (Join-Path $TargetPath "agents") "agents/"

# 3. Copy templates
Write-Host "Copying templates..."
Copy-Dir (Join-Path $SourcePath "templates") (Join-Path $TargetPath "templates") "templates/"

# 4. Copy docs/workflows
Write-Host "Copying workflow docs..."
$docsTarget = Join-Path $TargetPath "docs"
$workflowsTarget = Join-Path $docsTarget "workflows"
if (-not (Test-Path $docsTarget)) { New-Item -ItemType Directory -Path $docsTarget | Out-Null }
Copy-Dir (Join-Path $SourcePath "docs\workflows") $workflowsTarget "docs/workflows/"

# 4b. docs root framework files (skip-if-exists, overwrite on --update)
Write-Host "Copying framework doc files..."
foreach ($file in @("risk-classifier.md", "validation-matrix.md")) {
    $srcFile = Join-Path $SourcePath "docs\$file"
    $dstFile = Join-Path $docsTarget $file
    if (-not (Test-Path $srcFile)) { continue }
    if (Test-Path $dstFile) {
        if ($Update) {
            Copy-Item $srcFile $dstFile -Force
            Write-Host "  [OK]   docs/$file — updated" -ForegroundColor Green
        } else {
            Write-Host "  [SKIP] docs/$file" -ForegroundColor Yellow
        }
    } else {
        Copy-Item $srcFile $dstFile
        Write-Host "  [OK]   docs/$file" -ForegroundColor Green
    }
}

# 4c. improvement-backlog.md — only if missing (user-mutable, never overwrite)
$backlogSrc = Join-Path $SourcePath "docs\improvement-backlog.md"
$backlogDst = Join-Path $docsTarget "improvement-backlog.md"
if ((Test-Path $backlogSrc) -and -not (Test-Path $backlogDst)) {
    Copy-Item $backlogSrc $backlogDst
    Write-Host "  [OK]   docs/improvement-backlog.md — created" -ForegroundColor Green
}

# 4d. docs/analysis (framework content)
Write-Host "Copying analysis docs..."
Copy-Dir (Join-Path $SourcePath "docs\analysis") (Join-Path $docsTarget "analysis") "docs/analysis/"

# 5. Create empty doc dirs with .gitkeep
Write-Host "Creating doc directories..."
foreach ($dir in @("api", "screens", "tasks", "decisions")) {
    $dirPath = Join-Path $docsTarget $dir
    if (-not (Test-Path $dirPath)) {
        New-Item -ItemType Directory -Path $dirPath | Out-Null
        New-Item -ItemType File -Path (Join-Path $dirPath ".gitkeep") | Out-Null
        Write-Host "  [OK]   docs/$dir/" -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] docs/$dir/ already exists" -ForegroundColor Yellow
    }
}

# 6. CLAUDE.md
Write-Host "Copying CLAUDE.md..."
$claudeMdTarget = Join-Path $TargetPath "CLAUDE.md"
if ((Test-Path $claudeMdTarget) -and -not $Update) {
    Write-Host "  [SKIP] CLAUDE.md already exists — merge manually" -ForegroundColor Yellow
    Write-Host "         Reference: $SourcePath\CLAUDE.md" -ForegroundColor Gray
} else {
    Copy-Item (Join-Path $SourcePath "CLAUDE.md") $claudeMdTarget -Force
    Write-Host "  [OK]   CLAUDE.md" -ForegroundColor Green
}

Write-Host ""
if ($Update) {
    Write-Host "Framework updated successfully!" -ForegroundColor Green
} else {
    Write-Host "Done!" -ForegroundColor Green
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open CLAUDE.md and update the Project Context section:"
Write-Host "       - Company/project name"
Write-Host "       - Customer name"
Write-Host "       - Repo URL"
Write-Host "       - Tech stack"
Write-Host ""
Write-Host "  2. Open your project in Claude Code:"
Write-Host "       claude ."
Write-Host ""
Write-Host "  3. Type / to see available commands:"
Write-Host "       /pm:ideate   /ba:spec   /dev:analyze   /qa:testplan ..."
Write-Host ""
Write-Host "  Docs: $RepoUrl"
