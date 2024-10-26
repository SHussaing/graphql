import React, { useEffect, useState } from 'react';
import { getAuditRatio } from '../../api/graphql';

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

    if (loading) {
        return <p style={{ textAlign: 'center', fontSize: '16px' }}>Loading...</p>;
    }

    // Calculate the total and percentages
    const total = auditsDone + auditsReceived;
    const donePercentage = ((auditsDone / total) * 100).toFixed(2);
    const receivedPercentage = ((auditsReceived / total) * 100).toFixed(2);

    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{
                display: 'flex',
                height: '30px',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                borderRadius: '5px',
                overflow: 'hidden',
                border: '1px solid #ccc',
                position: 'relative'
            }}>
                <div
                    className="hover-section"
                    style={{
                        width: `${donePercentage}%`,
                        backgroundColor: '#52c41a',
                        transition: 'width 0.5s ease',
                        position: 'relative',
                    }}
                    data-tooltip={`Audits Done: ${auditsDone}`}
                ></div>
                <div
                    className="hover-section"
                    style={{
                        width: `${receivedPercentage}%`,
                        backgroundColor: '#fa541c',
                        transition: 'width 0.5s ease',
                        position: 'relative',
                    }}
                    data-tooltip={`Audits Received: ${auditsReceived}`}
                ></div>
            </div>
            <p style={{ marginTop: '10px', fontSize: '16px' }}>
                Done:Received Ratio: {calculateRatio()}
            </p>

            {/* Add styling for the tooltip */}
            <style>{`
                .hover-section {
                    position: relative;
                }

                .hover-section::before {
                    content: attr(data-tooltip);
                    position: absolute;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 5px;
                    border-radius: 3px;
                    font-size: 12px;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    white-space: nowrap;
                    transform: translate(-50%, -100%);
                    bottom: 100%;
                    left: 50%;
                }

                .hover-section:hover::before {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default AuditRatioLine;
