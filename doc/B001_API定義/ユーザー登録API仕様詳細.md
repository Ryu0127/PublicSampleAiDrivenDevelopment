# ユーザー登録API仕様詳細

## 基本情報
- **API名**: ユーザー登録API
- **エンドポイント**: POST /api/users/register
- **概要**: 新規ユーザーアカウントを作成する
- **認証**: 不要（パブリックAPI）
- **Content-Type**: application/json

## リクエスト仕様

### URL
```
POST /api/users/register
```

### ヘッダー
```
Content-Type: application/json
Accept: application/json
```

### パラメータ

| 項目名 | 型 | 必須 | 制約 | 説明 |
|--------|----|----|------|------|
| name | string | ✓ | max:255 | ユーザー名 |
| email | string | ✓ | email形式, unique, max:255 | メールアドレス |
| password | string | ✓ | min:8文字, confirmed | パスワード |
| password_confirmation | string | ✓ | passwordと同じ値 | パスワード確認 |

### リクエスト例
```json
{
  "name": "山田太郎",
  "email": "yamada@example.com",
  "password": "password123",
  "password_confirmation": "password123",
}
```

## レスポンス仕様

### 成功時（201 Created）
```json
{
  "success": true,
  "message": "ユーザー登録が完了しました",
  "data": {
    "id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "email_verified_at": null,
    "created_at": "2025-08-19T12:00:00.000000Z",
    "updated_at": "2025-08-19T12:00:00.000000Z"
  },
  "token": {
    "type": "Bearer",
    "access_token": "1|abcdef123456...",
    "expires_at": null
  }
}
```

### エラー時（422 Unprocessable Entity）
```json
{
  "success": false,
  "message": "入力データに誤りがあります",
  "errors": {
    "email": [
      "このメールアドレスは既に使用されています"
    ],
    "password": [
      "パスワードは8文字以上である必要があります"
    ]
  }
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "message": "サーバーエラーが発生しました",
  "errors": {}
}
```

## バリデーションルール

| 項目 | ルール |
|------|-------|
| name | required, string, max:255 |
| email | required, email, unique:users,email, max:255 |
| password | required, string, min:8, confirmed |
| password_confirmation | required, same:password |

## セキュリティ考慮事項

1. **パスワード要件**
   - 最低8文字以上
   - 英数字組み合わせを推奨

2. **レート制限**
   - 同一IPからの連続登録を制限（5回/時間）

3. **メール検証**
   - 登録後にメール認証を実装予定

4. **データ保護**
   - パスワードはbcryptでハッシュ化
   - 個人情報の適切な暗号化

## HTTPステータスコード

| コード | 説明 |
|--------|------|
| 201 | 作成成功 |
| 422 | バリデーションエラー |
| 429 | レート制限超過 |
| 500 | サーバーエラー |

## 実装時の注意点

1. メールアドレスの重複チェック
2. パスワードの暗号化処理
3. 適切なエラーハンドリング
4. ログ出力（機密情報を除く）
5. API仕様書との整合性確認

---
作成日: 2025-08-19  
作成者: Claude Code  
バージョン: 1.0