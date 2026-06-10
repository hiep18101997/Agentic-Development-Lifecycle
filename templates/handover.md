---
projectId: [PROJECT-XXX]
systemName: [Ten he thong]
handoverDate: [YYYY-MM-DD]
handoverFrom: [Ten nguoi ban giao]
handoverTo: [Ten nguoi nhan ban giao]
lang: vi
---

# Tai lieu Ban giao Du an (引き継ぎ書)

**He thong**: [Ten he thong]
**Ngay ban giao**: [YYYY-MM-DD]
**Nguoi ban giao**: [Ten]
**Nguoi nhan**: [Ten]

---

## 1. Tong quan he thong

[Muc dich he thong, chuc nang chinh, nguoi dung chinh. 3-5 cau du de nguoi moi hieu he thong lam gi.]

**Tech stack**: [Ngon ngu, framework, DB, infra]
**Moi truong**:

| Moi truong | URL | Ghi chu |
|------------|-----|---------|
| Production | [...] | [...] |
| Staging | [...] | [...] |
| Development | [...] | [...] |

## 2. Trang thai hien tai

### Trang thai he thong

- **Phien ban hien tai**: [vX.Y.Z]
- **Tinh trang**: Hoat dong binh thuong / Co van de da biet / Dang maintain

### Van de da biet / Tech debt

| ID | Mo ta | Muc do | Workaround hien tai |
|----|-------|--------|---------------------|
| TDB-001 | [...] | Cao / Trung / Thap | [...] |

### Cong viec dang do

| Task/Issue | Mo ta | Trang thai | Ghi chu |
|------------|-------|------------|---------|
| #[N] | [...] | In progress / Blocked | [...] |

## 3. Danh sach lien lac quan trong

| Vai tro | Ten | Email / Slack | Ghi chu |
|---------|-----|---------------|---------|
| PM phia khach JP | [...] | [...] | [...] |
| BE (Bridge Engineer) | [...] | [...] | [...] |
| Tech Lead | [...] | [...] | [...] |
| DevOps | [...] | [...] | [...] |
| DBA (neu co) | [...] | [...] | [...] |

**Luu y bao mat**: Credentials va thong tin dang nhap duoc luu rieng tai [link den vault/secrets manager — KHONG paste inline].

## 4. He thong va cong cu

| Cong cu / He thong | Muc dich | Tai khoan can | Ghi chu |
|---------------------|----------|---------------|---------|
| GitHub / GitLab | Source code | [Type] | [...] |
| CI/CD | Deployment | [Type] | [...] |
| Monitoring | Alerts | [Type] | [...] |
| Ticketing | Issue tracking | [Type] | [...] |

## 5. Lich cong viec dinh ky

| Tan suat | Cong viec | Thoi gian | Nguoi chiu trach nhiem |
|----------|-----------|-----------|------------------------|
| Hang ngay | [Monitoring check] | [HH:mm JST] | [Role] |
| Hang tuan | [Report gui khach] | [Thu N, HH:mm JST] | [Role] |
| Hang thang | [Bao cao bao tri] | [Ngay N hang thang] | [Role] |

## 6. Luu y van hanh va kinh nghiem

### Nhung dieu CAN BIET (gotchas)

- [Gotcha 1 — vi du: "Deploy vao thu 6 JST thuong gay lag do job batch chay"]
- [Gotcha 2]

### Xu ly su co thuong gap

| Trieu chung | Nguyen nhan thuong gap | Cach xu ly |
|-------------|----------------------|------------|
| [Loi X] | [...] | [...] |

### Rollback procedure

[Mo ta cach rollback khi deploy co van de]

## 7. Tai lieu bo sung

| Tai lieu | Duong dan | Mo ta |
|----------|-----------|-------|
| Codebase overview | `docs/baseline/codebase-overview.md` | [...] |
| API docs | `docs/api/` | [...] |
| Screen docs | `docs/screens/` | [...] |
| ADRs | `docs/decisions/` | [...] |
| Sprint history | [link] | [...] |

---
<!-- Template version: 1.0 | Tao boi /pm-handover -->
