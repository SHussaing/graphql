import Cookies from 'js-cookie';

const url = 'https://learn.reboot01.com/api/auth/signin';

export async function saveJWTAndAuthenticate(username, password) {
    const credentials = btoa(`${username}:${password}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const token = await response.text(); // Use text() if the token is returned as a plain string
        if (token) {
            // Store the token in a cookie
            Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
            getUserIdFromToken(); // Decode the token to get the userId
            return true; // Return true to indicate successful authentication
        } else {
            return false; // Return false to indicate failed authentication
        }
    } catch (error) {
        console.error('Error:', error);
        return false; // Return false to indicate an error occurred
    }
}

export function getUserIdFromToken() {
    const token = Cookies.get('token');
    if (!token) {
        console.error('No token found');
        return null;
    }

    try {
        // Decode the JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedPayload = JSON.parse(jsonPayload);

        // Return the userId
        return decodedPayload.userId || decodedPayload.sub || null;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}
