# 📚 TƯ DUY HỆ THỐNG REACT THEO MÔ HÌNH IPO
## Tài liệu toàn diện cho người mới học React

---

# 📑 MỤC LỤC

1. [Giới thiệu mô hình IPO](#phần-1-giới-thiệu-mô-hình-ipo)
2. [INPUT - Phân tích đầu vào](#phần-2-input---đầu-vào-của-hệ-thống)
3. [PROCESS - Cỗ máy xử lý](#phần-3-process---cỗ-máy-biến-đổi)
4. [OUTPUT - Kết quả đầu ra](#phần-4-output---kết-quả-đầu-ra)
5. [Quy trình tư duy chuẩn](#phần-5-quy-trình-tư-duy-chuẩn)
6. [Ví dụ thực tế](#phần-6-ví-dụ-thực-tế)

---

# PHẦN 1: GIỚI THIỆU MÔ HÌNH IPO

## 1.1 IPO là gì?

**IPO = Input - Process - Output** (Đầu vào - Xử lý - Đầu ra)

```
╔═══════════════╗     ╔═══════════════╗     ╔═══════════════╗
║    INPUT      ║ ══▶║   PROCESS     ║ ══▶ ║   OUTPUT      ║
║   (Đầu vào)   ║     ║   (Xử lý)     ║     ║   (Đầu ra)    ║
╚═══════════════╝     ╚═══════════════╝     ╚═══════════════╝
```

> 💡 **Ví dụ đời thường:**
> - **Máy pha cà phê:** Nước + Cà phê → Pha → Cà phê thành phẩm
> - **Máy ATM:** Thẻ + Mã PIN → Xử lý → Tiền mặt

## 1.2 Công thức React

```javascript
Output (UI + Effects) = Component(Props + State + Context + Events)
```

| Thành phần | Vai trò | Ví dụ |
|:-----------|:--------|:------|
| **Props** | Dữ liệu từ cha truyền xuống | `<Button color="red" />` |
| **State** | Bộ nhớ nội bộ component | `useState(0)` |
| **Context** | Dữ liệu toàn cục | Theme, User đăng nhập |
| **Events** | Sự kiện người dùng | Click, Gõ phím |
| **UI** | Giao diện hiển thị | JSX trả về |
| **Effects** | Tác động phụ | Gọi API, lưu localStorage |

## 1.3 Tư duy Mệnh lệnh vs Khai báo

### ❌ Mệnh lệnh (jQuery - Cách cũ)
```javascript
// Chỉ đạo TỪNG BƯỚC
$('#btn').click(function() {
    $('#div').addClass('active');    // Làm cái này
    $('#text').text('Clicked!');     // Rồi làm cái kia
});
```

### ✅ Khai báo (React - Cách mới)
```javascript
// Mô tả KẾT QUẢ mong muốn
function Button() {
    const [clicked, setClicked] = useState(false);
    
    return (
        <div className={clicked ? 'active' : ''}>
            <p>{clicked ? 'Clicked!' : 'Not clicked'}</p>
            <button onClick={() => setClicked(true)}>Click</button>
        </div>
    );
}
// React tự tính toán cách thay đổi!
```

---

# PHẦN 2: INPUT - ĐẦU VÀO CỦA HỆ THỐNG

> ⚠️ **Quy tắc vàng:** Trước khi viết `useState()`, hãy hỏi "Dữ liệu này đến từ đâu?"

## 2.1 Phân loại Input theo NGUỒN GỐC DỮ LIỆU

### 📊 Bảng phân loại 4 nguồn Input

| Loại | Nguồn gốc | Đặc điểm | Ví dụ | Công cụ |
|:-----|:----------|:---------|:------|:--------|
| 🌐 **URL State** | Trình duyệt | Bền vững, share được | `?page=2`, `/product/123` | `useParams()` |
| 🖥️ **Server State** | API/Database | Bất đồng bộ, có thể cũ | Danh sách sản phẩm | React Query |
| 🔗 **Props** | Component cha | Bất biến với con | `isOpen`, `color` | Truyền trực tiếp |
| 💾 **Local State** | Component | Tạm thời, mất khi reload | `inputValue`, `isHover` | `useState()` |

---

### 🌐 URL State - Input thường bị bỏ qua

**Câu hỏi kiểm tra:**
- Reload trang (F5) → Dữ liệu có nên giữ không?
- Gửi link cho người khác → Họ có thấy giống mình không?

Nếu **CÓ** → Dùng URL, KHÔNG dùng useState!

```javascript
// ❌ SAI: useState cho filter
const [filter, setFilter] = useState('shoes');
// → Mất khi reload, link không share được!

// ✅ ĐÚNG: Đọc từ URL
const [searchParams] = useSearchParams();
const filter = searchParams.get('filter') || '';
// → Giữ nguyên khi reload, share được link!
```

---

### 🖥️ Server State - Dữ liệu từ API

> 🔴 **Luôn nhớ:** Dữ liệu server có 3 trạng thái!

```javascript
const { data, isLoading, isError } = useQuery('products', fetchProducts);

// PHẢI xử lý cả 3!
if (isLoading) return <Spinner />;      // Đang tải
if (isError) return <ErrorMessage />;   // Lỗi
return <ProductList data={data} />;     // Thành công
```

**⚠️ Sai lầm phổ biến:** Bỏ qua `isLoading` → Lỗi "Cannot read property of undefined"

---

### 🔗 Props - Dữ liệu từ cha

**Nguyên tắc:** Props là **READ-ONLY** - Con KHÔNG được sửa!

```javascript
// ❌ SAI: Sửa props
function Child({ items }) {
    items.push(newItem);  // KHÔNG BAO GIỜ!
}

// ✅ ĐÚNG: Báo cha sửa qua callback
function Child({ items, onAddItem }) {
    const handleAdd = () => onAddItem(newItem);
}
```

---

### 💾 Local State - Chỉ dùng khi cần

**Dùng cho:**
- UI tạm thời: `isOpen`, `isHover`, `isDropdownExpanded`
- Form chưa submit: `inputValue`

```javascript
// ✅ Đúng: UI toggle
const [isOpen, setIsOpen] = useState(false);

// ❌ Sai: Dữ liệu share được nên dùng Context
const [cart, setCart] = useState([]);
```

---

## 2.2 Phân loại Input theo TƯƠNG TÁC NGƯỜI DÙNG

### 📊 Bảng 3 loại sự kiện Input

| Loại sự kiện | Đặc điểm | Ví dụ | Cách xử lý |
|:-------------|:---------|:------|:-----------|
| ⚡ **Rời rạc** | Xảy ra 1 lần, dứt khoát | Click, Submit, Enter | Xử lý ngay, cập nhật State |
| 🔄 **Liên tục** | Xảy ra liên tiếp, spam | Gõ phím, Di chuột, Scroll | Dùng **Debounce/Throttle** |
| 🖥️ **Hệ thống** | Do môi trường sinh ra | Mount, Unmount, API Response | Dùng `useEffect` |

---

### ⚡ Sự kiện Rời rạc (Discrete Events)

```javascript
function SubmitButton() {
    const handleClick = () => {
        // Xử lý ngay khi click
        saveData();
    };
    
    return <button onClick={handleClick}>Submit</button>;
}
```

---

### 🔄 Sự kiện Liên tục (Continuous Events)

> ⚠️ **Vấn đề:** Gọi API mỗi lần gõ phím → Spam server!

```javascript
// ❌ SAI: Gọi API mỗi lần gõ
const handleChange = (e) => {
    setQuery(e.target.value);
    searchAPI(e.target.value);  // Spam 100 request!
};

// ✅ ĐÚNG: Debounce - Chờ ngừng gõ 300ms
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
    if (debouncedQuery) {
        searchAPI(debouncedQuery);  // Chỉ 1 request!
    }
}, [debouncedQuery]);
```

**Giải thích Debounce:**
```
Gõ: H → He → Hel → Hell → Hello
     ↓    ↓    ↓     ↓      ↓
     ❌   ❌   ❌    ❌     ✅ (Gọi API sau 300ms)
```

---

### 🖥️ Sự kiện Hệ thống (System Events)

```javascript
useEffect(() => {
    // Chạy khi component xuất hiện (mount)
    const subscription = subscribeToData();
    
    // Cleanup khi component biến mất (unmount)
    return () => subscription.unsubscribe();
}, []);
```

---

## 2.3 Anti-Pattern: Nhân bản State

> 🚫 **Lỗi nghiêm trọng nhất!**

```javascript
// ❌ SAI: Copy props vào state
function UserProfile({ user }) {
    const [name, setName] = useState(user.name);
    // Vấn đề: Nếu user thay đổi, name vẫn giữ giá trị cũ!
}

// ✅ ĐÚNG: Dùng props trực tiếp
function UserProfile({ user }) {
    return <h1>{user.name}</h1>;  // Luôn đồng bộ!
}
```

---

## 2.4 Chiến lược "Lifting State Up"

Khi 2 component cần cùng dữ liệu → Đẩy State lên cha chung!

```
        ┌─────────────┐
        │   Parent    │  ← State [count] sống ở đây
        └──────┬──────┘
               │
      ┌────────┴────────┐
      ↓                 ↓
┌───────────┐    ┌───────────┐
│  Display  │    │  Button   │
│  (props)  │    │  (props)  │
└───────────┘    └───────────┘
```

```javascript
function Parent() {
    const [count, setCount] = useState(0);
    
    return (
        <>
            <Display count={count} />
            <Button onIncrement={() => setCount(c => c + 1)} />
        </>
    );
}
```

---

# PHẦN 3: PROCESS - CỖ MÁY BIẾN ĐỔI

> 🎯 **Mục tiêu:** Biến Input thành Output một cách thuần khiết, dự đoán được.

## 3.1 Hai giai đoạn của React

```
┌─────────────────────────────────────────────────────────┐
│        RENDER PHASE (Pha Tính toán)                     │
│  • Chạy hàm component                                   │
│  • PHẢI thuần khiết, KHÔNG side-effect                  │
│  • Input → Tính toán → Virtual DOM                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│        COMMIT PHASE (Pha Ghi nhận)                      │
│  • Áp dụng thay đổi lên DOM thật                        │
│  • Chạy useEffect                                       │
│  • Virtual DOM → Real DOM                               │
└─────────────────────────────────────────────────────────┘
```

## 3.2 Thứ tự ưu tiên xử lý Logic

```
╔═══════════════════════════════════════════════════════════╗
║  1️⃣ DERIVED STATE (Tính toán trực tiếp)  ← ƯU TIÊN NHẤT   ║
╠═══════════════════════════════════════════════════════════╣
║  2️⃣ useMemo (Cache tính toán nặng)                        ║
╠═══════════════════════════════════════════════════════════╣
║  3️⃣ Event Handlers (Xử lý click, submit)                  ║
╠═══════════════════════════════════════════════════════════╣
║  4️⃣ useEffect (Đồng bộ hệ thống ngoài)   ← CHỈ KHI CẦN    ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 3.3 Derived State - Khái niệm QUAN TRỌNG NHẤT

> 🌟 **Quy tắc vàng:** Đừng lưu State những gì TÍNH TOÁN được!

### ❌ SAI: Dùng useEffect

```javascript
function TodoList({ todos, filter }) {
    const [filteredTodos, setFilteredTodos] = useState([]);
    
    useEffect(() => {
        setFilteredTodos(todos.filter(t => t.status === filter));
    }, [todos, filter]);
    
    // Vấn đề: Render 2 LẦN!
    // Lần 1: todos đổi
    // Lần 2: filteredTodos đổi
}
```

### ✅ ĐÚNG: Derived State

```javascript
function TodoList({ todos, filter }) {
    // Tính toán TRỰC TIẾP - chỉ 1 lần render!
    const filteredTodos = todos.filter(t => t.status === filter);
    
    return <ul>{filteredTodos.map(t => <li>{t.text}</li>)}</ul>;
}
```

### Thêm useMemo khi tính toán nặng

```javascript
function ProductList({ products, query }) {
    // Cache kết quả, chỉ tính lại khi dependencies đổi
    const filtered = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [products, query]);
    
    return <Grid items={filtered} />;
}
```

---

## 3.4 useEffect - Khi nào dùng?

> ⚠️ **useEffect KHÔNG phải để tính toán dữ liệu!**
> 
> useEffect = Đồng bộ React với hệ thống BÊN NGOÀI

### ❌ KHÔNG dùng useEffect khi:

| Tình huống | Giải pháp |
|:-----------|:----------|
| Tính toán từ State/Props | **Derived State** |
| Cập nhật State khi Props đổi | **Dùng key reset** |
| Gọi API khi click | **Event Handler** |

### ✅ NÊN dùng useEffect khi:

| Tình huống | Ví dụ |
|:-----------|:------|
| Kết nối WebSocket | Real-time chat |
| Thao tác DOM thật | Focus input |
| Đăng ký Event | Window resize |
| Fetch data lúc mount | Load initial data |

### Ví dụ so sánh

```javascript
// ❌ SAI: useEffect cho API call khi click
function SaveButton({ data }) {
    const [shouldSave, setShouldSave] = useState(false);
    
    useEffect(() => {
        if (shouldSave) {
            saveToServer(data);
        }
    }, [shouldSave]);
    
    return <button onClick={() => setShouldSave(true)}>Save</button>;
}

// ✅ ĐÚNG: Event Handler
function SaveButton({ data }) {
    const handleSave = async () => {
        await saveToServer(data);
    };
    
    return <button onClick={handleSave}>Save</button>;
}
```

---

## 3.5 Mối quan hệ INPUT → PROCESS

```
╔═════════════════════════════════════════════════════════════╗
║                         INPUT                                ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        ║
║  │  Props   │ │  State   │ │ Context  │ │  Events  │        ║
║  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘        ║
╚═══════╪════════════╪════════════╪════════════╪══════════════╝
        │            │            │            │
        ▼            ▼            ▼            ▼
╔═════════════════════════════════════════════════════════════╗
║                        PROCESS                               ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │  1. Derived State (tính toán từ Input)              │    ║
║  │  2. useMemo (cache kết quả nặng)                    │    ║
║  │  3. Event Handlers (xử lý tương tác)                │    ║
║  │  4. useEffect (đồng bộ hệ thống ngoài)              │    ║
║  └─────────────────────────────────────────────────────┘    ║
╚═════════════════════════════════════════════════════════════╝
        │
        ▼
╔═════════════════════════════════════════════════════════════╗
║                        OUTPUT                                ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       ║
║  │  Visual UI   │  │  Callbacks   │  │ Side Effects │       ║
║  └──────────────┘  └──────────────┘  └──────────────┘       ║
╚═════════════════════════════════════════════════════════════╝
```

---

## 3.6 Custom Hooks - Đóng gói Logic

Khi logic phức tạp → Tách ra Custom Hook

```javascript
// Custom Hook chứa PROCESS
function useProductSearch(initialQuery = '') {
    // INPUT
    const [query, setQuery] = useState(initialQuery);
    const debouncedQuery = useDebounce(query, 300);
    
    // PROCESS
    const { data, isLoading } = useQuery(
        ['products', debouncedQuery],
        () => fetchProducts(debouncedQuery)
    );
    
    return { products: data, isLoading, query, setQuery };
}

// Component chỉ lo OUTPUT
function ProductSearch() {
    const { products, isLoading, query, setQuery } = useProductSearch();
    
    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            {isLoading ? <Spinner /> : <ProductList items={products} />}
        </div>
    );
}
```

---

# PHẦN 4: OUTPUT - KẾT QUẢ ĐẦU RA

## 4.1 Tổng quan các loại Output

```
╔═════════════════════════════════════════════════════════════╗
║                         OUTPUT                               ║
╠═════════════════════════════════════════════════════════════╣
║  📺 VISUAL OUTPUT (UI)                                      ║
║     └── Giao diện người dùng nhìn thấy (JSX)               ║
╠═════════════════════════════════════════════════════════════╣
║  🔄 CALLBACK OUTPUT (Giao tiếp ngược)                       ║
║     └── Tín hiệu con gửi lên cha                           ║
╠═════════════════════════════════════════════════════════════╣
║  ⚡ SYSTEM OUTPUT (Side Effects)                            ║
║     └── API calls, localStorage, navigation                ║
╠═════════════════════════════════════════════════════════════╣
║  🚀 OPTIMISTIC OUTPUT (React 19)                            ║
║     └── UI cập nhật trước khi server phản hồi             ║
╚═════════════════════════════════════════════════════════════╝
```

---

## 4.2 Visual Output - Giao diện UI

### Nguyên tắc: UI = f(State)

```javascript
function UserCard({ user, isOnline }) {
    // OUTPUT = hàm của INPUT
    return (
        <div className={`card ${isOnline ? 'online' : 'offline'}`}>
            <img src={user.avatar} />
            <h3>{user.name}</h3>
            <span>{isOnline ? '🟢 Online' : '⚫ Offline'}</span>
        </div>
    );
}
```

### Virtual DOM là gì?

React KHÔNG trả về HTML thực. Nó trả về mô tả (Virtual DOM):

```javascript
// JSX này:
<div className="card">Hello</div>

// Thực ra là object:
{
    type: 'div',
    props: { 
        className: 'card', 
        children: 'Hello' 
    }
}
```

React so sánh Virtual DOM cũ và mới → Chỉ cập nhật phần thay đổi!

---

## 4.3 Callback Output - Giao tiếp con → cha

> 💡 **Luồng dữ liệu:**
> - Props đi **XUỐNG** ↓
> - Callbacks đi **LÊN** ↑

```javascript
// COMPONENT CHA
function Parent() {
    const [items, setItems] = useState([]);
    
    // Nhận OUTPUT từ con
    const handleAddItem = (newItem) => {
        setItems([...items, newItem]);
    };
    
    return <Child onAddItem={handleAddItem} />;
}

// COMPONENT CON
function Child({ onAddItem }) {
    const handleClick = () => {
        const newItem = { id: Date.now(), name: 'New' };
        onAddItem(newItem);  // OUTPUT: Gửi lên cha!
    };
    
    return <button onClick={handleClick}>Add</button>;
}
```

**Sơ đồ:**
```
┌─────────────────────────────────────┐
│            PARENT                    │
│  ┌──────────────────────────────┐   │
│  │  items = [...]               │   │
│  │  handleAddItem = (item) => { │   │
│  │    setItems([...items, item])│   │
│  │  }                           │   │
│  └──────────────────────────────┘   │
│              │                       │
│              │ props={onAddItem}     │
│              ▼                       │
│  ┌──────────────────────────────┐   │
│  │           CHILD               │   │
│  │  onClick={() =>               │   │
│  │    onAddItem(newItem)}  ──────┼───┼──▶ Gửi OUTPUT lên!
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 4.4 System Output - Side Effects

```javascript
function SaveButton({ data }) {
    const handleSave = async () => {
        // OUTPUT 1: Gọi API
        await fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        // OUTPUT 2: Lưu localStorage
        localStorage.setItem('lastSaved', Date.now());
        
        // OUTPUT 3: Chuyển trang
        navigate('/success');
    };
    
    return <button onClick={handleSave}>Save</button>;
}
```

---

## 4.5 Optimistic UI - Giao diện "lạc quan" (React 19)

### Vấn đề

```
Click Like → Chờ Server (1-3 giây) → Cập nhật UI
                  ↑
            Người dùng chờ đợi = Trải nghiệm kém!
```

### Giải pháp: Cập nhật UI TRƯỚC

```
Click Like → UI +1 ngay → Server chạy nền → Rollback nếu lỗi
                  ↑
            Người dùng thấy ngay = Trải nghiệm tốt!
```

### Code ví dụ

```javascript
import { useOptimistic } from 'react';

function LikeButton({ initialLikes }) {
    const [likes, setLikes] = useState(initialLikes);
    
    // Optimistic: Tạo bản "ảo" để cập nhật ngay
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        likes,
        (current) => current + 1
    );
    
    const handleLike = async () => {
        // 1. OUTPUT NGAY: UI +1
        addOptimisticLike();
        
        try {
            // 2. PROCESS: Gọi server
            const newLikes = await likeAPI();
            setLikes(newLikes);
        } catch (error) {
            // 3. LỖI: Tự động rollback về likes cũ!
            toast.error('Lỗi, vui lòng thử lại');
        }
    };
    
    return (
        <button onClick={handleLike}>
            ❤️ {optimisticLikes}
        </button>
    );
}
```

### Sơ đồ Optimistic UI

```
┌────────────────────────────────────────────────────────────┐
│                    OPTIMISTIC UI FLOW                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Click                                              │
│       │                                                     │
│       ▼                                                     │
│  2. UI Update Ngay (optimisticLikes + 1)  ──────────────┐  │
│       │                                                  │  │
│       ▼                                                  │  │
│  3. Server Request (chạy nền)                           │  │
│       │                                                  │  │
│       ├──▶ Success? ──▶ Giữ nguyên UI                  │  │
│       │                                                  │  │
│       └──▶ Error? ──▶ Rollback UI (trở về likes cũ) ◀──┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

# PHẦN 5: QUY TRÌNH TƯ DUY CHUẨN

## 5.1 Framework 5 bước

```
╔═══════════════════════════════════════════════════════════╗
║  BƯỚC 1: HÌNH DUNG OUTPUT                                  ║
║  • Vẽ mockup giao diện                                     ║
║  • Chia thành components                                   ║
║  • Đặt tên component theo chức năng                        ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║  BƯỚC 2: XÁC ĐỊNH INPUT (Data)                             ║
║  • Dữ liệu từ đâu? (Server/URL/Props/State)               ║
║  • Ai sở hữu dữ liệu?                                      ║
║  • Có tính được từ dữ liệu khác không?                     ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║  BƯỚC 3: XÁC ĐỊNH INPUT (Events)                           ║
║  • Người dùng làm gì? (Click, Gõ phím)                    ║
║  • Sự kiện nào thay đổi State?                             ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║  BƯỚC 4: THIẾT KẾ PROCESS                                  ║
║  • State nằm ở đâu? (Local hay Lift Up?)                  ║
║  • Logic phức tạp? → Tách Custom Hook                     ║
║  • Cần API? → Event Handler / useQuery                    ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║  BƯỚC 5: THIẾT KẾ INVERSE DATA FLOW                        ║
║  • Con cần báo gì cho cha?                                 ║
║  • Định nghĩa callback props (onSuccess, onError)         ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 5.2 Checklist kiểm tra

### ✅ INPUT Check

- [ ] Dữ liệu có tính được từ State/Props khác không? → Xóa State thừa
- [ ] Dữ liệu cần giữ khi reload? → Đưa lên URL
- [ ] Server Data đã xử lý Loading/Error/Success chưa?

### ✅ PROCESS Check

- [ ] Logic render có side-effect không? → Phải Pure Function
- [ ] useEffect có đang tính toán không? → Chuyển Derived State
- [ ] Logic phức tạp? → Tách Custom Hook

### ✅ OUTPUT Check

- [ ] UI phản hồi ngay khi click không? → Optimistic UI
- [ ] Có hiển thị lỗi thân thiện không? → Error Boundary

---

## 5.3 Bảng tổng hợp công cụ

| Giai đoạn | Câu hỏi | Công cụ | Nguyên tắc |
|:----------|:--------|:--------|:-----------|
| **INPUT** | Dữ liệu từ đâu? | Props, useContext | Single Source of Truth |
| **PROCESS (State)** | Gì thay đổi? | useState, useReducer | Minimal State |
| **PROCESS (Logic)** | Tính toán UI? | useMemo, helper | Pure Functions |
| **PROCESS (Effect)** | Đồng bộ ngoài? | useEffect | Chỉ khi cần |
| **OUTPUT (UI)** | UI trông sao? | JSX, return | Declarative |
| **OUTPUT (Action)** | Thay đổi ngoài? | fetch, navigate | Xử lý async |

---

# PHẦN 6: VÍ DỤ THỰC TẾ

## 6.1 Search Box với Debounce

```javascript
function SearchBox() {
    // ══════════════════════════════════════════════════════
    // INPUT
    // ══════════════════════════════════════════════════════
    const [query, setQuery] = useState('');
    
    // ══════════════════════════════════════════════════════
    // PROCESS: Debounce + React Query
    // ══════════════════════════════════════════════════════
    const debouncedQuery = useDebounce(query, 300);
    
    const { data: results, isLoading } = useQuery(
        ['search', debouncedQuery],
        () => searchAPI(debouncedQuery),
        { enabled: debouncedQuery.length > 0 }
    );
    
    // ══════════════════════════════════════════════════════
    // OUTPUT
    // ══════════════════════════════════════════════════════
    return (
        <>
            <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Tìm kiếm..."
            />
            {isLoading && <Spinner />}
            {results && <ResultList items={results} />}
        </>
    );
}
```

---

## 6.2 Giỏ hàng với Optimistic UI

```javascript
function ProductCard({ product, currentCart }) {
    // ══════════════════════════════════════════════════════
    // PROCESS: Optimistic State
    // ══════════════════════════════════════════════════════
    const [optimisticCart, addOptimisticItem] = useOptimistic(
        currentCart,
        (state, newProduct) => [...state, newProduct]
    );
    
    // ══════════════════════════════════════════════════════
    // PROCESS: Event Handler
    // ══════════════════════════════════════════════════════
    async function handleAddToCart() {
        // OUTPUT 1: UI cập nhật ngay
        addOptimisticItem({ ...product, sending: true });
        
        try {
            // PROCESS: Gọi API
            await addToCartAPI(product.id);
        } catch (error) {
            // Rollback tự động!
            toast.error('Lỗi thêm giỏ hàng');
        }
    }
    
    // ══════════════════════════════════════════════════════
    // OUTPUT: Visual UI
    // ══════════════════════════════════════════════════════
    const isAdding = optimisticCart.some(
        p => p.id === product.id && p.sending
    );
    
    return (
        <div className="card">
            <h3>{product.name}</h3>
            <p>{product.price}đ</p>
            <button onClick={handleAddToCart} disabled={isAdding}>
                {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
            <p>Giỏ hàng: {optimisticCart.length} món</p>
        </div>
    );
}
```

---

# 📝 KẾT LUẬN

## Công thức cốt lõi

```
OUTPUT = Component(INPUT)

Trong đó:
• INPUT = Props + State + Context + Events
• Component chứa PROCESS (logic biến đổi)
• OUTPUT = UI + Side Effects
```

## Ba nguyên tắc vàng

| Nguyên tắc | Giải thích |
|:-----------|:-----------|
| **1. Tôn trọng INPUT** | Single Source of Truth, không nhân bản state |
| **2. Thanh lọc PROCESS** | Ưu tiên Derived State, hạn chế useEffect |
| **3. Làm sạch OUTPUT** | UI là hàm của State, Side Effects ở biên |

---

*Tài liệu tổng hợp từ 3 nguồn IPO React - Cập nhật: 16/12/2025*
