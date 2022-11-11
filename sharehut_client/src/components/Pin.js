import React,{useState} from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {client, urlFor} from '../sanity'; 
import {FcDownload} from 'react-icons/fc';
import {v4 as uuidv4} from 'uuid';
import {AiFillDelete} from 'react-icons/ai';

const Pin = ({pin:{_id, image, postedBy, destination,save}}) => {
    const navigate = useNavigate();
    const [postHovered, setPostHovered] = useState(false);
    const {user} = useOutletContext();

    const alreadySaved = !!(save?.filter(item => item.postedBy._id === user._id))?.length

    const savePin = e => {
        e.stopPropagation()
        if(!alreadySaved){
            client
            .patch(_id)
            .setIfMissing({save:[]})
            .insert('after', 'save[-1]',[{
                _key: uuidv4(),
                userId: user._id,
                postedBy:{
                    _type:'postedBy',
                    _ref: user._id,
                }
            }])
            .commit()
            .then(()=> {
                window.location.reload();
            })
        }
    }

    const deletePin = e => {
        e.stopPropagation()
        client
           .delete(_id)
           .then(()=> {
                window.location.reload();
            })
        }
        
        return (
    
    <div className='mt-2 p-2'>
        <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`pin/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >

<img src={urlFor(image).width(250).url()} className='rounded-lg w-full' alt=""/>
   {postHovered && (
    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-0' style={{height:'100%'}} >
        <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
                <a 
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={e => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-80 hover:opacity-100 hover:shadow-md outline-none  "
                >
                    <FcDownload/>
                </a>
            </div>
            <div className='flex'>
            {alreadySaved? 
                <button type="button" disabled className='cursor-pointer  bg-orange-500 opacity-70 hover:opacity-100 text-white text-sm px-3 py-0  rounded-3xl hover:shadow-md outlined-none'> {save?.length} Saved</button>
                :
                <button type="button" onClick={e => savePin(e)} className='cursor-pointer bg-orange-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-0  text-base rounded-3xl hover:shadow-md outlined-none'>Save</button>
 }
 </div> 
            </div>
            <div className='flex justify-between items-end gap-2 w-full'>
    {postedBy?._id === user._id ?
 <button onClick={e => deletePin(e)} className='flex items-center justify-center bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-6 h-6  text-base hover:shadow-md outlined-none'>
<AiFillDelete/>
    </button>
:
<></>
 } 
        </div>
        </div>
   )}
        </div>

        <Link 
        to={`profile/${postedBy._id}`}
        className='flex gap-2 mt-4 items-center '
         >
            <img src={postedBy.image} 
            className='w-8 h-8 rounded-full object-contain' alt=""/>
            <p className='font semibold capitalize text-sm'>{postedBy?.userName}</p>
         </Link>
     </div>  


    );
};

export default Pin;