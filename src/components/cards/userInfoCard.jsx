import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { getUserInfo } from '../../api/graphql';

const UserInfoCard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUser(userInfo);
            } else {
                console.error('Failed to fetch user info');
            }
        }

        fetchData();
    }, []);

    return (
        <Card title="User Information" bordered={false}>
            <p><strong>Username:</strong> {user ? user.login : 'Loading...'}</p>
            <p><strong>Full Name: </strong> {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
            <p><strong>Email:</strong> {user ? user.email : 'Loading...'}</p>
            <p><strong>Phone Number:</strong> {user ? user.PhoneNumber : 'Loading...'}</p>
            <p><strong>Employment:</strong> {user ? user.employment : 'Loading...'}</p>
        </Card>
    );
};

export default UserInfoCard;
