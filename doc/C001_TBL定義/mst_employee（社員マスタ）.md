## TBL名：mst_employee（社員マスタ）

### 1. テーブル概要
社員の基本情報を管理する。

### 2. テーブル定義
| カラム名 | カラム名（論理名） | データ型 | サイズ | NULL許可 | デフォルト | 制約 | 説明 |
|----------|-------------------|----------|--------|----------|------------|------|------|
| id | 社員ID | INT | - | NO | AUTO_INCREMENT | PK |  |
| user_id | ユーザーID | INT | - | YES | NULL | - |  |
| department_id | 部署ID | INT | - | YES | NULL | - |  |
| position_id | 役職ID | INT | - | YES | NULL | - |  |
| employee_code | 社員番号 | VARCHAR | 20 | NO | NULL | - |  |
| first_name | 名 | VARCHAR | 50 | NO | NULL | - |  |
| last_name | 姓 | VARCHAR | 50 | NO | NULL | - |  |
| first_name_kana | 名（カナ） | VARCHAR | 50 | YES | NULL | - |  |
| last_name_kana | 姓（カナ） | VARCHAR | 50 | YES | NULL | - |  |
| email | 会社メールアドレス | TEXT | - | YES | NULL | - |  |
| phone | 電話番号 | VARCHAR | 20 | YES | NULL | - |  |
| mobile | 携帯電話番号 | VARCHAR | 20 | YES | NULL | - |  |
| birth_date | 生年月日 | DATE | - | YES | NULL | - |  |
| gender | 性別 | VARCHAR | 1 | YES | NULL | - |  |
| postal_code | 郵便番号 | VARCHAR | 10 | YES | NULL | - |  |
| address | 住所 | TEXT | - | YES | NULL | - |  |
| hire_date | 入社日 | DATE | - | NO | NULL | - |  |
| employment_status | 雇用状態 | VARCHAR | 10 | NO | NULL | - |  |
| salary | 基本給 | INT | - | YES | NULL | - |  |
| notes | 備考 | TEXT | - | YES | NULL | - |  |
| avatar_path | プロフィール画像パス | TEXT | - | YES | NULL | - |  |
| active_flag | 有効フラグ | VARCHAR | 1 | NO | '0' | - |  |
| created_at | 作成日時 | DATETIME | - | YES | NULL | - |  |
| updated_at | 更新日時 | DATETIME | - | YES | NULL | - |  |

### 3. 区分値定義

#### gender（性別）
- 1: 男性
- 2: 女性

#### employment_status（雇用状態）
- 1: 正社員
- 2: 契約社員
- 3: 派遣社員
- 4: アルバイト
- 5: 退職