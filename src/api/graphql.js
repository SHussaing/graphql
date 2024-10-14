import Cookies from 'js-cookie';
import { getUserIdFromToken } from './auth';

// Function to query the GraphQL API with a given query
export async function queryApi(query) {
    let token = Cookies.get('token'); // Retrieve the JWT from cookies

    if (!token) {
        console.error('No token found. User might not be logged in.');
        return null;
    }

    // Remove surrounding quotes if they exist
    if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
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
            email
            login
            attrs
        }
    }
    `;

    const userInfo = await queryApi(query);

    if (userInfo && userInfo.user && userInfo.user.length > 0) {
        const { email, login, attrs } = userInfo.user[0];
        const { firstName, lastName, PhoneNumber, employment } = attrs;

        return { firstName, lastName, PhoneNumber, employment, email, login }; 
    } else {
        console.error('Failed to fetch user info');
        return null;
    }
}

// Function to get the monthly XP grouped by year and month
export async function getMonthlyXP() {
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('No user ID found. Unable to fetch XP.');
        return null;
    }

    const query = `
    query {
        transaction(where: { userId: { _eq: ${userId} }, type: { _eq: "xp" } }, order_by: { createdAt: asc }) {
            amount
            createdAt
            userId
            type
            eventId
            path
        }
    }
    `;

    const transactions = await queryApi(query);

    if (!transactions || !transactions.transaction) {
        console.error('Failed to fetch transactions');
        return null;
    }

    // Extract unique eventIds and find the second lowest
    const uniqueEventIds = [...new Set(transactions.transaction.map(t => t.eventId))].sort((a, b) => a - b);
    
    if (uniqueEventIds.length < 2) {
        console.error('Not enough unique eventIds to determine the second lowest.');
        return null;
    }

    const secondLowestEventId = uniqueEventIds[1];

    // Filter transactions by the second-lowest eventId
    const filteredTransactions = transactions.transaction.filter(t => t.eventId === secondLowestEventId);

    // Determine the range of months from the first transaction to the current month
    const firstTransactionDate = new Date(filteredTransactions[0]?.createdAt);
    const currentDate = new Date();

    const startYear = firstTransactionDate.getFullYear();
    const startMonth = firstTransactionDate.getMonth(); // 0-indexed
    const endYear = currentDate.getFullYear();
    const endMonth = currentDate.getMonth(); // 0-indexed

    // Function to create a string for year-month in 'YYYY-MM' format
    const formatYearMonth = (year, month) => `${year}-${String(month + 1).padStart(2, '0')}`;

    // Create a list of all months from start to current month
    const allMonths = [];
    for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0;
        const monthEnd = year === endYear ? endMonth : 11;
        for (let month = monthStart; month <= monthEnd; month++) {
            allMonths.push(formatYearMonth(year, month));
        }
    }

    // Group transactions by Year and Month, carrying over XP from previous months
    let cumulativeXP = 0;
    const monthlyXP = filteredTransactions.reduce((acc, curr) => {
        const date = new Date(curr.createdAt);
        const yearMonth = formatYearMonth(date.getFullYear(), date.getMonth());

        if (!acc[yearMonth]) {
            acc[yearMonth] = 0;
        }

        cumulativeXP += curr.amount;
        acc[yearMonth] = cumulativeXP / 1000; // Convert cumulative XP to KB

        return acc;
    }, {});

    // Ensure all months are present and carry over the cumulative XP from previous months
    let lastXP = 0;
    const fullMonthlyXP = allMonths.reduce((acc, month) => {
        if (monthlyXP[month]) {
            lastXP = monthlyXP[month]; // Update cumulative XP if available
        }
        acc[month] = lastXP; // Carry forward the last available XP value
        return acc;
    }, {});

    console.log(fullMonthlyXP);
    // Return the full list of months with their respective XP values
    return fullMonthlyXP;
}


export async function getAudits() {
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('No user ID found. Unable to fetch audits.');
        return [];
    }

    const query = `
    query {
        audit(where: { auditorId: { _eq: ${userId} } }) {
            grade
        }
    }
    `;

    const audits = await queryApi(query);

    // Update this condition to match the actual structure of the response
    if (!audits || !audits.audit || !Array.isArray(audits.audit)) {
        console.error('Failed to fetch audits or audits data is not an array');
        return [];
    }

    // Process the grades into "pass" or "fail"
    const result = audits.audit
        .filter(audit => audit.grade !== null) // Exclude null grades
        .map(audit => (audit.grade >= 1 ? "pass" : "fail"));

    return result;
}


export async function getTotalXP() {
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('No user ID found. Unable to fetch XP.');
        return null;
    }

    const query = `
    query {
      transaction(where: { userId: { _eq: ${userId} }, type: { _eq: "xp" }, eventId: { _eq: 72, } }) {
        amount
      }
    }
  `;


  const totalXP = await queryApi(query);
  console.log("Total XP", totalXP);

}