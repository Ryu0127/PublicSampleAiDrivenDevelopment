## TBL名：his_employee_historie（社員履歴）

### 1. テーブル概要
社員の異動・昇進履歴を管理する。

### 2. テーブル定義
| カラム名 | カラム名（論理名） | データ型 | サイズ | NULL許可 | デフォルト | 制約 | 説明 |
|----------|-------------------|----------|--------|----------|------------|------|------|
| id | 履歴ID | INT | - | NO | AUTO_INCREMENT | PK |  |
| employee_id | 社員ID | INT | - | NO | NULL | - |  |
| old_department_id | 変更前部署ID | INT | - | YES | NULL | - |  |
| new_department_id | 変更後部署ID | INT | - | YES | NULL | - |  |
| old_position_id | 変更前役職ID | INT | - | YES | NULL | - |  |
| new_position_id | 変更後役職ID | INT | - | YES | NULL | - |  |
| created_user_id | 記録者ユーザーID | INT | - | NO | NULL | - |  |
| change_type | 変更種別 | VARCHAR | 10 | NO | NULL | - |  |
| effective_date | 発効日 | DATE | - | NO | NULL | - |  |
| previous_salary | 変更前基本給 | INT | - | YES | NULL | - |  |
| new_salary | 変更後基本給 | INT | - | YES | NULL | - |  |
| reason | 変更理由 | TEXT | - | YES | NULL | - |  |
| created_at | 作成日時 | DATETIME | - | YES | NULL | - |  |
| updated_at | 更新日時 | DATETIME | - | YES | NULL | - |  |

### 3. 区分値定義

#### change_type（変更種別）
- 1: 部署異動
- 2: 昇進
- 3: 昇格
- 4: 降格
- 5: 給与改定