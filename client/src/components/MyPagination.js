import React from 'react';
import { Pagination }  from 'antd';

const MyPagination = (props) => {
    const { totalItems, page } = props.pagination;
    
    return (

        <Pagination 
            showQuickJumper 
            defaultCurrent={page} 
            total={totalItems} 
            onChange={props.onChange} />
    );
};


export default MyPagination;
