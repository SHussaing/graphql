import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { getAudits } from '../../api/graphql';

const AuditsPieChart = () => {
    const [auditData, setAuditData] = useState({ pass: 0, fail: 0 });

    useEffect(() => {
        async function fetchAuditData() {
            const audits = await getAudits();

            if (audits) {
                const passCount = audits.filter(audit => audit === "pass").length;
                const failCount = audits.filter(audit => audit === "fail").length;

                setAuditData({ pass: passCount, fail: failCount });
            }
        }

        fetchAuditData();
    }, []);

    const data = [
        { name: 'Pass', value: auditData.pass },
        { name: 'Fail', value: auditData.fail },
    ];

    const COLORS = ['#4CAF50', '#F44336'];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <PieChart width={350} height={315}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default AuditsPieChart;
