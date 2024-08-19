const url = 'https://learn.reboot01.com/api/auth/signin';

export function returnJWT(username, password) {
    const credentials = btoa(`${username}:${password}`);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        return response.text(); // Use text() if the token is returned as a plain string
    })
    .then((token) => {
        return token || null; // Ensure the token is returned correctly
    })
    .catch((error) => {
        console.error('Error:', error);
        return null;
    });
}


