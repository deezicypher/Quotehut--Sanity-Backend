import React,{useEffect,useRef, useState} from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import {CgMenuLeft} from 'react-icons/cg';
import { Link } from 'react-router-dom';
import logo from '../assets/img/viperHut1.png';
import {SlClose} from 'react-icons/sl';
import {Sidebar} from './Index.js';
import  {client}  from '../sanity';
import { userQuery } from '../utils/data';


const Layout = () => {
    const [toggleNav, setToggleNav] = useState(false);
    const [user, setUser] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const userInfo = localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
     
    const scrollRef = useRef(null);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
      };

      const checkAuthTimeout = expirationTime => {
        setTimeout(() => {
          logout()
        }, expirationTime * 1000);
    }
    
    const authCheckState = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user === undefined || user === null) {
         logout()
        } else {
          const expirationDate = new Date(user.expirationDate);
          if (expirationDate <= new Date()) {
            logout()
          } else {
              checkAuthTimeout(
                (expirationDate.getTime() - new Date().getTime()) / 1000
              )
          }
        }

};

    useEffect(()=> {
        //scrollRef.current.scrollTo(0,0)
        authCheckState()
        if(!userInfo) {
           navigate('/Login');
        }
        const query = userQuery(userInfo?._id);
        client.fetch(query)
        .then(res => {
            setUser(res[0])
        })
    },[])
    return (
  
           
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      
        <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user} closeNav={setToggleNav}/>
        </div>

        <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
            <CgMenuLeft fontSize={40} className='cursor-pointer' onClick={() => setToggleNav(true)} />
            <Link to="/">
                <img src={logo} alt="logo" className='w-24'/>
            </Link>
            <Link to={`/profile/${user?.username}`}>
                <img src={user?.image} referrerPolicy="no-referrer" alt="" className='w-12 rounded-full'/>
            </Link>
        </div> 
        {toggleNav && (
            <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md animate-slide-in z-50'>
                <div className='absolute w-full flex justify-end items-center p-2'>
                <SlClose fontSize={40} className='cursor-pointer' onClick={() => setToggleNav(false)} />
                </div>
                <Sidebar user={user} closeNav={setToggleNav}/>
            </div>
        )}
        </div>
      
      
       <Outlet context={{user , setSearchTerm, searchTerm}}/>
    </div> 


    );
};

export default Layout;