<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use MongoDB\Client;

class TestMongoConnection extends Command
{
    protected $signature = 'mongodb:test';
    protected $description = 'Test MongoDB connection';

    public function handle()
    {
        $this->info('Testing MongoDB Connection...');
        $this->newLine();

        // Test 1: Check MongoDB extension
        $this->info('1. Checking MongoDB PHP Extension...');
        if (extension_loaded('mongodb')) {
            $this->info('   ✓ MongoDB extension is loaded');
            $this->info('   Version: ' . phpversion('mongodb'));
        } else {
            $this->error('   ✗ MongoDB extension is NOT loaded');
            $this->error('   Please install MongoDB PHP extension: pecl install mongodb');
            return 1;
        }
        $this->newLine();

        // Test 2: Check connection config
        $this->info('2. Checking Connection Configuration...');
        $dsn = config('database.connections.mongodb.dsn');
        $database = config('database.connections.mongodb.database');
        $this->info("   DSN: {$dsn}");
        $this->info("   Database: {$database}");
        $this->newLine();

        // Test 3: Try to connect
        $this->info('3. Attempting to connect to MongoDB...');
        try {
            $client = new Client($dsn);
            $admin = $client->selectDatabase('admin');
            $result = $admin->command(['ping' => 1]);
            $this->info('   ✓ Successfully connected to MongoDB server');
            $this->info('   Response: ' . json_encode($result->toArray()));
        } catch (\Exception $e) {
            $this->error('   ✗ Failed to connect to MongoDB');
            $this->error('   Error: ' . $e->getMessage());
            $this->error('   Make sure MongoDB is running on ' . $dsn);
            return 1;
        }
        $this->newLine();

        // Test 4: Try Laravel DB connection
        $this->info('4. Testing Laravel DB Connection...');
        try {
            $connection = DB::connection('mongodb');
            $this->info('   ✓ Laravel DB connection established');
            $this->info('   Connection name: ' . $connection->getName());
        } catch (\Exception $e) {
            $this->error('   ✗ Laravel DB connection failed');
            $this->error('   Error: ' . $e->getMessage());
            return 1;
        }
        $this->newLine();

        // Test 5: Try to access database
        $this->info('5. Testing Database Access...');
        try {
            $db = $client->selectDatabase($database);
            $collections = $db->listCollections();
            $collectionNames = [];
            foreach ($collections as $collection) {
                $collectionNames[] = $collection->getName();
            }
            $this->info('   ✓ Database access successful');
            $this->info('   Collections: ' . (empty($collectionNames) ? 'None' : implode(', ', $collectionNames)));
        } catch (\Exception $e) {
            $this->error('   ✗ Database access failed');
            $this->error('   Error: ' . $e->getMessage());
            return 1;
        }
        $this->newLine();

        // Test 6: Try Model
        $this->info('6. Testing Model Connection...');
        try {
            $user = new \App\Models\User();
            $connection = $user->getConnection();
            $this->info('   ✓ Model connection: ' . $connection->getName());
        } catch (\Exception $e) {
            $this->error('   ✗ Model connection failed');
            $this->error('   Error: ' . $e->getMessage());
            return 1;
        }
        $this->newLine();

        $this->info('✓ All tests passed! MongoDB connection is working correctly.');
        return 0;
    }
}

