import React from 'react';
import { Spin } from 'antd';

const MySpinner = () => {
    return (
        <div className="text-center">
            <Spin size="large"  style={{ marginRight: 15 }}/>
            <Spin size="large"  style={{ marginRight: 15 }}/>
            <Spin size="large" />
        </div>
    );
};

export default MySpinner;
