import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { getTotalLevel, getMonthlyXP } from '../../api/graphql';

const { Title, Text } = Typography;

const UserXPAndLevelDisplay = () => {
    const [userXP, setUserXP] = useState(null);
    const [userLevel, setUserLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserXPAndLevel = async () => {
            setLoading(true);

            try {
                // Fetch total level
                const level = await getTotalLevel();
                if (level !== null) {
                    setUserLevel(level);
                } else {
                    console.error('Failed to fetch user level.');
                }

                // Fetch monthly XP and get the last month's XP as total XP
                const monthlyXP = await getMonthlyXP();
                if (monthlyXP !== null) {
                    const months = Object.keys(monthlyXP);
                    const lastMonth = months[months.length - 1];
                    setUserXP((monthlyXP[lastMonth]).toFixed(2));
                } else {
                    console.error('Failed to fetch user XP.');
                }

            } catch (error) {
                console.error('Error fetching user XP and level:', error);
            }

            setLoading(false);
        };

        fetchUserXPAndLevel();
    }, []);

    if (loading) {
        return <p style={{ textAlign: 'center', fontSize: '16px' }}>Loading...</p>;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: '16px' }}>User Level</Text>
                <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>
                    {userLevel !== null ? userLevel : 'N/A'}
                </Title>
            </div>
            <div>
                <Text type="secondary" style={{ fontSize: '16px' }}>User XP</Text>
                <Title level={3} style={{ color: '#faad14', margin: '5px 0' }}>
                    {userXP !== null ? `${userXP} KB` : 'N/A'}
                </Title>
            </div>
        </div>
    );
};

export default UserXPAndLevelDisplay;
