import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import PrivateRoute from './components/privateRoute';
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
            </Routes>
        </Router>
        </ConfigProvider>
    );
}

export default App;




