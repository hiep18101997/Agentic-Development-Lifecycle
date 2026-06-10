---
version: [X.Y.Z]
releaseDate: [YYYY-MM-DD]
previousVersion: [X.Y.Z-1]
lang: vi
---

# Release Notes — v[X.Y.Z]

**Ngay phat hanh**: [YYYY-MM-DD]
**Phien ban truoc**: [vX.Y.Z-1]
**Loai release**: Major / Minor / Patch / Hotfix

---

## Tom tat

[2-3 cau mo ta tong quan release nay — cac thay doi chinh va y nghia voi nguoi dung]

---

## Thay doi

### Them moi (Added)

<!-- Tinh nang hoan toan moi -->

- [Ten tinh nang]: [Mo ta — du de end-user hieu]
  - Lien quan: #[issue] / [TASK-ID]

### Cai tien (Changed)

<!-- Thay doi tren tinh nang hien co -->

- [Ten thay doi]: [Mo ta thay doi va anh huong]

### Deprecated

<!-- Tinh nang sap bi xoa, van hoat dong nhung se bi loai bo trong release sau -->

- [Ten]: [Mo ta + timeline khi nao bi xoa + migration path neu co]

### Xoa bo (Removed)

<!-- Tinh nang da bi xoa so voi version truoc -->

- [Ten]: [Mo ta — va migration path neu co]

### Sua loi (Fixed)

<!-- Bug fixes -->

- [Ten bug]: [Mo ta ngan gon]
  - Lien quan: #[issue]

### Bao mat (Security)

<!-- Security fixes — LUON co section nay neu co bat ky security fix nao -->

- [CVE-XXXX-XXXX hoac mo ta]: [Impact + fix]

---

## Breaking Changes

<!-- Nhung thay doi yeu cau action tu phia client/consumer -->

- [ ] Khong co breaking changes trong release nay
- [ ] [Mo ta breaking change + migration guide]

---

## Upgrade Guide

<!-- Huong dan upgrade tu version truoc -->

```bash
# Lenh upgrade neu co
```

**Cac buoc can lam**:
1. [Step 1]
2. [Step 2]

---

## Merged PRs / Closed Issues

<!-- Danh sach PR/issue da merge/close trong release nay — tao tu dong boi /pm-release -->

| PR/Issue | Title | Type |
|----------|-------|------|
| #[N] | [...] | Feature / Bug / Refactor |

---
<!-- Template version: 1.0 | Tao boi /pm-release | Format: Keep a Changelog (keepachangelog.com) -->
