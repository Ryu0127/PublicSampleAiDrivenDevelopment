# Laravel バックエンド設計
## AI駆動開発調査プロジェクト - Web社員管理システム

**文書管理情報**
- 作成日: 2025-08-21
- バージョン: 1.0
- 作成者: AI駆動開発チーム
- 承認者: -
- 最終更新日: 2025-08-21

---

## 1. バックエンド アーキテクチャ

### 1.1. レイヤー構成
```
┌─────────────────────────────────────────┐
│             Controller Layer             │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ Controllers │  │   Middleware    │   │
│  │             │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│             Service Layer                │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │  Services   │  │   Validators    │   │
│  │             │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│             Data Access Layer            │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Models    │  │  Repositories   │   │
│  │             │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

### 1.2. ディレクトリ構造
```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php
│   │       ├── EmployeeController.php
│   │       ├── DepartmentController.php
│   │       └── DashboardController.php
│   ├── Middleware/
│   ├── Requests/
│   │   ├── Auth/
│   │   ├── Employee/
│   │   └── Department/
│   └── Resources/
├── Models/
├── Services/
└── Jobs/
```

---

## 2. コントローラー設計

### 2.1. EmployeeController
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeIndexRequest;
use App\Http\Requests\Employee\EmployeeStoreRequest;
use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeService $employeeService
    ) {}

    /**
     * 社員一覧取得
     */
    public function index(EmployeeIndexRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $employees = $this->employeeService->getEmployees($filters);
        
        return EmployeeResource::collection($employees)->response();
    }

    /**
     * 社員詳細取得
     */
    public function show(int $id): JsonResponse
    {
        $employee = $this->employeeService->getEmployee($id);
        
        return new EmployeeResource($employee);
    }

    /**
     * 社員新規作成
     */
    public function store(EmployeeStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $employee = $this->employeeService->createEmployee($data);
        
        return (new EmployeeResource($employee))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * 社員情報更新
     */
    public function update(EmployeeUpdateRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $employee = $this->employeeService->updateEmployee($id, $data);
        
        return new EmployeeResource($employee);
    }

    /**
     * 社員削除
     */
    public function destroy(int $id): JsonResponse
    {
        $this->employeeService->deleteEmployee($id);
        
        return response()->json([
            'message' => '社員情報を削除しました'
        ]);
    }
}
```

