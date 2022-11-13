import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { client } from '../sanity';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import bg from '../assets/img/bg.jpg';
import { googleLogout } from '@react-oauth/google';
import {AiOutlineLogout} from 'react-icons/ai'
import MasonryGrid  from '../components/Masonry';


const Profile = () => {
    const [user, setUser] = useState();
    const [pins, setPins] = useState();
    const [activeTab, setActiveTab] = useState('created');
    const [text, setText] = useState();
    const navigate = useNavigate();
    const {id} = useParams();

    const logout = () => {
        googleLogout();
        localStorage.clear();
        navigate('/Login')
    }
 
    const activeTabStyle = 'bg-darkOrange mr-4 text-white p-2 rounded-full w-20 outline-none';
    const nonActiveTabStyle = 'text-gray-600 mr-4 font-bold p-2 rounded-lg w-20 outline-none';
    useEffect(()=> {
        const query = userQuery(id);
        client.fetch(query)
        .then(data => {
            setUser(data[0])
        })
    },[])

    useEffect(() => {
        if(activeTab  === 'created'){
            const query = userCreatedPinsQuery(id);
            client.fetch(query)
            .then(data => {
                setPins(data)
            })
        }else{
            const query = userSavedPinsQuery(id);
            client.fetch(query)
            .then(data => {
                setPins(data)
            })
        }
    },[activeTab,id])

    if(!user) return <Spinner message="fetching profile..."/>
    return (
        <div className='relative pb-2 h-full lg:w-full justify-center items-center'>
{console.log(user)}
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                <div className='flex flex-col justify-center items-center'>
                    <img src={bg} alt="" className='w-full h-370 2xl:h-510 shadow-lg object-cover'/>
                    <div className='absolute w-full h-370 2xl:h-510  flex justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
                        <h1 className="text-gray-200 opacity-50 text-bold text-6xl">Profile</h1>
                        </div>
                     
                        <img 
                        src={user?.image}
                        alt=""
                        className='rounded-full h-20 w-20 z-10 -mt-10 shadow-xl object-contain'
                        />
                        <h1 className='font-bold text-2xl text-gray-700 text-center mt-3'> 
                        {user.userName}
                        </h1>

                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {user._id === id && (
                               <div className='absolute top-0 z-1 right-0 p-2'>
                                <button
                                    type='button'
                                    className='bg-white p-2 rounded-full cursor-pointer'
                                    onClick={() => {
                                        logout()
                                    }}><AiOutlineLogout color='red' className='w-10 h-10' /></button>
                                
                               </div>
                            )}
                        </div>

                        <div className='text-center mb-7 mt-5'>
                            <button 
                                type="button"
                                onClick={e => {
                                    setActiveTab('created')
                                    
                                }}
                                className={`${activeTab === 'created' ? activeTabStyle : nonActiveTabStyle}`}
                                >created</button>
                                <button 
                                type="button"
                                onClick={e => {
                                    setActiveTab('saved')
                               
                                }}
                                className={`${activeTab === 'saved' ? activeTabStyle : nonActiveTabStyle}`}
                                >saved</button>
                        </div>
                        </div>
{pins?.length? 
                        <div className='px-2'>
                            <MasonryGrid pins={pins} />
                        </div>
                        : 
                        <div className='flex font-bold text-gray-700 tex-2xl justify-center items-center'>
                            No Pins
                            </div>
}
               
                </div>
            </div>
        </div>
    );
};

export default Profile;