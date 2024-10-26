import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { getTotalXPWithLevel } from '../../api/graphql';

const { Title, Text } = Typography;

const UserXPAndLevelDisplay = () => {
    const [userXP, setUserXP] = useState(null);
    const [userLevel, setUserLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserXPAndLevel = async () => {
            setLoading(true);
            const result = await getTotalXPWithLevel();
            if (result !== null && result.level !== undefined && result.xp !== undefined) {
                setUserXP((result.xp / 1000).toFixed(2));
                setUserLevel(result.level);
            } else {
                console.error('Invalid data structure returned:', result);
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
