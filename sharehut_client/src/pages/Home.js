import React,{useRef, useState} from 'react';

import  Feed from './Feed'

const Home = () => {
  
    const scrollRef = useRef(null);
 


    return (
        <>
   

         <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
         <Feed/>
     </div>
     </>
    );
};

export default Home;