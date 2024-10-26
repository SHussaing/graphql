import React, { useEffect, useState } from 'react';
import { getAuditRatio } from '../../api/graphql';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const AuditRatioLine = () => {
    const [auditsDone, setAuditsDone] = useState(null);
    const [auditsReceived, setAuditsReceived] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditData = async () => {
            setLoading(true);
            const result = await getAuditRatio();
            if (result !== null && result.upTotal !== undefined && result.downTotal !== undefined) {
                setAuditsDone(result.upTotal);
                setAuditsReceived(result.downTotal);
            } else {
                console.error('Invalid data structure returned:', result);
            }
            setLoading(false);
        };

        fetchAuditData();
    }, []);

    const calculateRatio = () => {
        if (auditsDone !== null && auditsReceived !== null) {
            return (auditsDone / auditsReceived).toFixed(2);
        }
        return 'N/A';
    };

    const getRatioColor = () => {
        const ratio = parseFloat(calculateRatio());
        if (ratio >= 1.2) {
            return '#52c41a'; // Green for high ratio
        } else if (ratio >= 0.8 && ratio <= 1.1) {
            return '#faad14'; // Yellow for medium ratio
        } else {
            return '#ff4d4f'; // Red for low ratio
        }
    };

    if (loading) {
        return (
            <p style={{ textAlign: 'center', fontSize: '16px' }}>
                Loading...
            </p>
        );
    }

    // Prepare data for Recharts
    const data = [
        {
            name: 'Audits',
            Done: (auditsDone / 1000).toFixed(2), // Convert to KB
            Received: (auditsReceived / 1000).toFixed(2), // Convert to KB
        },
    ];

    return (
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '200px' }}>
            <p style={{ marginBottom: '10px', fontSize: '16px', color: getRatioColor() }}>
                Audit Ratio: {calculateRatio()}
            </p>
            <ResponsiveContainer width="100%" height={50}>
                <BarChart
                    data={data}
                    layout="vertical"
                    barCategoryGap={0}
                >
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        formatter={(value, name) => [`${value} KB`, name]}
                    />
                    <Bar dataKey="Done" stackId="a" fill="#1890ff" />
                    <Bar dataKey="Received" stackId="a" fill="#ffa940" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AuditRatioLine;
