## TBL名：mst_department（部署マスタ）

### 1. テーブル概要
組織の部署情報を管理する。

### 2. テーブル定義
| カラム名 | カラム名（論理名） | データ型 | サイズ | NULL許可 | デフォルト | 制約 | 説明 |
|----------|-------------------|----------|--------|----------|------------|------|------|
| id | 部署ID | INT | - | NO | AUTO_INCREMENT | PK |  |
| parent_department_id | 上位部署ID | INT | - | YES | NULL | - |  |
| manager_employee_id | 部署長社員ID | INT | - | YES | NULL | - |  |
| department_name | 部署名 | VARCHAR | 100 | NO | NULL | - |  |
| department_code | 部署コード | VARCHAR | 20 | NO | NULL | - |  |
| description | 部署説明 | TEXT | - | YES | NULL | - |  |
| active_flag | 有効フラグ | VARCHAR | 1 | NO | '0' | - |  |
| display_order | 表示順 | INT | - | NO | NULL | - |  |
| created_at | 作成日時 | DATETIME | - | YES | NULL | - |  |
| updated_at | 更新日時 | DATETIME | - | YES | NULL | - |  |