const url = 'https://learn.reboot01.com/api/auth/signin';

export function returnJWT(username, password) {
    const credentials = btoa(`${username}:${password}`);
    const data = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
    })
    if (data.ok) {
        return data.json();
    }
    return data;


    // return fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Basic ${credentials}`,
    //     },
    // })
    //     .then((response) => response.json())
    //     .then((data) => data.accessToken)
    //     .catch((error) => console.error('Error:', error));   
}