### 2.2. AuthController
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * ログイン
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $result = $this->authService->login($credentials);
        
        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
            'expires_at' => $result['expires_at'],
        ]);
    }

    /**
     * ログアウト
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        
        return response()->json([
            'message' => 'ログアウトしました'
        ]);
    }

    /**
     * 現在のユーザー情報取得
     */
    public function user(Request $request): JsonResponse
    {
        return new UserResource($request->user());
    }
}
```

---

## 3. サービス層設計

### 3.1. EmployeeService
```php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeHistory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    public function __construct(
        private Employee $employee,
        private EmployeeHistory $employeeHistory
    ) {}

    /**
     * 社員一覧取得
     */
    public function getEmployees(array $filters = []): LengthAwarePaginator
    {
        $query = $this->employee->with(['department', 'position', 'user'])
            ->where('is_active', true);

        // 部署フィルター
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // 雇用状態フィルター
        if (!empty($filters['employment_status'])) {
            $query->where('employment_status', $filters['employment_status']);
        }

        // 検索フィルター
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                  ->orWhere('last_name', 'like', "%{$filters['search']}%")
                  ->orWhere('employee_number', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * 社員詳細取得
     */
    public function getEmployee(int $id): Employee
    {
        return $this->employee->with(['department', 'position', 'user'])
            ->where('is_active', true)
            ->findOrFail($id);
    }

    /**
     * 社員新規作成
     */
    public function createEmployee(array $data): Employee
    {
        DB::beginTransaction();
        
        try {
            // 社員番号の自動生成（指定されていない場合）
            if (empty($data['employee_number'])) {
                $data['employee_number'] = $this->generateEmployeeNumber();
            }

            $employee = $this->employee->create($data);
            
            // 入社履歴を自動記録
            $this->employeeHistory->create([
                'employee_id' => $employee->id,
                'change_type' => 'hire',
                'effective_date' => $employee->hire_date,
                'new_department_id' => $employee->department_id,
                'new_position_id' => $employee->position_id,
                'new_salary' => $employee->salary,
                'reason' => '入社',
                'created_by' => auth()->id(),
            ]);
            
            DB::commit();
            
            return $employee->load(['department', 'position', 'user']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 社員情報更新
     */
    public function updateEmployee(int $id, array $data): Employee
    {
        DB::beginTransaction();
        
        try {
            $employee = $this->getEmployee($id);
            $originalData = $employee->toArray();
            
            $employee->update($data);
            
            // 重要な変更があった場合は履歴に記録
            $this->recordHistoryIfNeeded($employee, $originalData);
            
            DB::commit();
            
            return $employee->fresh(['department', 'position', 'user']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 社員削除（論理削除）
     */
    public function deleteEmployee(int $id): void
    {
        $employee = $this->getEmployee($id);
        
        DB::beginTransaction();
        
        try {
            // 論理削除
            $employee->update([
                'is_active' => false,
                'employment_status' => 'terminated'
            ]);
            
            // 退職履歴を記録
            $this->employeeHistory->create([
                'employee_id' => $employee->id,
                'change_type' => 'termination',
                'effective_date' => now()->toDateString(),
                'previous_department_id' => $employee->department_id,
                'previous_position_id' => $employee->position_id,
                'previous_salary' => $employee->salary,
                'reason' => '退職',
                'created_by' => auth()->id(),
            ]);
            
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 社員番号自動生成
     */
    private function generateEmployeeNumber(): string
    {
        $year = now()->format('Y');
        $lastEmployee = $this->employee
            ->where('employee_number', 'like', "EMP{$year}%")
            ->orderBy('employee_number', 'desc')
            ->first();

        if (!$lastEmployee) {
            return "EMP{$year}001";
        }

        $lastNumber = (int) substr($lastEmployee->employee_number, -3);
        $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        
        return "EMP{$year}{$newNumber}";
    }

    /**
     * 履歴記録が必要かチェック
     */
    private function recordHistoryIfNeeded(Employee $employee, array $originalData): void
    {
        $changeType = null;
        
        // 部署変更
        if ($originalData['department_id'] !== $employee->department_id) {
            $changeType = 'department_change';
        }
        // 役職変更
        elseif ($originalData['position_id'] !== $employee->position_id) {
            $changeType = 'promotion';
        }
        // 給与変更
        elseif ($originalData['salary'] !== $employee->salary) {
            $changeType = 'salary_change';
        }

        if ($changeType) {
            $this->employeeHistory->create([
                'employee_id' => $employee->id,
                'change_type' => $changeType,
                'effective_date' => now()->toDateString(),
                'previous_department_id' => $originalData['department_id'],
                'new_department_id' => $employee->department_id,
                'previous_position_id' => $originalData['position_id'],
                'new_position_id' => $employee->position_id,
                'previous_salary' => $originalData['salary'],
                'new_salary' => $employee->salary,
                'created_by' => auth()->id(),
            ]);
        }
    }
}
```

---

## 4. リクエストバリデーション

### 4.1. EmployeeStoreRequest
```php
<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Employee::class);
    }

    public function rules(): array
    {
        return [
            'employee_number' => [
                'nullable',
                'string',
                'max:20',
                'unique:employees,employee_number',
                'regex:/^[A-Z0-9\-_]+$/',
            ],
            'user_id' => 'nullable|exists:users,id|unique:employees,user_id',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'first_name_kana' => 'nullable|string|max:50',
            'last_name_kana' => 'nullable|string|max:50',
            'email' => [
                'nullable',
                'email:rfc,dns',
                'max:255',
                'unique:employees,email',
            ],
            'phone' => 'nullable|string|max:20|regex:/^[\d\-\(\)\+\s]+$/',
            'mobile' => 'nullable|string|max:20|regex:/^[\d\-\(\)\+\s]+$/',
            'birth_date' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'postal_code' => 'nullable|string|max:10|regex:/^\d{3}-?\d{4}$/',
            'address' => 'nullable|string|max:500',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
            'hire_date' => 'required|date',
            'employment_status' => 'required|in:active,inactive,retired,terminated',
            'salary' => 'nullable|numeric|min:0|max:99999999.99',
            'notes' => 'nullable|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_number.required' => '社員番号は必須です',
            'employee_number.unique' => 'この社員番号は既に使用されています',
            'first_name.required' => '名前は必須です',
            'last_name.required' => '苗字は必須です',
            'email.email' => 'メールアドレスの形式が正しくありません',
            'email.unique' => 'このメールアドレスは既に使用されています',
            'phone.regex' => '電話番号の形式が正しくありません',
            'birth_date.before' => '生年月日は今日より前の日付を入力してください',
            'hire_date.required' => '入社日は必須です',
            'postal_code.regex' => '郵便番号の形式が正しくありません（例: 123-4567）',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'employee_number' => $this->employee_number ? 
                strtoupper(trim($this->employee_number)) : null,
            'first_name' => trim($this->first_name),
            'last_name' => trim($this->last_name),
            'email' => $this->email ? 
                strtolower(trim($this->email)) : null,
        ]);
    }
}
```

---

## 5. APIレスポンス設計

### 5.1. EmployeeResource
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'employee_number' => $this->employee_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'first_name_kana' => $this->first_name_kana,
            'last_name_kana' => $this->last_name_kana,
            'email' => $this->email,
            'phone' => $this->phone,
            'mobile' => $this->mobile,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'gender' => $this->gender,
            'postal_code' => $this->postal_code,
            'address' => $this->address,
            'hire_date' => $this->hire_date->format('Y-m-d'),
            'employment_status' => $this->employment_status,
            'salary' => $this->when(
                $request->user()->can('viewSalary', $this->resource),
                $this->salary
            ),
            'notes' => $this->notes,
            'avatar_path' => $this->avatar_path,
            'is_active' => $this->is_active,
            
            // リレーション
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'position' => new PositionResource($this->whenLoaded('position')),
            'user' => new UserResource($this->whenLoaded('user')),
            
            // タイムスタンプ
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

---

## 6. ミドルウェア設計

### 6.1. RoleMiddleware
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['error' => '認証が必要です'], 401);
        }

        if (!in_array($request->user()->role, $roles)) {
            return response()->json(['error' => 'この操作を実行する権限がありません'], 403);
        }

        return $next($request);
    }
}
```

---

**備考**: 本設計書はAI駆動開発の調査目的で作成されており、実装過程で得られた知見により適宜更新される予定です。