import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import PrivateRoute from './components/privateRoute';
import NotFound from './components/notFound';
import { ConfigProvider } from 'antd';

function App() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#3687d9' } }}> 
            <Router>
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
