import React from 'react';
import bgimage from '../assets/img/bg.png';
import logo from '../assets/img/viperHut1.png';
import { useGoogleLogin} from '@react-oauth/google';
import axios from 'axios';
import { client } from '../sanity';
import {FcGoogle} from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            // fetching userinfo can be done on the client or the server
            const userInfo = await axios
              .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              }).then(res => res.data)
            

            const {name, picture, sub} = userInfo;
            const doc = {
                _id:sub,
                _type:'user',
                userName:name,
                image:picture,
                expirationDate: new Date(new Date().getTime() + 3600 * 1000),
            }
            localStorage.setItem('user', JSON.stringify(doc))
            client.createIfNotExists(doc).then(()=> {
                navigate('/',{replace:true})
            })

          },
      });


    return (
        <div className='flex justify-start flex-col h-screen'>
            <div className='relative w-full h-full'>
                <img src={bgimage} alt="" className='w-full h-full object-cover'/>
                <div className='absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
                    <div className='flex flex-col justify-center items-center p-5'>
                        <img src={logo} alt="sharehut" width='130px' />
                        <p className='text-white' >Sutra</p>
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