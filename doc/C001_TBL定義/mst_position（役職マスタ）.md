## TBL名：mst_position（役職マスタ）

### 1. テーブル概要
役職・職位情報を管理する。

### 2. テーブル定義
| カラム名 | カラム名（論理名） | データ型 | サイズ | NULL許可 | デフォルト | 制約 | 説明 |
|----------|-------------------|----------|--------|----------|------------|------|------|
| id | 役職ID | INT | - | NO | AUTO_INCREMENT | PK |  |
| position_name | 役職名 | VARCHAR | 100 | NO | NULL | - |  |
| position_code | 役職コード | VARCHAR | 20 | NO | NULL | - |  |
| level | 役職レベル | INT | - | NO | NULL | - |  |
| description | 役職説明 | TEXT | - | YES | NULL | - |  |
| active_flag | 有効フラグ | VARCHAR | 1 | NO | '0' | - |  |
| created_at | 作成日時 | DATETIME | - | YES | NULL | - |  |
| updated_at | 更新日時 | DATETIME | - | YES | NULL | - |  |