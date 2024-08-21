import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getUserInfo } from '../api/graphql';

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

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            {user ? (
                <div>
                    <h2>Welcome, {user.login}!</h2>
                    <p>Email: {user.email}</p>
                    <p>ID: {user.id}</p>
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
}

export default Profile;
