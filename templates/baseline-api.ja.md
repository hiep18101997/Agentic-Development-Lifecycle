<!-- lang: ja -->
<!-- このドキュメントは /docs-update スキルにより更新されます -->
# API定義書: [メソッド] [エンドポイント]

**エンドポイント**: `[METHOD] /api/v[N]/[path]`  
**ドメイン**: [Auth / User / Order / ...]  
**最終更新日時**: [YYYY-MM-DD HH:mm JST]  
**更新タスク**: [PROJECT-XXX]  
**コミット**: `[short-sha]` — [commit message]

---

## 概要

[このエンドポイントが何をするか、どのような目的で使用されるか]

## 認証

- **必要**: 必要 / 不要
- **種別**: Bearer Token / API Key / なし
- **権限**: [必要なロールまたはスコープ]

## リクエスト

### リクエストヘッダー

| キー | 必須 | 値 |
|-----|------|-----|
| `Authorization` | 必須 | `Bearer {token}` |
| `Content-Type` | 必須 | `application/json` |

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `{id}` | string/uuid | 必須 | [...] |

### クエリパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `page` | integer | 任意 | 1 | [...] |

### リクエストボディ

```json
{
  "field_name": "string",
  "another_field": 0
}
```

| フィールド | 型 | 必須 | バリデーション | 説明 |
|-----------|-----|------|-------------|------|
| `field_name` | string | 必須 | 最大255文字 | [...] |

## レスポンス

### 正常レスポンス

**ステータスコード**: `200 OK` / `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field": "value"
  },
  "message": "..."
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `data.id` | uuid | [...] |

### エラーレスポンス

| ステータス | エラーコード | 説明 | 発生条件 |
|-----------|------------|------|---------|
| `400` | `VALIDATION_ERROR` | 入力値が不正 | フィールドが欠如または形式不正 |
| `401` | `UNAUTHORIZED` | 未認証 | トークンが未指定または有効期限切れ |
| `403` | `FORBIDDEN` | 権限不足 | 必要なロールを持っていない |
| `404` | `NOT_FOUND` | リソースが存在しない | IDが無効 |
| `409` | `CONFLICT` | 競合 | [具体的なケース] |
| `500` | `INTERNAL_ERROR` | サーバーエラー | 予期しないエラー |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": {}
  }
}
```

## 業務ルール

| ID | ルール |
|----|--------|
| BR-001 | [このエンドポイントに適用されるルール] |

## レート制限

- 制限: [N リクエスト/分] / なし
- ヘッダー: `X-RateLimit-Remaining`

## 実行例

### 正常リクエスト例

```bash
curl -X POST https://api.example.com/api/v1/[endpoint] \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "value"
  }'
```

## 備考

[副作用、バックグラウンドジョブの起動、発行されるイベント、キャッシュの動作など...]
