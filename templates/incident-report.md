---
incidentId: INC-[YYYY-MM-DD]-[NNN]
severity: P1  # P1 (Critical) | P2 (High) | P3 (Medium) | P4 (Low)
startTime: [YYYY-MM-DD HH:mm JST]
endTime: [YYYY-MM-DD HH:mm JST]
durationMinutes: [N]
incidentCommander: [Name]
status: Open  # Open | Investigating | Mitigated | Resolved | Post-mortem Done
lang: vi
---

# Bao cao Su co / RCA — INC-[YYYY-MM-DD]-[NNN]

**Severity**: P1 (Critical) / P2 (High) / P3 (Medium) / P4 (Low)
**Thoi gian bat dau**: [YYYY-MM-DD HH:mm JST]
**Thoi gian ket thuc**: [YYYY-MM-DD HH:mm JST]
**Duration**: [X phut / X gio Y phut]
**Incident Commander**: [Ten]
**Trang thai**: Open / Investigating / Mitigated / Resolved / Post-mortem Done

---

## Tom tat

[2-3 cau mo ta: su co xay ra gi, khi nao, anh huong den ai/cai gi. Vi du: "Vao 14:32 JST ngay 2026-05-15, API /auth/login tra ve loi 500 trong 23 phut. Anh huong ~1,200 user khong the dang nhap."]

---

## Anh huong (Impact)

| Hang muc | Mo ta |
|----------|-------|
| Nguoi dung bi anh huong | [N users / X% users] |
| Tinh nang bi anh huong | [...] |
| SLA impact | [Bao nhieu phut downtime; co vi pham SLA khong] |
| Khach hang JP notify | Co / Khong — [Thoi diem notify neu co] |

---

## Timeline

| Thoi gian (JST) | Su kien |
|-----------------|---------|
| [HH:mm] | [Su kien xay ra / Alert trigger / Action taken] |
| [HH:mm] | [Vi du: Alert PagerDuty trigger] |
| [HH:mm] | [Vi du: On-call engineer acknowledge] |
| [HH:mm] | [Vi du: Root cause identified] |
| [HH:mm] | [Vi du: Fix deployed] |
| [HH:mm] | [Vi du: System restored, incident closed] |

---

## Root Cause

[Mo ta nguyen nhan goc re — WHY su co xay ra. Tra loi cau hoi "5 Whys" neu phu hop.]

**Trigger**: [Su kien cu the gay ra su co]
**Contributing factors**:

- [Factor 1 — vi du: Thieu circuit breaker]
- [Factor 2]

---

## Nhung gi da lam tot (What Went Well)

- [Vi du: Alerting detect duoc trong vong 2 phut]
- [...]

---

## Nhung gi can cai thien (What Didn't Go Well)

- [Vi du: Runbook khong cap nhat, on-call mat 15 phut tim cach rollback]
- [...]

---

## Action Items

| ID | Loai | Mo ta | Chu so huu | Deadline | Trang thai |
|----|------|-------|-----------|----------|------------|
| AI-001 | Fix | [Sua root cause] | [Name] | [YYYY-MM-DD] | Open |
| AI-002 | Preparedness | [Cap nhat runbook] | [Name] | [YYYY-MM-DD] | Open |
| AI-003 | Process | [Cai thien quy trinh] | [Name] | [YYYY-MM-DD] | Open |

---

## Tai lieu ho tro

- Logs: [Link den log / dashboard]
- Monitoring: [Link den Grafana/Datadog dashboard]
- Related PR: #[N]
- Post-mortem meeting notes: [Link neu co]

---
<!-- Blameless culture — tap trung vao he thong va quy trinh, khong chi trich ca nhan. -->
<!-- Tao boi /ops-incident | Template version: 1.0 -->
