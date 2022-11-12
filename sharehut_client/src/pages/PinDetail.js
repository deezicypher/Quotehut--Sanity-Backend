import React,{useEffect,useCallback, useState,useRef} from 'react';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import Spinner from '../components/Spinner';
import {client, urlFor} from '../sanity';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { pinQuery } from '../utils/data';
import { FcDownload } from 'react-icons/fc';
import MasonryGrid  from '../components/Masonry';
import logo from '../assets/img/apelogo.png'
import {AiFillDelete} from 'react-icons/ai';
import { toJpeg } from 'html-to-image';


const PinDetail = () => {
    const [details, setDetails] = useState();
    const [similarpins, setSimilarpins] = useState(null);
    const [comment, setComment] = useState();
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const {user} = useOutletContext();
    const ref = useRef();


    const fetchDetails = () => {
       const  query = pinQuery(id)
        client.fetch(query)
        .then(data => {
            setDetails(data[0]);
            if(data[0]){
                //query = similarpinquery()
            }
        })
    }
    const addComment = () => {
        if(comment){
            setLoading(true)
            client
            .patch(id)
            .setIfMissing({comments: []})
            .insert('after','comments[-1]',[
                {
                    comment,
                    _key: uuidv4,
                    postedBy:{
                        _type:'postedBy',
                        _ref:user._id
                    }
                }
            ])
            .commit()
            .then(res => {
                fetchDetails()
                setComment('')
                setLoading(false)
            })
        }
    }

    const deletePin = e => {
        e.stopPropagation()
        client
           .delete(id)
           .then(()=> {
                window.location.reload();
            })
        }

        const onButtonClick = useCallback(() => {
            if (ref.current === null) {
              return
            }
        
            toJpeg(ref.current, { quality: 1.0 })
            .then((dataUrl) => {
              const link = document.createElement('a')
              link.download = `${details?.title}.jpeg`
              link.href = dataUrl
              link.click()
            })
            .catch((err) => {
              console.log(err)
            })
          }, [ref])

        const onLoad = () => {
            if (ref.current === null) {
              return null
            }
            toJpeg(ref.current, { quality: 1.0 })
              .then((dataUrl) => {
                //const link = document.createElement('a')
                //link.download = 'my-image-name.png'
                //link.href = dataUrl
                //link.click()
              })
              .catch((err) => {
                console.log(err)
              })
          }
    

    useEffect(() => {
        fetchDetails();
    },[])

    if(!details) return <Spinner message="fetching pin..."/>
    return (
        <>
        <div className='flex-1 px-2 md:px-5'>
            
        <div className='bg-gray-50'>
            <Header/>
        </div>
        <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRadius: '32px'}}>
            <div ref={ref} className='relative flex justify-center items-center  w-full h-full  md:flex-start flex-initial'>
                <img 
                src={details.image && urlFor(details.image).url()} 
                alt=''
                className='rounded-lg w-full'
                />
                 <div className='flex flex-col absolute rounded-lg w-full  justify-center items-center top-0 left-0 bottom-0 right-0 bg-quotes'>
                        <h1 className="text-gray-100 uppercase  p-10 mt-5 text-center text-bold text-4xl items-center">{details.quote}</h1>
                        <div className='p-2 flex flex-col -mb-10 justify-center items-center'>
                        <img src={logo} alt="" width='30px' />
                        <small className='text-white text-xs'>QuoteHut</small>
                    </div>
                        </div>
               
            </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center  gap-2'>
            <div
           download
           onClick={() => onButtonClick()}
           className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-80 hover:opacity-100  hover:shadow-md outline-none  "
           >
             <FcDownload/>
           </div>
         
    {details?.postedBy?._id === user._id ?
 <button onClick={e => deletePin(e)} className='flex items-center justify-center bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-9 h-9  text-base hover:shadow-md outlined-none'>
<AiFillDelete/>
    </button>
:
<></>
 } 
       
        </div>
        <div>
                    <h1 className='text-2xl font-bold break-words mt-3 capitalize'>
                        {details.title}
                    </h1>
                    <p className='mt-2 text-xs'>{details.about}</p>
                    <h1 className='text-4xl text-gray-600 break-words mt-3 capitalize'>
                        "{details.quote}"
                    </h1>
                </div>
  
                <Link 
        to={`profile/${details.postedBy._id}`}
        className='flex gap-2 mt-4 items-center'
         >
            <img src={details.postedBy.image} 
            className='w-8 h-8 rounded-full object-contain' alt=""/>
            <p className='font semibold capitalize text-sm'>{details.postedBy?.userName}</p>
         </Link>
         <h2 className='mt-9 text-base  text-gray-700'>Comments</h2>
         <div className='max-h-370 overflow-y-auto'>
            {details.comments?.map((comment, i) => (
                <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                    <img src={comment.postedBy.image} alt="" className='h-8 w-8 rounded-full cursor-pointer'/>
                    <div className='flex flex-col'>
                        <p className='font-bold text-gray-600'>{comment.postedBy.userName}</p>
                        <p>{comment.comment}</p>
                </div>
                </div>
            ))}
            </div>
           
            <div className='flex flex-wrap mt-6 gap-3 '>
            <Link 
                to={`profile/${details.postedBy._id}`}
                className='flex cursor-pointer items-center '
         >
            <img 
            src={details.postedBy.image} 
            className='w-7 h-7 rounded-full object-contain' alt=""
            />
         </Link>
         <input 
         className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300' 
         type="text" 
         placeholder='Add Comment'
         value={comment}
         onChange={e => setComment(e.target.value)}
         />
           <button 
                            onClick={addComment}
                            type='button'
                            className='bg-blue-500 hover:bg-blue-600 text-white outline-none rounded-lg w-20 font-bold'
                            >{loading? '....' : 'Publish' }</button>
 </div>
</div>
        </div>
   
    {
        similarpins?.length > 0 && (
            <>
        <h2 className='font-bold text-2xl mt-2'>Similar Quotes</h2>
        <MasonryGrid pins={similarpins} />
        </>
        )
    }
     </div>
    </>
    );
};

export default PinDetail;