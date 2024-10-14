import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { getAudits } from '../../api/graphql';

const AuditsDoneCard = () => {
    const [auditData, setAuditData] = useState({ pass: 0, fail: 0 });

    useEffect(() => {
        async function fetchAuditData() {
            const audits = await getAudits();

            if (audits) {
                // Count pass and fail
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
        <Card title="Audits Done" bordered={false}>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>
        </Card>
    );
};

export default AuditsDoneCard;
