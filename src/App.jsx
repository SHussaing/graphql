import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import PrivateRoute from './components/privateRoute';
import NotFound from './components/notFound';
import { ConfigProvider } from 'antd';

function App() {
    // Explicitly force '/' for localhost and use process.env.PUBLIC_URL for production
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const basename = isLocalhost ? '/' : '/graphql';


    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#3687d9' } }}> 
            <Router basename={basename}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route 
                        path="/profile" 
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </ConfigProvider>
    );
}

export default App;
