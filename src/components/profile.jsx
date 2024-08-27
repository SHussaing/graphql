import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography, Row, Col, Card } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserInfo, getMonthlyXP, getAudits } from '../api/graphql';

const { Header, Content } = Layout;
const { Text } = Typography;

function Profile() {
    const [user, setUser] = useState(null);
    const [monthlyXP, setMonthlyXP] = useState({});
    const [auditResults, setAuditResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUser(userInfo);
            } else {
                console.error('Failed to fetch user info');
            }

            const xpData = await getMonthlyXP();
            if (xpData) {
                setMonthlyXP(xpData);
            } else {
                console.error('Failed to fetch monthly XP data');
            }

            const audits = await getAudits();
            if (audits) {
                setAuditResults(audits);
            } else {
                console.error('Failed to fetch audit results');
            }
        }

        fetchData();
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const renderLineChart = () => {
        const dataPoints = Object.keys(monthlyXP).map((key, index, array) => {
            const x = (index / (array.length - 1)) * 100;
            const y = 100 - (monthlyXP[key] / 500) * 100;
            return { x, y, label: monthlyXP[key], month: key };
        });

        return (
            <svg width="100%" height="200" viewBox="0 0 100 120">
                <polyline
                    fill="none"
                    stroke="#8884d8"
                    strokeWidth="2"
                    points={dataPoints.map(point => `${point.x},${point.y}`).join(' ')}
                />
                {dataPoints.map((point, index) => (
                    <g key={index}>
                        <circle cx={point.x} cy={point.y} r="2" fill="#8884d8" />
                        <text x={point.x} y={point.y - 5} textAnchor="middle" fontSize="3" fill="#fff">
                            {point.label}
                        </text>
                        <text x={point.x} y="110" textAnchor="middle" fontSize="3" fill="#fff">
                            {point.month}
                        </text>
                    </g>
                ))}
            </svg>
        );
    };

    const calculatePassFail = () => {
        const passCount = auditResults.filter(result => result === 'pass').length;
        const failCount = auditResults.filter(result => result === 'fail').length;

        return { passCount, failCount };
    };

    const renderPieChart = () => {
        const { passCount, failCount } = calculatePassFail();
    
        const total = passCount + failCount;
        const passPercentage = ((passCount / total) * 100).toFixed(2);
        const failPercentage = ((failCount / total) * 100).toFixed(2);
        const passAngle = (passCount / total) * 360;
        const failAngle = (failCount / total) * 360;
    
        const describeArc = (cx, cy, radius, startAngle, endAngle) => {
            const start = polarToCartesian(cx, cy, radius, endAngle);
            const end = polarToCartesian(cx, cy, radius, startAngle);
    
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
            return [
                "M", start.x, start.y, 
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
                "L", cx, cy,
                "Z"
            ].join(" ");
        };
    
        const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    
            return {
                x: cx + (radius * Math.cos(angleInRadians)),
                y: cy + (radius * Math.sin(angleInRadians))
            };
        };
    
        return (
            <svg width="100" height="100" viewBox="0 0 32 32">
                <path
                    d={describeArc(16, 16, 16, 0, passAngle)}
                    fill="#4CAF50"
                >
                    <title>{`Pass: ${passPercentage}%`}</title>
                </path>
                <path
                    d={describeArc(16, 16, 16, passAngle, passAngle + failAngle)}
                    fill="#F44336"
                >
                    <title>{`Fail: ${failPercentage}%`}</title>
                </path>
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
                            <p><strong>Username:</strong> {user ? user.login : 'Loading...'}</p>
                            <p><strong>Full Name: </strong> {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                            <p><strong>Email:</strong> {user ? user.email : 'Loading...'}</p>
                            <p><strong>Phone Number:</strong> {user ? user.PhoneNumber : 'Loading...'}</p>
                            <p><strong>Employment:</strong> {user ? user.employment : 'Loading...'}</p>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Audit Results" bordered={false}>
                            {renderPieChart()}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Profile;
