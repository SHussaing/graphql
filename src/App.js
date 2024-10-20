import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import PrivateRoute from './components/privateRoute';
import { ConfigProvider } from 'antd';

function App() {
    const basename = process.env.PUBLIC_URL || '';

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
            </Routes>
        </Router>
        </ConfigProvider>
    );
}

export default App;




