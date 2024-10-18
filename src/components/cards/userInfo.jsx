import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../../api/graphql';

const UserInfo = () => {
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
        <>
            <p><strong>Username:</strong> {user ? user.login : 'Loading...'}</p>
            <p><strong>Full Name:</strong> {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
            <p><strong>Account Created:</strong> {user ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}</p>
            <p><strong>Email:</strong> {user ? user.email : 'Loading...'}</p>
            <p><strong>Phone Number:</strong> {user ? user.PhoneNumber : 'Loading...'}</p>
            <p><strong>Employment:</strong> {user ? user.employment : 'Loading...'}</p>
            <p><strong>Degree:</strong> {user ? user.Degree : 'Loading...'}</p>
        </>
    );
};

export default UserInfo;
