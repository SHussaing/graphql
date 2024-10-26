import { Layout, Dropdown, Avatar, Typography, Row, Col, Card } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserInfoDisplay from './cards/userInfoDisplay';
import ExpLineChart from './cards/expLineChart';
import AuditsPieChart from './cards/auditsPieChart';
import SkillsBarChart  from './cards/skillsBarChart';
import UserXPAndLevelCard from './cards/userLevelDisplay';
import AuditRatioDisplay from './cards/auditRatioDisplay';

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
                    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="Logo" style={{ width: '40px', marginRight: '16px' }} />
                    <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>GraphQL</Text>
                </div>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                        <DownOutlined style={{ color: 'white' }} />
                    </div>
                </Dropdown>
            </Header>
            <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="User Information" bordered={false} style={{ height: '385px' }}>
                            <UserInfoDisplay />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="User Level & EXP" bordered={false} style={{ height: '385px' }}>
                            <UserXPAndLevelCard />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Audit Ratio" bordered={false} style={{ height: '385px' }}>
                            <AuditRatioDisplay />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Technology Skills" bordered={false} style={{ height: '385px' }}>
                            <SkillsBarChart />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Monthly EXP" bordered={false} style={{ height: '385px' }}>
                            <ExpLineChart />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card title="Audits Done" bordered={false} style={{ height: '385px' }}>
                            <AuditsPieChart />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Profile;
