import React,{useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../sanity';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from '../components/Spinner';
import {Header } from '../components/Index';
import MasonryGrid from '../components/Masonry';

const Feed = () => {
    const [pins, setPins] = useState();

    const [loading, setLoading] = useState(true);
    const {categoryId} = useParams();

    useEffect(()=> {
        setLoading(true)
        if(categoryId){
            const query = searchQuery(categoryId)
            client.fetch(query).then(data => {
                
                setPins(data)
                setLoading(false)
            })
        }else{
            client.fetch(feedQuery).then(data => {
              
                setPins(data)
                setLoading(false)
            })
        }
    },[])
    if(loading) return <Spinner message="we are adding new details to your feed" />
    return (
        <div className='flex-1 px-2 md:px-5'>
            
            <div className='bg-gray-50'>
                <Header/>
            </div>
            <div className='h-full'>
                
            {pins && <MasonryGrid pins={pins} />}
            </div>
        </div>
    );
};

export default Feed;