---
name: pm-ideate
description: >
  Refine vague ideas into clear concepts with a problem statement and NOT Doing list.
  Use before /ba-spec to avoid mis-specs from the start.
  Trigger when: user says "có ý tưởng muốn explore", "chưa biết làm gì", "brainstorm feature",
  "idea còn mơ hồ", "muốn clarify hướng đi", "have an idea to explore", "fuzzy concept",
  "want to brainstorm", or type /pm-ideate.
---

# Skill: /pm-ideate
**Role**: PM / BA  
**Purpose**: Refine vague ideas into clear concepts BEFORE running /ba-spec. Avoid mis-specs from the start.

---

## When to Use

- Stakeholder request is very vague ("do something with the dashboard")
- Multiple directions possible, unclear which way to go
- Want to explore options before committing to a spec

## Execution Guide

### Step 1 — Gate: Collect raw idea

```
## I will help clarify this idea.

Tell me: what problem are you trying to solve?
(Doesn't need to be complete — a rough idea is fine)
```

### Step 2 — Diverge: Create 5-8 variations

**Research before generating variations**: Use `web_search` (or ask the user if no search tool is available) to check whether a similar product/pattern already solves this problem. Fold any relevant findings into the variations below — avoid generating ideas in a vacuum, ignoring prior art.

Analyze the idea through these lenses:

- **Inversion**: What if we did the opposite?
- **Simplification**: What's the simplest possible version?
- **Constraint removal**: What if there were no time/budget limits?
- **Analogy**: How do other industries solve similar problems?
- **User focus**: If we only needed to solve for 1 specific user, what would we do?

Create 5-8 concise variations (2-3 sentences each).

### Step 3 — Converge: Group into 2-3 directions

Cluster the variations into 2-3 strategic directions:

```
## I see [N] approaches:

### Direction A: [Name — distinctive keyword]
[2-3 sentence description]
- Best when: [condition]
- Risk: [main risk]

### Direction B: [Name]
...

### Direction C: [Name] (if any)
...
```

### Step 4 — One-pager + "Not Doing" list

```
## Proposed direction: [Direction X]

**Problem statement**: [1 sentence]
**Proposed solution**: [2-3 sentences]
**Target users**: [Who]
**Success metric**: [How to measure success]

### ❌ NOT Doing (important)
- [Thing 1 not in this scope]
- [Thing 2 not done]
- [Thing 3 not done]
```

### Step 5 — Final Gate: Confirm direction

```
AskUserQuestion({
  questions: [
    {
      question: "Is the \"Not Doing\" list correct?",
      header: "Not Doing",
      multiSelect: false,
      options: [
        { label: "Correct", description: "Not Doing list is accurate" },
        { label: "Still in scope", description: "Some items are still in scope — needs adjustment" }
      ]
    },
    {
      question: "Is the success metric measurable?",
      header: "Metric",
      multiSelect: false,
      options: [
        { label: "Yes", description: "Success metric is measurable" },
        { label: "Not enough", description: "Need to clarify the success metric further" }
      ]
    },
    {
      question: "Ready to run /ba-spec with this direction?",
      header: "Next step",
      multiSelect: false,
      options: [
        { label: "Ready", description: "Run /ba-spec to write detailed specification" },
        { label: "Need more exploration", description: "Need to explore other directions before specing" }
      ]
    }
  ]
})
```

**Wait for confirmation.**

---

## Note

- The "Not Doing list" is as important as the "Doing list" — it helps avoid scope creep
- If the team disagrees on the direction → this is a signal to facilitate more, not to skip this step
