import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Row, Col, Typography, notification } from 'antd';
import { returnJWT } from '../api/auth';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const { Title } = Typography;

function Login() {
    const [redirectToProfile, setRedirectToProfile] = useState(false); // State for navigation

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setRedirectToProfile(true);
        }
    }, []);

    const onFinish = async (values) => {
        const { username, password } = values;
        try {
            const token = await returnJWT(username, password);
            if (token) {
                // Store the token in a cookie
                Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
                // Set state to trigger redirection to the profile page
                setRedirectToProfile(true);
            } else {
                // Notify user of incorrect credentials
                notification.error({
                    message: 'Login Failed',
                    description: 'Email or password is incorrect. Please try again.',
                });
            }
        } catch (error) {
            // Handle any other errors that might occur
            notification.error({
                message: 'Login Failed',
                description: error.message || 'An unexpected error occurred. Please try again.',
            });
        }
    };

    if (redirectToProfile) {
        // Navigate to the profile page if login is successful
        return <Navigate to="/profile" />;
    }

    return (
        <Row
            justify="center"
            align="middle"
            style={{ height: '100vh' }}
        >
            <Col>
                <Card
                    style={{
                        width: 360,
                        textAlign: 'center',
                        borderRadius: 8,
                        border: '1px solid #d9d9d9',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <img
                        src="logo192.png" 
                        alt="Logo"
                        style={{ width: '100px', marginBottom: '20px' }}
                    />
                    <Title level={3} style={{ marginBottom: '20px' }}>
                        GraphQL
                    </Title>
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Email or Username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email or Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}

export default Login;
