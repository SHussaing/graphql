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

export async function getTotalLevel() {
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('No user ID found. Unable to fetch level.');
        return null;
    }

    // Define the query to filter by object name "Module" without the level check
    const query = `
    query {
        event_user(where: { 
            userId: { _eq: ${userId} }, 
            event: { object: { name: { _eq: "Module" } } }
        }) {
            level
        }
    }
    `;

    try {
        const response = await queryApi(query);

        // Check if the response is valid and contains event_user data
        if (!response || !response.event_user || response.event_user.length === 0) {
            console.error('No level found for the specified criteria.');
            return null;
        }

        // Sum up all levels from the filtered events
        const totalLevel = response.event_user.reduce((acc, curr) => acc + curr.level, 0);

        return totalLevel;

    } catch (error) {
        console.error('Error fetching the total level:', error);
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
            createdAt
            attrs
        }
    }
    `;

    const userInfo = await queryApi(query);

    if (userInfo && userInfo.user && userInfo.user.length > 0) {
        const { email, login, createdAt, attrs } = userInfo.user[0];
        const { firstName, lastName, PhoneNumber, employment, Degree } = attrs;

        return { firstName, lastName, PhoneNumber, employment, Degree, email, login, createdAt}; 
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

    // Define the query to filter by object name "Module" and type "xp"
    const query = `
    query {
        transaction(where: { 
            userId: { _eq: "${userId}" }, 
            type: { _eq: "xp" }, 
            event: { object: { name: { _eq: "Module" } } } 
        }, order_by: { createdAt: asc }) {
            amount
            createdAt
        }
    }
    `;

    const transactions = await queryApi(query);

    if (!transactions || !transactions.transaction) {
        console.error('Failed to fetch transactions');
        return null;
    }

    // Determine the range of months from the first transaction to the current month
    const firstTransactionDate = new Date(transactions.transaction[0]?.createdAt);
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
    const monthlyXP = transactions.transaction.reduce((acc, curr) => {
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

    // Return the full list of months with their respective XP values
    return fullMonthlyXP;
}


export async function getAudits() {
    const query = `
    query {
        user {
            audits {
                grade
            }
        }
    }
    `;

    try {
        const response = await queryApi(query);

        // Check if the response structure matches the expected data
        if (!response || !response.user || !Array.isArray(response.user) || response.user.length === 0) {
            console.error('Failed to fetch audits or invalid user data structure');
            return [];
        }

        // Process the grades into "pass" or "fail"
        const audits = response.user.flatMap(user => user.audits || []);
        const result = audits
            .filter(audit => audit.grade !== null) // Exclude null grades
            .map(audit => (audit.grade >= 1 ? "pass" : "fail"));

        return result;

    } catch (error) {
        console.error('Error fetching audits:', error);
        return [];
    }
}



export async function getSkills() {
    const query = `
    query {
      transaction(where: { 
        type: { _in: ["skill_go", "skill_html", "skill_docker", "skill_js", "skill_css", "skill_sql", "skill_unix"] }
      }) {
        type
        amount
      }
    }
  `;

    try {
        const skillsData = await queryApi(query);

        // Check if the response has the expected structure
        if (!skillsData || !skillsData.transaction || !Array.isArray(skillsData.transaction)) {
            console.error('Invalid data format or no transactions returned:', skillsData);
            return null;
        }

        // Define a mapping of skill types to their proper names
        const skillNameMapping = {
            skill_go: "Go",
            skill_html: "HTML",
            skill_docker: "Docker",
            skill_js: "JavaScript",
            skill_css: "CSS",
            skill_sql: "SQL",
            skill_unix: "Unix"
        };

        // Group transactions by type and sum the amounts
        const groupedSkills = skillsData.transaction.reduce((acc, transaction) => {
            const friendlyName = skillNameMapping[transaction.type] || transaction.type;

            if (!acc[friendlyName]) {
                acc[friendlyName] = 0;
            }
            acc[friendlyName] += transaction.amount;
            return acc;
        }, {});

        // Convert the grouped object into an array
        const groupedArray = Object.keys(groupedSkills).map(type => ({
            type,
            totalAmount: groupedSkills[type]
        }));

        return groupedArray;
    } catch (error) {
        console.error('Error fetching skills data:', error);
        return null;
    }

}


// Function to get the audit ratio by summing up the 'up' and 'down' transactions
export async function getAuditRatio() {
    const userId = getUserIdFromToken();

    if (!userId) {
        console.error('No user ID found. Unable to fetch transactions.');
        return null;
    }

    // Construct the GraphQL query
    const query = `
    query {
        transaction(where: { 
            userId: { _eq: "${userId}" },
            type: { _in: ["up", "down"] }
        }) {
            amount
            type
        }
    }
    `;

    try {
        const transactions = await queryApi(query);

        if (!transactions || !transactions.transaction) {
            console.error('Failed to fetch transactions');
            return null;
        }

        // Sum up the amounts for 'up' and 'down' transactions
        let upTotal = 0;
        let downTotal = 0;

        transactions.transaction.forEach((transaction) => {
            if (transaction.type === 'up') {
                upTotal += transaction.amount;
            } else if (transaction.type === 'down') {
                downTotal += transaction.amount;
            }
        });
        console.log(upTotal, downTotal);
        // Return the totals as an object
        return {
            upTotal,
            downTotal,
        };
        
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
}





