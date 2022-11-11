import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { client } from '../sanity';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from '../components/Spinner';
import MasonryGrid from '../components/Masonry';
import { useOutletContext } from 'react-router-dom';

const Search = () => {

    const [pins, setPins] = useState();
    const [loading, setLoading] = useState();
    const {searchTerm} = useOutletContext()

    useEffect(()=>{
        if(searchTerm) {
            setLoading(true);
            const query = searchQuery(searchTerm.toLowerCase());
            client.fetch(query)
            .then(data => {
                    setPins(data)
                    setLoading(false);
            })

        }else{
            client.fetch(feedQuery)
            .then(data => {
                    setPins(data)
                    setLoading(false);
            })
        }

    },[searchTerm])


    return (
        <div className='flex-1 px-2 md:px-5'>
           
        <div className='bg-gray-50'>
            <Header/>
        </div>
        <div className='h-full'>
         
        {loading&&(<Spinner message="Searching pins..." />)}
        {pins?.length > 0 && <MasonryGrid pins={pins} /> }
        {pins?.length === 0 && searchTerm !== '' && !loading && (
            <div className='flex font-bold text-gray-700 tex-2xl justify-center items-center'>
            No Pins
            </div>
        )}

        </div>
    </div>
    );
};

export default Search;