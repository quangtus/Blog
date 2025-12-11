<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
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

        $posts = Post::all();
        if ($posts->isEmpty()) {
            $this->command->error('No posts found. Please run PostSeeder first.');
            return;
        }

        $comments = [];

        // Tạo comments cho mỗi post
        foreach ($posts as $post) {
            // Comment chính
            $mainComment = Comment::create([
                'content' => 'Bài viết rất hay và hữu ích! Cảm ơn tác giả đã chia sẻ.',
                'post_id' => $post->_id,
                'user_id' => $user->_id,
                'parent_id' => null,
                'status' => 'approved',
            ]);
            $comments[] = $mainComment;

            // Reply cho comment chính
            Comment::create([
                'content' => 'Đồng ý với bạn! Tôi cũng đã áp dụng và thấy hiệu quả.',
                'post_id' => $post->_id,
                'user_id' => $user->_id,
                'parent_id' => $mainComment->_id,
                'status' => 'approved',
            ]);

            // Comment thứ 2
            $comment2 = Comment::create([
                'content' => 'Có thể bạn giải thích thêm về phần này được không?',
                'post_id' => $post->_id,
                'user_id' => $user->_id,
                'parent_id' => null,
                'status' => 'approved',
            ]);
            $comments[] = $comment2;

            // Comment thứ 3
            Comment::create([
                'content' => 'Tuyệt vời! Tôi sẽ thử áp dụng ngay.',
                'post_id' => $post->_id,
                'user_id' => $user->_id,
                'parent_id' => null,
                'status' => 'pending', // Một comment đang chờ approve
            ]);
        }

        $this->command->info('Created comments for ' . $posts->count() . ' posts.');
    }
}

