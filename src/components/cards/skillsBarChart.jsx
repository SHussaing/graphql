import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSkills } from '../../api/graphql';

const SkillsBarChart = () => {
    const [skillsData, setSkillsData] = useState([]);

    useEffect(() => {
        async function fetchSkillsData() {
            const data = await getSkills();
            if (data) {
                setSkillsData(data);
            }
        }

        fetchSkillsData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis label={{ value: 'Total Amount', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} Points`} />
                <Legend />
                <Bar dataKey="totalAmount" fill="#42A5F5" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SkillsBarChart;
