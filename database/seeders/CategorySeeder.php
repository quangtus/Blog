<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Công Nghệ',
                'slug' => 'cong-nghe',
                'description' => 'Tin tức về công nghệ, phần mềm, phần cứng và các xu hướng công nghệ mới nhất.',
            ],
            [
                'name' => 'Lập Trình',
                'slug' => 'lap-trinh',
                'description' => 'Kiến thức về lập trình, các ngôn ngữ lập trình, framework và best practices.',
            ],
            [
                'name' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Hướng dẫn phát triển web, frontend, backend và full-stack development.',
            ],
            [
                'name' => 'Mobile Development',
                'slug' => 'mobile-development',
                'description' => 'Phát triển ứng dụng mobile, iOS, Android và cross-platform.',
            ],
            [
                'name' => 'Database',
                'slug' => 'database',
                'description' => 'Quản lý cơ sở dữ liệu, SQL, NoSQL, MongoDB, MySQL và các công nghệ database.',
            ],
            [
                'name' => 'DevOps',
                'slug' => 'devops',
                'description' => 'DevOps, CI/CD, Docker, Kubernetes và các công cụ deployment.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Created ' . count($categories) . ' categories.');
    }
}

