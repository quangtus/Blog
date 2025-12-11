<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Configure Sanctum to use MongoDB PersonalAccessToken model
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function bootstrap(): void
    {
        //
    }
}

