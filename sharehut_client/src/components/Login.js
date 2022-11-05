import React from 'react';
import bgimage from '../assets/img/share-bg.jpeg';
import logo from '../assets/img/apelogo.png';
import { useGoogleLogin} from '@react-oauth/google';

import {FcGoogle} from 'react-icons/fc';
const Login = () => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
      });



    return (
        <div className='flex justify-start flex-col h-screen'>
            <div className='relative w-full h-full'>
                <img src={bgimage} alt="" className='w-full h-full object-cover'/>
                <div className='absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} alt="sharehut" width='130px' />
                    </div>

                    <div className='shadow-2xl'>
                        
                
                                <button
                                 className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                                 onClick={() => login()}
                                >

                                    <FcGoogle className="mr-4"/> Sign in with Google
                                </button>    
                        
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default Login;