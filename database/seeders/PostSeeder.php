<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $this->command->error('No user found. Please create a user first.');
            return;
        }

        $categories = Category::all();
        if ($categories->isEmpty()) {
            $this->command->error('No categories found. Please run CategorySeeder first.');
            return;
        }

        $posts = [
            [
                'title' => 'Giới thiệu về Laravel Framework',
                'content' => '<h2>Laravel là gì?</h2><p>Laravel là một PHP framework mã nguồn mở, được phát triển bởi Taylor Otwell. Framework này được thiết kế để giúp các nhà phát triển xây dựng các ứng dụng web một cách nhanh chóng và dễ dàng.</p><h3>Tính năng chính:</h3><ul><li>Eloquent ORM mạnh mẽ</li><li>Routing đơn giản và linh hoạt</li><li>Blade templating engine</li><li>Authentication và Authorization tích hợp</li><li>Artisan CLI</li></ul>',
                'excerpt' => 'Laravel là một PHP framework mã nguồn mở, được thiết kế để giúp các nhà phát triển xây dựng các ứng dụng web một cách nhanh chóng và dễ dàng.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'lap-trinh')->first()->_id,
                'user_id' => $user->_id,
            ],
            [
                'title' => 'React Hooks: useState và useEffect',
                'content' => '<h2>React Hooks là gì?</h2><p>React Hooks là các hàm đặc biệt cho phép bạn sử dụng state và các tính năng khác của React trong functional components.</p><h3>useState Hook:</h3><p>useState cho phép bạn thêm state vào functional component.</p><pre><code>const [count, setCount] = useState(0);</code></pre><h3>useEffect Hook:</h3><p>useEffect cho phép bạn thực hiện side effects trong functional component.</p><pre><code>useEffect(() => { document.title = `Count: ${count}`; }, [count]);</code></pre>',
                'excerpt' => 'React Hooks là các hàm đặc biệt cho phép bạn sử dụng state và các tính năng khác của React trong functional components.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'web-development')->first()->_id,
                'user_id' => $user->_id,
            ],
            [
                'title' => 'MongoDB vs MySQL: So sánh NoSQL và SQL',
                'content' => '<h2>MongoDB vs MySQL</h2><p>MongoDB là một NoSQL database, trong khi MySQL là một SQL database. Cả hai đều có những ưu và nhược điểm riêng.</p><h3>MongoDB (NoSQL):</h3><ul><li>Lưu trữ dữ liệu dạng document (JSON-like)</li><li>Schema linh hoạt</li><li>Dễ scale horizontally</li><li>Phù hợp với dữ liệu không có cấu trúc</li></ul><h3>MySQL (SQL):</h3><ul><li>Lưu trữ dữ liệu dạng bảng</li><li>Schema cố định</li><li>ACID compliance</li><li>Phù hợp với dữ liệu có cấu trúc</li></ul>',
                'excerpt' => 'MongoDB là một NoSQL database, trong khi MySQL là một SQL database. Cả hai đều có những ưu và nhược điểm riêng.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'database')->first()->_id,
                'user_id' => $user->_id,
            ],
            [
                'title' => 'Docker cho người mới bắt đầu',
                'content' => '<h2>Docker là gì?</h2><p>Docker là một platform cho phép bạn đóng gói ứng dụng và các dependencies vào trong một container.</p><h3>Lợi ích của Docker:</h3><ul><li>Consistency: Chạy giống nhau trên mọi môi trường</li><li>Isolation: Ứng dụng không ảnh hưởng lẫn nhau</li><li>Portability: Dễ dàng di chuyển giữa các môi trường</li><li>Scalability: Dễ dàng scale ứng dụng</li></ul><h3>Các lệnh cơ bản:</h3><pre><code>docker run -d -p 27017:27017 mongo:latest\ndocker ps\ndocker stop container_id</code></pre>',
                'excerpt' => 'Docker là một platform cho phép bạn đóng gói ứng dụng và các dependencies vào trong một container.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'devops')->first()->_id,
                'user_id' => $user->_id,
            ],
            [
                'title' => 'Redis: In-Memory Database cho Cache',
                'content' => '<h2>Redis là gì?</h2><p>Redis là một in-memory data structure store, được sử dụng như database, cache và message broker.</p><h3>Tính năng chính:</h3><ul><li>In-memory storage: Lưu trữ trên RAM, cực kỳ nhanh</li><li>Data structures: Strings, Lists, Sets, Hashes, Sorted Sets</li><li>Persistence: Có thể lưu vào disk</li><li>Replication: Hỗ trợ master-slave replication</li></ul><h3>Use cases:</h3><ul><li>Cache: Lưu cache để tăng tốc độ</li><li>Session storage: Lưu session</li><li>Real-time analytics: Phân tích dữ liệu real-time</li><li>Message queue: Xử lý queue</li></ul>',
                'excerpt' => 'Redis là một in-memory data structure store, được sử dụng như database, cache và message broker.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'database')->first()->_id,
                'user_id' => $user->_id,
            ],
            [
                'title' => 'RESTful API với Laravel',
                'content' => '<h2>RESTful API là gì?</h2><p>REST (Representational State Transfer) là một kiến trúc phần mềm để thiết kế web services.</p><h3>HTTP Methods:</h3><ul><li>GET: Lấy dữ liệu</li><li>POST: Tạo mới</li><li>PUT: Cập nhật toàn bộ</li><li>PATCH: Cập nhật một phần</li><li>DELETE: Xóa</li></ul><h3>Ví dụ với Laravel:</h3><pre><code>Route::get(\'/api/posts\', [PostController::class, \'index\']);\nRoute::post(\'/api/posts\', [PostController::class, \'store\']);\nRoute::put(\'/api/posts/{id}\', [PostController::class, \'update\']);\nRoute::delete(\'/api/posts/{id}\', [PostController::class, \'destroy\']);</code></pre>',
                'excerpt' => 'REST (Representational State Transfer) là một kiến trúc phần mềm để thiết kế web services.',
                'status' => 'published',
                'category_id' => $categories->where('slug', 'web-development')->first()->_id,
                'user_id' => $user->_id,
            ],
        ];

        foreach ($posts as $postData) {
            $postData['slug'] = Str::slug($postData['title']) . '-' . time() . '-' . rand(1000, 9999);
            Post::create($postData);
        }

        $this->command->info('Created ' . count($posts) . ' posts.');
    }
}

