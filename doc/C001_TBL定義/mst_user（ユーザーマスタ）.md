## TBL名：mst_user（ユーザーマスタ）

### 1. テーブル概要
システムへのログインユーザー情報を管理する。

### 2. テーブル定義
| カラム名 | カラム名（論理名） | データ型 | サイズ | NULL許可 | デフォルト | 制約 | 説明 |
|----------|-------------------|----------|--------|----------|------------|------|------|
| id | ユーザーID | INT | - | NO | AUTO_INCREMENT | PK |  |
| employee_id | 社員ID | INT | - | YES | NULL | - |  |
| user_name | ユーザー名 | VARCHAR | 255 | NO | NULL | - |  |
| email | メールアドレス | VARCHAR | 255 | NO | NULL | - |  |
| email_verified_at | メール認証日時 | DATETIME | - | YES | NULL | - |  |
| password | パスワード | TEXT | - | NO | NULL | - |  |
| role | ユーザー権限 | VARCHAR | 10 | NO | NULL | - |  |
| active_flag | 有効フラグ | VARCHAR | 1 | NO | '0' | - |  |
| remember_token | ログイン保持トークン | VARCHAR | 100 | YES | NULL | - |  |
| created_at | 作成日時 | DATETIME | - | YES | NULL | - |  |
| updated_at | 更新日時 | DATETIME | - | YES | NULL | - |  |

### 3. 区分値定義

#### role（ユーザー権限）
- 1: 管理者権限
- 2: ユーザー権限