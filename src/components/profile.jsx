import React from 'react';
import { Layout, Dropdown, Avatar, Typography, Row, Col} from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserInfoCard from './cards/userInfoCard';
import MonthlyExpCard from './cards/monthlyExpCard';
import AuditsDoneCard from './cards/auditsDoneCard';

const { Header, Content } = Layout;
const { Text } = Typography;

function Profile() {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    const menuItems = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="logo192.png" alt="Logo" style={{ width: '40px', marginRight: '16px' }} />
                    <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>GraphQL</Text>
                </div>
                <Dropdown
                    menu={{ items: menuItems }} 
                    trigger={['click']}
                >
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                        <DownOutlined style={{ color: 'white' }} />
                    </div>
                </Dropdown>
            </Header>
            <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} lg={8}>
                        <UserInfoCard /> 
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MonthlyExpCard /> 
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <AuditsDoneCard /> 
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Profile;
