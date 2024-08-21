import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct import

// Function to query the GraphQL API with a given query
export async function queryApi(query) {
    let token = Cookies.get('token'); // Retrieve the JWT from cookies

    if (!token) {
        console.error('No token found. User might not be logged in.');
        return null;
    }

    // Decode the URL-encoded JWT
    token = decodeURIComponent(token);

    // Remove surrounding quotes if they exist
    if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    // Decode the JWT to inspect its payload (optional, for logging or additional logic)
    try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded JWT:', decodedToken);
    } catch (error) {
        console.error('Failed to decode JWT:', error.message);
        return null;
    }

    // Perform the fetch request to the GraphQL API
    try {
        const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the cleaned JWT in the Authorization header
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data; // Assuming the API response structure contains the actual data under `data.data`
    } catch (error) {
        console.error('Error querying API:', error);
        return null;
    }
}

// Function to get user information using the queryApi function
export async function getUserInfo() {
    const query = `
    query {
        user {
            id
            email
            login
        }
    }
    `;

    const userInfo = await queryApi(query);

    if (userInfo && userInfo.user && userInfo.user.length > 0) {
        const { id, email, login } = userInfo.user[0];
        return { id, email, login }; // Return an object with id, email, and login
    } else {
        console.error('Failed to fetch user info');
        return null;
    }
}

