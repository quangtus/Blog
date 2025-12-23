# 🎁 HƯỚNG DẪN TOÀN DIỆN VỀ CƠ CHẾ "BỌC THẺ" - PROVIDER PATTERN

## Tài liệu chi tiết dành cho người mới học React

---

# 📑 MỤC LỤC

1. [Provider là gì? Tại sao cần bọc thẻ?](#phần-1-provider-là-gì)
2. [Nguyên lý hoạt động của children](#phần-2-nguyên-lý-children)
3. [Các loại Provider phổ biến](#phần-3-các-loại-provider)
4. [Xây dựng Provider từ đầu](#phần-4-xây-dựng-provider)
5. [Áp dụng trong dự án Blog](#phần-5-áp-dụng-trong-dự-án)
6. [Bảng tổng hợp so sánh](#phần-6-tổng-hợp)

---

# PHẦN 1: PROVIDER LÀ GÌ?

## 1.1 Ví dụ đời thường

```
Hãy tưởng tượng một tòa nhà:

┌──────────────────────────────────────────────────────────────────┐
│ 🏢 TÒA NHÀ (Provider bọc ngoài cùng)                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 💡 HỆ THỐNG ĐIỆN (Như QueryClientProvider)                   │ │
│  │    → Cung cấp điện cho TẤT CẢ các tầng bên trong             │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │ 🚪 HỆ THỐNG CỬA/THANG MÁY (Như BrowserRouter)          │ │ │
│  │  │    → Cho phép DI CHUYỂN giữa các tầng                   │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌──────────────────────────────────────────────────┐  │ │ │
│  │  │  │ 🔐 HỆ THỐNG BẢO VỆ (Như AuthProvider)            │  │ │ │
│  │  │  │    → Kiểm soát AI được vào/ra                    │  │ │ │
│  │  │  │                                                   │  │ │ │
│  │  │  │  ┌───────────────────────────────────────────┐   │  │ │ │
│  │  │  │  │ 🏠 CÁC PHÒNG (Như Layout)                  │   │  │ │ │
│  │  │  │  │    → Cung cấp cấu trúc chung              │   │  │ │ │
│  │  │  │  │                                            │   │  │ │ │
│  │  │  │  │    [Phòng A] [Phòng B] [Phòng C]          │   │  │ │ │
│  │  │  │  │      (Home)  (Detail)  (Create)           │   │  │ │ │
│  │  │  │  └───────────────────────────────────────────┘   │  │ │ │
│  │  │  └──────────────────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

→ Mọi "phòng" (component con) đều được hưởng:
  ✓ Điện (data fetching)
  ✓ Thang máy (navigation)
  ✓ Bảo vệ (authentication)
  ✓ Cấu trúc chung (header/footer)
```

## 1.2 Định nghĩa kỹ thuật

**Provider** = Component cha có khả năng **CHIA SẺ** dữ liệu/chức năng cho **TẤT CẢ** component con bên trong nó.

```
┌──────────────────────────────────────────────────────────────────┐
│                      CÔNG THỨC                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  <Provider value={gìĐóĐểChiaSẻ}>                                 │
│      <ComponentCon1 />   ← Dùng được gìĐóĐểChiaSẻ                │
│      <ComponentCon2 />   ← Dùng được gìĐóĐểChiaSẻ                │
│      <ComponentCháu />   ← Dùng được gìĐóĐểChiaSẻ                │
│  </Provider>                                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

# PHẦN 2: NGUYÊN LÝ CHILDREN - TẠI SAO CÓ THỂ "BỌC"?

## 2.1 `children` là gì?

Trong React, **mọi component** đều có thể nhận một prop đặc biệt gọi là `children`.

```jsx
// children = những gì nằm GIỮA thẻ mở và thẻ đóng

<ParentComponent>
    <p>Đây là children!</p>    ← children
    <Button>Click me</Button>  ← children
</ParentComponent>
```

## 2.2 Cách children hoạt động

```jsx
// 📁 Ví dụ: Tạo component HộpMàu

// BƯỚC 1: Component cha nhận children
const HộpMàu = ({ children, màu }) => {
    return (
        <div style={{ backgroundColor: màu, padding: '20px' }}>
            {children}   {/* ← Render những gì truyền vào */}
        </div>
    );
};

// BƯỚC 2: Sử dụng
<HộpMàu màu="red">
    <h1>Tiêu đề</h1>           ← Đây là children
    <p>Nội dung</p>            ← Đây cũng là children
</HộpMàu>

// BƯỚC 3: Kết quả render
<div style={{ backgroundColor: 'red', padding: '20px' }}>
    <h1>Tiêu đề</h1>
    <p>Nội dung</p>
</div>
```

## 2.3 Sơ đồ minh họa

```
┌────────────────────────────────────────────────────────────────┐
│                    JSX BẠN VIẾT                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  <HộpMàu màu="blue">                                           │
│      <Button>Click</Button>                                     │
│  </HộpMàu>                                                      │
│                                                                 │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                 REACT CHUYỂN THÀNH                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HộpMàu({                                                       │
│      màu: "blue",                                               │
│      children: <Button>Click</Button>   ← children là prop!    │
│  })                                                             │
│                                                                 │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                     HTML KẾT QUẢ                               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  <div style="background: blue; padding: 20px">                 │
│      <button>Click</button>                                     │
│  </div>                                                         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 2.4 Tại sao có thể lồng nhau?

```jsx
// Mỗi lớp bọc đều nhận children và truyền tiếp xuống

<A>              // A nhận children = <B>...</B>
    <B>          // B nhận children = <C>...</C>
        <C>      // C nhận children = "Hello"
            Hello
        </C>
    </B>
</A>

// RENDER RA:
// A bọc → B bọc → C bọc → "Hello"
```

---

# PHẦN 3: CÁC LOẠI PROVIDER PHỔ BIẾN

## 3.1 Bảng phân loại

| Loại | Mục đích | Ví dụ | Cung cấp gì? |
|:-----|:---------|:------|:-------------|
| **Context Provider** | Chia sẻ state toàn cục | `AuthProvider` | Data + Functions |
| **Router Provider** | Điều hướng trang | `BrowserRouter` | Navigation |
| **Query Provider** | Quản lý fetch data | `QueryClientProvider` | Caching + Fetching |
| **Layout Wrapper** | Cấu trúc UI chung | `Layout` | Header + Footer |
| **Theme Provider** | Giao diện/màu sắc | `ThemeProvider` | CSS Variables |
| **Guard/Route** | Bảo vệ đường dẫn | `AdminRoute` | Access Control |

## 3.2 Chi tiết từng loại

### 🔐 A. Context Provider (AuthProvider trong dự án)

**Mục đích:** Chia sẻ thông tin user đăng nhập cho toàn bộ ứng dụng

```
┌──────────────────────────────────────────────────────────────────┐
│                    AuthProvider                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📦 CUNG CẤP:                                                    │
│  ├── user          → Thông tin user hiện tại                     │
│  ├── loading       → Đang tải hay không                          │
│  ├── login()       → Hàm đăng nhập                               │
│  ├── logout()      → Hàm đăng xuất                               │
│  ├── register()    → Hàm đăng ký                                 │
│  ├── isAuthenticated → Đã đăng nhập chưa                         │
│  └── isAdmin       → Có phải admin không                         │
│                                                                   │
│  🎯 AI DÙNG ĐƯỢC?                                                │
│  → TẤT CẢ component con bên trong <AuthProvider>                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Cách sử dụng trong component con:**
```jsx
// Bất kỳ component nào bên trong AuthProvider
const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();  // ← Lấy từ Provider
    
    return (
        <div>
            {isAuthenticated ? `Xin chào ${user.name}` : 'Chưa đăng nhập'}
        </div>
    );
};
```

---

### 🚪 B. BrowserRouter (Điều hướng)

**Mục đích:** Cho phép di chuyển giữa các trang mà không reload

```
┌──────────────────────────────────────────────────────────────────┐
│                    BrowserRouter                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📦 CUNG CẤP:                                                    │
│  ├── <Link to="/path">   → Tạo link điều hướng                   │
│  ├── useNavigate()       → Điều hướng bằng code                  │
│  ├── useParams()         → Lấy params từ URL (/posts/:id)        │
│  ├── useLocation()       → Thông tin URL hiện tại                │
│  └── <Routes>/<Route>    → Định nghĩa các đường dẫn              │
│                                                                   │
│  🎯 KHÔNG CÓ BrowserRouter?                                      │
│  → Link, useNavigate, Routes... sẽ BÁO LỖI!                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Ví dụ lỗi khi không có BrowserRouter:**
```jsx
// ❌ SAI - Không có BrowserRouter bọc
const App = () => (
    <Link to="/">Home</Link>  // LỖI: useHref() may be used only in Router
);

// ✅ ĐÚNG - Có BrowserRouter bọc
const App = () => (
    <BrowserRouter>
        <Link to="/">Home</Link>  // OK!
    </BrowserRouter>
);
```

---

### 📊 C. QueryClientProvider (React Query)

**Mục đích:** Quản lý việc fetch data, caching, retry tự động

```
┌──────────────────────────────────────────────────────────────────┐
│                    QueryClientProvider                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📦 CUNG CẤP:                                                    │
│  ├── useQuery()     → Fetch data + cache + auto refetch          │
│  ├── useMutation()  → Thực hiện POST/PUT/DELETE                  │
│  ├── Cache         → Lưu data đã fetch để dùng lại              │
│  └── Retry Logic   → Tự động thử lại khi lỗi                    │
│                                                                   │
│  🎯 LỢI ÍCH:                                                     │
│  → Không cần viết loading state, error handling thủ công         │
│  → Data được cache, không fetch lại khi đã có                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Ví dụ so sánh:**
```jsx
// ❌ CÁCH CŨ - Không dùng React Query
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    setLoading(true);
    axios.get('/api/posts')
        .then(res => setPosts(res.data))
        .catch(err => setError(err))
        .finally(() => setLoading(false));
}, []);

// ✅ CÁCH MỚI - Dùng React Query (cần QueryClientProvider)
const { data: posts, isLoading, error } = useQuery('posts', () => 
    axios.get('/api/posts').then(res => res.data)
);
```

---

### 🖼️ D. Layout Wrapper (Cấu trúc chung)

**Mục đích:** Hiển thị Header/Footer/Sidebar chung cho mọi trang

```
┌──────────────────────────────────────────────────────────────────┐
│                        Layout                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📦 CUNG CẤP:                                                    │
│  ├── Header (Navbar)  → Thanh điều hướng trên cùng               │
│  ├── Footer           → Chân trang                               │
│  └── Container        → Vùng chứa nội dung chính                 │
│                                                                   │
│  🎯 CẤU TRÚC:                                                    │
│  ┌─────────────────────────────────────┐                         │
│  │           HEADER (Nav)              │                         │
│  ├─────────────────────────────────────┤                         │
│  │                                     │                         │
│  │         {children}                  │  ← Nội dung trang       │
│  │      (Home/Detail/Create...)        │                         │
│  │                                     │                         │
│  ├─────────────────────────────────────┤                         │
│  │           FOOTER                    │                         │
│  └─────────────────────────────────────┘                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Đặc điểm:** Layout KHÔNG phải là Provider thực sự (không dùng Context), 
nhưng dùng cùng pattern `children` để bọc nội dung.

---

### 🛡️ E. Route Guard (AdminRoute trong dự án)

**Mục đích:** Bảo vệ các trang chỉ dành cho admin

```
┌──────────────────────────────────────────────────────────────────┐
│                        AdminRoute                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📦 LOGIC:                                                       │
│  if (đang loading) → Hiển thị "Đang tải..."                      │
│  if (không phải admin) → Redirect về trang chủ                   │
│  if (là admin) → Render {children}                               │
│                                                                   │
│  🎯 SỬ DỤNG:                                                     │
│  <Route path="/admin" element={                                  │
│      <AdminRoute>                                                 │
│          <Dashboard />   ← Chỉ render nếu là admin               │
│      </AdminRoute>                                                │
│  } />                                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

# PHẦN 4: XÂY DỰNG PROVIDER TỪ ĐẦU

## 4.1 Các bước tạo Custom Provider

```
┌──────────────────────────────────────────────────────────────────┐
│               QUY TRÌNH 4 BƯỚC TẠO PROVIDER                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  BƯỚC 1: Tạo Context                                             │
│     const MyContext = createContext();                           │
│                                                                   │
│  BƯỚC 2: Tạo Custom Hook                                         │
│     export const useMyContext = () => useContext(MyContext);     │
│                                                                   │
│  BƯỚC 3: Tạo Provider Component                                  │
│     export const MyProvider = ({ children }) => {...}            │
│                                                                   │
│  BƯỚC 4: Bọc App và Sử dụng                                      │
│     <MyProvider><App /></MyProvider>                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 4.2 Ví dụ thực tế: Tạo AuthProvider

### BƯỚC 1: Tạo Context (Cái hộp rỗng)

```jsx
// 📁 resources/js/contexts/AuthContext.jsx

import { createContext } from 'react';

// Tạo một "hộp" rỗng để đựng dữ liệu
const AuthContext = createContext();

// AuthContext giống như một kênh radio
// - Provider là đài phát
// - useContext là máy thu
```

### BƯỚC 2: Tạo Custom Hook (Máy thu tiện lợi)

```jsx
import { useContext } from 'react';

// Custom hook để lấy data từ Context dễ dàng
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Kiểm tra xem có đang ở trong Provider không
    if (!context) {
        throw new Error('useAuth phải được dùng trong AuthProvider');
    }
    
    return context;
};

// Thay vì viết: const value = useContext(AuthContext);
// Chỉ cần viết: const value = useAuth();
```

### BƯỚC 3: Tạo Provider Component (Đài phát)

```jsx
import { useState, useEffect } from 'react';
import axios from '../config/axios';

export const AuthProvider = ({ children }) => {
    // ═══════════════════════════════════════
    // 1. KHAI BÁO STATE (Dữ liệu để chia sẻ)
    // ═══════════════════════════════════════
    const [user, setUser] = useState(null);       // Thông tin user
    const [loading, setLoading] = useState(true); // Đang tải?

    // ═══════════════════════════════════════
    // 2. CÁC HÀM XỬ LÝ (Logic để chia sẻ)
    // ═══════════════════════════════════════
    
    // Lấy thông tin user hiện tại
    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Hàm đăng nhập
    const login = async (email, password) => {
        const response = await axios.post('/api/login', { email, password });
        setUser(response.data.user);
        return response.data.user;
    };

    // Hàm đăng xuất
    const logout = async () => {
        await axios.post('/api/logout');
        setUser(null);
    };

    // ═══════════════════════════════════════
    // 3. CHẠY KHI COMPONENT MOUNT
    // ═══════════════════════════════════════
    useEffect(() => {
        fetchUser(); // Kiểm tra user đã đăng nhập chưa
    }, []);

    // ═══════════════════════════════════════
    // 4. ĐÓNG GÓI DATA & FUNCTIONS
    // ═══════════════════════════════════════
    const value = {
        // Data
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        
        // Functions
        login,
        logout,
        register,
    };

    // ═══════════════════════════════════════
    // 5. RENDER PROVIDER VỚI CHILDREN
    // ═══════════════════════════════════════
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
```

### BƯỚC 4: Bọc App và Sử dụng

```jsx
// 📁 resources/js/MainApp.jsx

import { AuthProvider } from './contexts/AuthContext';

function MainApp() {
    return (
        <AuthProvider>           {/* ← Bọc toàn bộ */}
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* ... */}
                </Routes>
            </Layout>
        </AuthProvider>
    );
}
```

```jsx
// 📁 resources/js/components/Layout/Layout.jsx

import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
    // Lấy data từ AuthProvider
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    
    return (
        <div>
            {isAuthenticated ? (
                <span>Xin chào {user.name}</span>
            ) : (
                <Link to="/login">Đăng nhập</Link>
            )}
            {children}
        </div>
    );
};
```

---

# PHẦN 5: ÁP DỤNG TRONG DỰ ÁN BLOG

## 5.1 Cấu trúc bọc thẻ trong dự án

```jsx
// 📁 resources/js/app.jsx (Entry Point)

ReactDOM.createRoot(document.getElementById('app')).render(
    <StrictMode>                           {/* Lớp 1: Debug mode */}
        <QueryClientProvider client={queryClient}>  {/* Lớp 2: Data fetching */}
            <BrowserRouter>                {/* Lớp 3: Routing */}
                <MainApp />                {/* Ứng dụng chính */}
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
```

```jsx
// 📁 resources/js/MainApp.jsx

function MainApp() {
    return (
        <AuthProvider>                     {/* Lớp 4: Authentication */}
            <Layout>                       {/* Lớp 5: UI Structure */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* ... */}
                </Routes>
            </Layout>
        </AuthProvider>
    );
}
```

## 5.2 Sơ đồ tổng thể

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ <StrictMode>                                           [Lớp 1: Debug]       │
│  │                                                                          │
│  └──<QueryClientProvider>                              [Lớp 2: Data]        │
│      │  📦 Cung cấp: useQuery, useMutation, cache                          │
│      │                                                                      │
│      └──<BrowserRouter>                                [Lớp 3: Navigation]  │
│          │  📦 Cung cấp: Link, useNavigate, useParams, Routes              │
│          │                                                                  │
│          └──<AuthProvider>                             [Lớp 4: Auth]        │
│              │  📦 Cung cấp: user, login, logout, isAuthenticated          │
│              │                                                              │
│              └──<Layout>                               [Lớp 5: UI]          │
│                  │  📦 Cung cấp: Header, Footer, Container                 │
│                  │                                                          │
│                  └──<Routes>                                                │
│                      │                                                      │
│                      ├── <Home />        ← Dùng được TẤT CẢ ở trên         │
│                      ├── <PostDetail />  ← Dùng được TẤT CẢ ở trên         │
│                      ├── <Login />       ← Dùng được TẤT CẢ ở trên         │
│                      └── <AdminRoute>    [Guard]                            │
│                           └── <Dashboard /> ← Chỉ admin mới vào được       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.3 Component nào dùng được gì?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PHẠM VI SỬ DỤNG CỦA MỖI PROVIDER                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Component          │ QueryClient │ Router    │ Auth      │ Layout          │
│  ───────────────────┼─────────────┼───────────┼───────────┼──────────       │
│  MainApp            │ ✅          │ ✅        │ ❌ (*)    │ ❌              │
│  Layout             │ ✅          │ ✅        │ ✅        │ ❌ (chính nó)   │
│  Home               │ ✅          │ ✅        │ ✅        │ ✅              │
│  PostDetail         │ ✅          │ ✅        │ ✅        │ ✅              │
│  Login              │ ✅          │ ✅        │ ✅        │ ✅              │
│  AdminRoute         │ ✅          │ ✅        │ ✅        │ ✅              │
│  Dashboard          │ ✅          │ ✅        │ ✅        │ ✅              │
│                                                                             │
│  (*) MainApp tạo AuthProvider nên không thể dùng useAuth() trong chính nó  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.4 Ví dụ sử dụng trong các component

### A. Home.jsx - Sử dụng nhiều Provider

```jsx
// 📁 resources/js/pages/Home.jsx

import { useQuery } from 'react-query';          // Từ QueryClientProvider
import { Link } from 'react-router-dom';         // Từ BrowserRouter
import { useAuth } from '../contexts/AuthContext'; // Từ AuthProvider

const Home = () => {
    // Từ AuthProvider
    const { isAuthenticated } = useAuth();
    
    // Từ QueryClientProvider
    const { data: posts, isLoading } = useQuery('posts', fetchPosts);
    
    return (
        <div>
            {/* Từ BrowserRouter */}
            {isAuthenticated && (
                <Link to="/posts/create">Tạo bài viết</Link>
            )}
            
            {isLoading ? 'Đang tải...' : posts.map(post => (
                <div key={post.id}>{post.title}</div>
            ))}
        </div>
    );
};
```

### B. Layout.jsx - Sử dụng Router + Auth

```jsx
// 📁 resources/js/components/Layout/Layout.jsx

import { Link, useNavigate } from 'react-router-dom'; // Từ BrowserRouter
import { useAuth } from '../../contexts/AuthContext';  // Từ AuthProvider

const Layout = ({ children }) => {
    // Từ AuthProvider
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    
    // Từ BrowserRouter
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();           // Từ AuthProvider
        navigate('/');      // Từ BrowserRouter
    };

    return (
        <div>
            <nav>
                {/* Link từ BrowserRouter */}
                <Link to="/">Home</Link>
                
                {/* isAuthenticated từ AuthProvider */}
                {isAuthenticated ? (
                    <>
                        <span>Xin chào {user.name}</span>
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                ) : (
                    <Link to="/login">Đăng nhập</Link>
                )}
            </nav>
            
            <main>
                {children}  {/* Nội dung các trang */}
            </main>
        </div>
    );
};
```

---

# PHẦN 6: TỔNG HỢP

## 6.1 Bảng so sánh các loại Wrapper/Provider

| Loại | Cách tạo | Cung cấp | Dùng khi nào |
|:-----|:---------|:---------|:-------------|
| **Context Provider** | `createContext()` + Provider | State + Functions | Chia sẻ data toàn cục |
| **BrowserRouter** | Thư viện `react-router-dom` | Navigation hooks | Cần điều hướng trang |
| **QueryClientProvider** | Thư viện `react-query` | Data fetching hooks | Cần fetch/cache data |
| **Layout** | Component với `children` | UI Structure | Cần header/footer chung |
| **Route Guard** | Component kiểm tra điều kiện | Access control | Bảo vệ trang |
| **StrictMode** | React built-in | Debug warnings | Development mode |

## 6.2 Quy tắc đặt thứ tự bọc

```
┌──────────────────────────────────────────────────────────────────┐
│                    THỨ TỰ ĐỀ XUẤT                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. StrictMode         → Ngoài cùng (chỉ dev)                    │
│  2. ErrorBoundary      → Bắt lỗi toàn app                        │
│  3. QueryClientProvider → Data layer                              │
│  4. BrowserRouter      → Navigation (trước các route)            │
│  5. AuthProvider       → Auth (sau router vì cần redirect)       │
│  6. ThemeProvider      → UI customization                        │
│  7. Layout             → Trong cùng (gần content nhất)           │
│                                                                   │
│  LÝ DO: Provider ở ngoài cung cấp cho tất cả bên trong           │
│  → Nếu AuthProvider cần useNavigate() thì phải ở trong Router    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 6.3 Lỗi thường gặp

### ❌ Lỗi 1: Dùng hook ngoài Provider

```jsx
// ❌ SAI
const App = () => {
    const { user } = useAuth(); // LỖI: Chưa có AuthProvider bọc!
    return <div>{user.name}</div>;
};

// ✅ ĐÚNG
const App = () => (
    <AuthProvider>
        <UserInfo />  {/* Component con mới dùng được useAuth */}
    </AuthProvider>
);

const UserInfo = () => {
    const { user } = useAuth(); // OK vì đang ở trong AuthProvider
    return <div>{user.name}</div>;
};
```

### ❌ Lỗi 2: Thứ tự bọc sai

```jsx
// ❌ SAI - AuthProvider ở ngoài BrowserRouter
<AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</AuthProvider>

// Nếu AuthProvider cần dùng useNavigate() → Lỗi!
// Vì useNavigate() cần BrowserRouter bọc bên ngoài

// ✅ ĐÚNG
<BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
</BrowserRouter>
```

## 6.4 Checklist khi tạo Provider mới

```
□ Bước 1: Xác định data/functions cần chia sẻ
□ Bước 2: Tạo Context với createContext()
□ Bước 3: Tạo custom hook (useMyContext)
□ Bước 4: Tạo Provider component với children
□ Bước 5: Định nghĩa state và functions trong Provider
□ Bước 6: Đóng gói vào object value
□ Bước 7: Return <Context.Provider value={value}>{children}</Context.Provider>
□ Bước 8: Export Provider và custom hook
□ Bước 9: Bọc Provider vào đúng vị trí trong app
□ Bước 10: Sử dụng custom hook trong component con
```

---

# 📚 KẾT LUẬN

**Provider Pattern** là một trong những pattern quan trọng nhất trong React:

1. **Giải quyết "Prop Drilling"** - Không cần truyền props qua nhiều tầng
2. **Tổ chức code tốt hơn** - Logic được tập trung tại một nơi
3. **Tái sử dụng** - Nhiều component có thể dùng chung data
4. **Dễ test** - Có thể mock Provider khi test

```
💡 GHI NHỚ:

"Provider giống như một đài phát sóng radio.
 Một khi bạn ở trong vùng phủ sóng (children),
 bạn có thể bắt được tín hiệu (data/functions)
 từ đài phát (Provider)."
```
