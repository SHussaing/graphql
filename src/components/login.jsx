import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Row, Col, Typography } from 'antd';
import { returnJWT } from '../api/auth';

const { Title } = Typography;

function Login() {
    const onFinish = (values) => {
        const { username, password } = values;
        const data = returnJWT(username, password);
        console.log(data);
    };

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
                    bodyStyle={{ padding: '20px 40px' }}
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
