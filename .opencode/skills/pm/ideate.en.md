---
name: pm:ideate
description: >
  Refine vague ideas into clear concepts with a problem statement and a Not Doing list.
  Use before /ba:spec to avoid misguided specifications from the start.
  Triggers when: user says "have an idea to explore", "don't know what to do", "brainstorm feature",
  "idea is still fuzzy", "want to clarify direction", or types /pm:ideate.
---

# /pm:ideate
**Role**: PM / BA
**Purpose**: Refine vague ideas into clear concepts BEFORE running /ba:spec. Avoid misguided specs from the start.

---

## When to use

- Stakeholder request is still very vague ("make something with the dashboard")
- Multiple directions possible, unclear which to take
- Want to explore options before committing to a spec

## Execution Guide

### Step 1 — Gate: Collect raw ideas

```
## I will help clarify this idea.

Describe what problem you're trying to solve?
(No need to be complete — a rough idea is fine)
```

### Step 2 — Diverge: Generate 5-8 variations

**Research before generating variations**: Use `web_search` (or ask the user via `question()` if no search tool is available) to check whether a similar product/pattern already solves this problem. Fold any relevant findings into the variations below — avoid generating ideas in a vacuum, ignoring prior art.

Analyze the idea through these lenses:

- **Inversion**: What if we did the opposite?
- **Simplification**: What is the simplest possible version?
- **Constraint removal**: What if there were no time/budget limits?
- **Analogy**: How do other industries solve similar problems?
- **User focus**: If solving for just 1 specific user, what would we do?

Generate 5-8 concise variations (2-3 sentences each).

### Step 3 — Converge: Group into 2-3 directions

Cluster the variations into 2-3 strategic directions:

```
## I see [N] approaches:

### Direction A: [Name — distinctive keywords]
[2-3 sentence description]
- Best when: [conditions]
- Risk: [main risk]

### Direction B: [Name]
...

### Direction C: [Name] (if any)
...
```

### Step 4 — One-pager + "Not Doing" list

```
## Recommended direction: [Direction X]

**Problem statement**: [1 sentence]
**Proposed solution**: [2-3 sentences]
**Target users**: [Who]
**Success metric**: [How to measure success]

### ❌ NOT Doing (important)
- [Thing 1 not in scope]
- [Thing 2 not in scope]
- [Thing 3 not in scope]
```

### Step 5 — Final Gate: Confirm direction

```
question({
  questions: [{
    question: "\"Not Doing list\" accurate?",
    header: "Not Doing",
    options: [
      { label: "Correct", description: "Not Doing list is accurate" },
      { label: "Still in scope", description: "Some items are still in scope — needs adjustment" },
    ]
  }, {
    question: "Is the success metric measurable?",
    header: "Metric",
    options: [
      { label: "Yes", description: "Success metric is measurable" },
      { label: "Not enough", description: "Need to clarify the success metric further" },
    ]
  }, {
    question: "Ready to run /ba:spec with this direction?",
    header: "Next step",
    options: [
      { label: "Ready", description: "Run /ba:spec to write detailed specification" },
      { label: "Need more exploration", description: "Need to explore other directions before specing" },
    ]
  }]
})
```

---

## Note

- The "Not Doing list" is as important as the "Doing list" — helps prevent scope creep
- If the team disagrees on direction → this is a signal to facilitate more, not to skip this step
