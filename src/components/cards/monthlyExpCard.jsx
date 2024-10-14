import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthlyXP } from '../../api/graphql';

const MonthlyExpCard = () => {
    const [monthlyXP, setMonthlyXP] = useState([]);

    useEffect(() => {
        async function fetchMonthlyXP() {
            const xpData = await getMonthlyXP();

            if (xpData) {
                // Transform the data into an array of objects for Recharts
                const transformedData = Object.keys(xpData).map(month => ({
                    month,
                    exp: xpData[month],
                }));
                setMonthlyXP(transformedData);
            }
        }

        fetchMonthlyXP();
    }, []);

    return (
        <Card title="Monthly EXP" bordered={false}>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyXP}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'EXP (KB)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `${value} KB`} />
                    <Legend />
                    <Line type="monotone" dataKey="exp" stroke="#42A5F5" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default MonthlyExpCard;
