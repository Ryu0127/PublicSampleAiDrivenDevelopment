# React フロントエンド設計
## AI駆動開発調査プロジェクト - Web社員管理システム

**文書管理情報**
- 作成日: 2025-08-21
- バージョン: 1.0
- 作成者: AI駆動開発チーム
- 承認者: -
- 最終更新日: 2025-08-21

---

## 1. フロントエンド アーキテクチャ

### 1.1. 技術スタック
- **React 18**: モダンなUI構築
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: ユーティリティファーストCSS
- **React Router v6**: SPA ルーティング
- **Axios**: HTTP クライアント
- **Context API**: 状態管理

### 1.2. ディレクトリ構造
```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── common/         # 共通コンポーネント
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── layout/         # レイアウトコンポーネント
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── MainLayout/
│   └── domain/         # ドメイン固有コンポーネント
│       ├── Employee/
│       ├── Department/
│       └── Auth/
├── pages/              # ページコンポーネント
│   ├── LoginPage/
│   ├── DashboardPage/
│   ├── EmployeeListPage/
│   └── EmployeeDetailPage/
├── hooks/              # カスタムフック
├── services/           # API通信サービス
├── types/              # TypeScript型定義
└── utils/              # ユーティリティ関数
```

---

## 2. コンポーネント設計

### 2.1. 共通コンポーネント

#### Button コンポーネント
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

#### Table コンポーネント
```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export const Table = <T extends { id: number }>({
  data,
  columns,
  loading,
  onRowClick,
}: TableProps<T>) => {
  if (loading) return <TableSkeleton />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-6 py-3 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4">
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 2.2. ドメインコンポーネント

#### EmployeeList コンポーネント
```typescript
interface Employee {
  id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  department: { name: string };
  position: { name: string };
  employment_status: string;
}

interface EmployeeListProps {
  employees: Employee[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns: Column<Employee>[] = [
    { key: 'employee_number', header: '社員番号' },
    {
      key: 'first_name',
      header: '氏名',
      render: (_, employee) => `${employee.last_name} ${employee.first_name}`,
    },
    {
      key: 'department',
      header: '部署',
      render: (department) => department?.name || '-',
    },
    {
      key: 'position',
      header: '役職',
      render: (position) => position?.name || '-',
    },
    {
      key: 'employment_status',
      header: '雇用状態',
      render: (status) => (
        <Badge variant={status === 'active' ? 'success' : 'secondary'}>
          {getEmploymentStatusLabel(status)}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: '操作',
      render: (_, employee) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(employee.id)}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(employee.id)}
          >
            削除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={employees}
      columns={columns}
      loading={loading}
      onRowClick={(employee) => onEdit(employee.id)}
    />
  );
};
```

---

## 3. 状態管理設計

### 3.1. Context API 設計

#### AuthContext
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'readonly';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    authService.logout();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 3.2. カスタムフック設計

#### useEmployees フック
```typescript
interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: (filters?: EmployeeFilters) => Promise<void>;
  createEmployee: (data: EmployeeFormData) => Promise<void>;
  updateEmployee: (id: number, data: EmployeeFormData) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async (filters?: EmployeeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees(filters);
      setEmployees(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data: EmployeeFormData) => {
    try {
      await employeeService.createEmployee(data);
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : '作成に失敗しました');
      throw err;
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (
    id: number,
    data: EmployeeFormData
  ) => {
    try {
      await employeeService.updateEmployee(id, data);
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
      throw err;
    }
  }, [fetchEmployees]);

  const deleteEmployee = useCallback(async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      throw err;
    }
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
```

---

## 4. ルーティング設計

### 4.1. アプリケーションルート
```typescript
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="employees/new" element={<EmployeeFormPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="departments" element={<DepartmentListPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
```

### 4.2. 認証ガード
```typescript
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};
```

---

## 5. パフォーマンス最適化

### 5.1. コード分割
```typescript
// ページレベルでの遅延読み込み
const EmployeeListPage = lazy(() => import('../pages/EmployeeListPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Suspenseでラップ
<Suspense fallback={<PageSkeleton />}>
  <EmployeeListPage />
</Suspense>
```

### 5.2. メモ化最適化
```typescript
// React.memoでコンポーネントをメモ化
export const EmployeeCard = React.memo<EmployeeCardProps>(({
  employee,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded p-4">
      <h3>{employee.name}</h3>
      <p>{employee.department}</p>
      <div className="mt-2">
        <Button onClick={() => onEdit(employee.id)}>編集</Button>
        <Button onClick={() => onDelete(employee.id)}>削除</Button>
      </div>
    </div>
  );
});

// useMemoで計算結果をメモ化
const filteredEmployees = useMemo(() => {
  return employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [employees, searchTerm]);
```

---

**備考**: 本設計書はAI駆動開発の調査目的で作成されており、実装過程で得られた知見により適宜更新される予定です。