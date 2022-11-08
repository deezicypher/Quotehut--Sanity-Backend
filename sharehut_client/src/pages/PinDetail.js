import React from 'react';
import Header from '../components/Header';
import Feed from './Feed';

const PinDetail = () => {
    return (
        <div className='flex-1 px-2 md:px-5'>
            
        <div className='bg-gray-50'>
            <Header/>
        </div>
        <div className='h-full'>
        <h1>details</h1>
        </div>
    </div>
    );
};

export default PinDetail;