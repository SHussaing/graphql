import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const NotFound = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you are looking for does not exist."
                extra={
                    <Link to="/">
                        <Button type="primary" style={{ backgroundColor: '#3687d9', borderColor: '#3687d9' }}>
                            Back to Homepage
                        </Button>
                    </Link>
                }
            />
        </div>
    );
};

export default NotFound;
