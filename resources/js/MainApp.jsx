import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';

function MainApp() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/posts/create" element={<CreatePost />} />
                    <Route path="/posts/:id/edit" element={<EditPost />} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default MainApp;

