import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';

// Admin pages
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import CategoryList from './pages/admin/CategoryList';
import CommentManagement from './pages/admin/CommentManagement';

function MainApp() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes (authenticated users) */}
                    <Route path="/posts/create" element={<CreatePost />} />
                    <Route path="/posts/:id/edit" element={<EditPost />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><CategoryList /></AdminRoute>} />
                    <Route path="/admin/comments" element={<AdminRoute><CommentManagement /></AdminRoute>} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default MainApp;

