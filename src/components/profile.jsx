import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Row, Col, Card } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserInfo } from '../api/graphql';

const { Header, Content } = Layout;
const { Text } = Typography;

// Sample data for the charts
const data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 70 },
    { name: 'C', value: 50 },
    { name: 'D', value: 90 },
    { name: 'E', value: 60 },
];

function Profile() {
    const [user, setUser] = useState(null); // State to hold the user object
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user info when the component mounts
        async function fetchUserData() {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUser(userInfo); // Set the user object in the state
            } else {
                console.error('Failed to fetch user info');
            }
        }

        fetchUserData();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleLogout = () => {
        // Clear the 'token' cookie
        Cookies.remove('token');
        // Navigate back to the home page
        navigate('/');
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    // Function to render a simple line chart
    const renderLineChart = () => (
        <svg width="100%" height="200">
            <polyline
                fill="none"
                stroke="#8884d8"
                strokeWidth="2"
                points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.value}`).join(' ')}
            />
        </svg>
    );

    // Function to render a simple bar chart
    const renderBarChart = () => (
        <svg width="100%" height="200">
            {data.map((d, i) => (
                <rect
                    key={d.name}
                    x={(i / data.length) * 100 + 10}
                    y={100 - d.value}
                    width="10"
                    height={d.value}
                    fill="#82ca9d"
                />
            ))}
        </svg>
    );

    // Function to render a simple pie chart
    const renderPieChart = () => {
        const radius = 50;
        const total = data.reduce((acc, d) => acc + d.value, 0);
        let cumulativeValue = 0;

        return (
            <svg width="100%" height="200">
                {data.map((d, i) => {
                    const valueRatio = d.value / total;
                    const [startX, startY] = [
                        radius * Math.cos(2 * Math.PI * cumulativeValue),
                        radius * Math.sin(2 * Math.PI * cumulativeValue),
                    ];
                    cumulativeValue += valueRatio;
                    const [endX, endY] = [
                        radius * Math.cos(2 * Math.PI * cumulativeValue),
                        radius * Math.sin(2 * Math.PI * cumulativeValue),
                    ];
                    const largeArcFlag = valueRatio > 0.5 ? 1 : 0;

                    return (
                        <path
                            key={d.name}
                            d={`M ${radius},${radius} L ${radius + startX},${radius - startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${radius + endX},${radius - endY} Z`}
                            fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][i % 5]}
                        />
                    );
                })}
            </svg>
        );
    };

    // Function to render a simple radar chart
    const renderRadarChart = () => {
        const radius = 50;
        const angleSlice = (2 * Math.PI) / data.length;

        return (
            <svg width="100%" height="200">
                <polygon
                    fill="rgba(136, 132, 216, 0.5)"
                    stroke="#8884d8"
                    strokeWidth="2"
                    points={data
                        .map((d, i) => {
                            const angle = i * angleSlice;
                            const x = radius + radius * (d.value / 100) * Math.cos(angle);
                            const y = radius - radius * (d.value / 100) * Math.sin(angle);
                            return `${x},${y}`;
                        })
                        .join(" ")}
                />
            </svg>
        );
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="logo192.png" alt="Logo" style={{ width: '40px', marginRight: '16px' }} />
                    <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>GraphQL</Text>
                </div>
                {user && (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                            <Text style={{ color: 'white' }}>{user.login} <DownOutlined /></Text>
                        </div>
                    </Dropdown>
                )}
            </Header>
            <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Line Chart" bordered={false}>
                            {renderLineChart()}
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="User Information" bordered={false}>
                            <p><strong>ID:</strong> {user ? user.id : 'Loading...'}</p>
                            <p><strong>Username:</strong> {user ? user.login : 'Loading...'}</p>
                            <p><strong>Email:</strong> {user ? user.email : 'Loading...'}</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Bar Chart" bordered={false}>
                            {renderBarChart()}
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Pie Chart" bordered={false}>
                            {renderPieChart()}
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Radar Chart" bordered={false}>
                            {renderRadarChart()}
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Placeholder Block" bordered={false}>
                            {/* Placeholder for future content */}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Profile;
