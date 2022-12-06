import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/img/viperHut1.png';
import {HiHomeModern} from 'react-icons/hi2';
import life from '../assets/img/life.jpeg'; 
import art from '../assets/img/art.jpeg'; 
import coding from '../assets/img/coding.jpeg'; 
import movies from '../assets/img/movies.jpeg'; 
import philosophy from '../assets/img/philosophy.jpeg'; 
import self from '../assets/img/self.jpeg';
import {AiFillGithub} from 'react-icons/ai';


const notActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const activeStyle = 'flex items-center px-5 font-extrabold border-r-2 border-black gap-3 text-gray-500  transition-all duration-200 ease-in-out capitalize'
const Sidebar = ({user, closeToggle}) => {

    const slugify = str =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    

    const categories = [
        { name:"Philosophy",
        image: philosophy,
    },
        {name:'Life', image: life},
        {name:"Self Development", image: self},
        {name:"Coding", image: coding},
        {name:"Art", image: art},
        {name:"Movies", image: movies},
        {name:"Others", image: life},
    ]
    
    const handleCloseSidebar = () => {
        if(closeToggle) closeToggle(false)
    }


    return (
     
        <div className='flex flex-col justify-between bg-white h-full overflow-y-auto  min-w-210 hide-scroll-bar'>
       
            <div className='flex flex-col'>
             <div className='flex flex-col'>
                    <Link 
                    to="/"
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}
                    >
                    <span className='font-bold text-sm text-gray-700'></span><img src={logo} alt="" className='w-18' />
                    </Link>
            </div>

            <div className='flex flex-col gap-5'>
                <NavLink
                    to="/"
                    className={({isActive}) => isActive ? activeStyle : notActiveStyle}>
                         <HiHomeModern/> Home

                    </NavLink>
                    <h3 className='mt-2 px-5 text-base 2xl:text-xl'>
                        Discover Categories
                    </h3>
                    {categories.slice(0, categories.length-1).map(category => (
                        <NavLink 
                        to={`/categories/${slugify(category.name)}`}
                        onClick={handleCloseSidebar}
                        className={({isActive}) => isActive ? activeStyle : notActiveStyle}
                        key={category.name}>
                            <img src={category.image} alt="" className='rounded-full h-5 w-5 shadow-sm'/>
                            {category.name}
                            
                            </NavLink>
                    ))}
            </div>
          
        </div>
       
   
         <a href='https://github.com/deezitheviper'>
            <div
            className="flex gap-2 p-2 items-center justify-center  bg-white rounded-lg shadow-lg mx-3">
                <AiFillGithub fontSize={20}/>
                <p className='text-xs'>&copy; 2022 DeezitheViper</p> 
                
            </div>
            </a>


     
        </div>
    );
};

export default Sidebar;