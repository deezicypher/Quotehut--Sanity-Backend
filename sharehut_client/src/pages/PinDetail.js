import React,{useEffect,useCallback, useState,useRef} from 'react';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import Spinner from '../components/Spinner';
import {client, urlFor} from '../sanity';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { pinQuery, similarPin } from '../utils/data';
import { HiDocumentDownload } from 'react-icons/hi';
import MasonryGrid  from '../components/Masonry';
import logo from '../assets/img/viperHut.png'
import {AiFillDelete} from 'react-icons/ai';
import { toJpeg } from 'html-to-image';
import {BsFillBookmarkPlusFill} from 'react-icons/bs';
import {BsFillBookmarkDashFill} from 'react-icons/bs';
import {AiFillTags} from 'react-icons/ai';
import {FcInfo} from 'react-icons/fc';
import Modal from '../components/Modal';



const PinDetail = () => {
    const [details, setDetails] = useState();
    const [similarpins, setSimilarpins] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const [imgH, setImgH] = useState('');
    const {user} = useOutletContext();
    const ref = useRef();
    const imgElement = useRef();
    const navigate = useNavigate();
    const [pinmodal, showPinModal] = useState(false);
    const [commentmodal, showCommentModal] = useState(false);
    const [cid, setCid] = useState('');
    const alreadySaved = !!(details?.save?.filter(item => item.postedBy._id === user._id))?.length

   
    var textstyle = ''
    
    
    if(details?.quote.length > 0){
        const {quote} = details
        let style = ''
    
        if (quote.length < 100){
            style = 'text-2xl md:text-3xl px-5'
            if(imgH >= 450){
                style = 'text-3xl px-5 md:text-4xl'
            }
        }
        if (quote.length <= 50) {
            style = 'text-4xl px-5 md:text-4xl '
            if(imgH <= 240){
                style = 'text-2xl px-3 md:text-base'
            }
            
        }
        if(quote.length >= 100) {
            style = 'text-3xl md:text-4xl  px-5'
            if(imgH <= 300){
                style = 'text-lg px-3'
            }
            if(imgH >= 500){
                style = 'text-3xl md:text-3xl px-3'
            }
        }
        textstyle = style
    }

    const fetchDetails = () => {
       const  query = pinQuery(id)
        client.fetch(query)
        .then(data => {

            setDetails(data[0]);
            if(data[0]){
                const spquery = similarPin(data[0])
                client.fetch(spquery)
                .then(data => {
                    //console.log(data)
                    setSimilarpins(data)
                });
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
                    _key: uuidv4(),
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

   

    const savePin = e => {
        e.stopPropagation()
        if(!alreadySaved){
            client
            .patch(id)
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
                fetchDetails()
            })
        }
    }
    const unsavePin = e => {
        e.stopPropagation()
        if(alreadySaved){
        const pintoUnsave = ['save[0]',`save[userId=="${user._id}"]`]
           client
           .patch(id)
           .unset(pintoUnsave)
           .commit()
           .then(()=> {
            fetchDetails()
        })
        }
    }

    const deletePin = () => {
        client
           .delete(id)
           .then(()=> {
            showPinModal(false);
            navigate('/')
            })
        }

    const deleteComment = () => {
            
            const commentToRemove = ['comments[0]', `comments[_key=="${cid}"]`]
            client
               .patch(id)
               .unset(commentToRemove)
               .commit()
               .then(()=> {
                   fetchDetails()
                   showCommentModal(false);
                }).catch(err => console.log(err))
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

    if(!details) return <Spinner message="fetching quote..."/>
    return (
        <>
        {pinmodal && (
        <Modal showPinModal={showPinModal} Delete={deletePin} />
        )}
         {commentmodal && (
        <Modal showPinModal={showCommentModal} Delete={deleteComment} cid={cid} />
        )}
        <div className='flex-1 px-2 md:px-5'>
            {/*console.log(details.quote.length, textstyle, imgH)*/}
        <div className='bg-gray-50'>
            <Header/>
        </div>
        <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRadius: '32px'}}>
            <div ref={ref} className='relative flex justify-center items-center  w-full h-full  md:flex-start flex-initial'>
                <img 
                src={details.image && urlFor(details.image).url()} 
                alt=''
                className='rounded-lg w-full'
                ref={imgElement}
                onLoad={() => setImgH(imgElement.current.height)}
               />
                 <div className='flex flex-col absolute rounded-lg w-full gap-5  justify-center items-center top-0 left-0 bottom-0 right-0 bg-quotes'>
                      
                        <h1 className={`text-gray-100 uppercase mt-20  text-center text-bold ${textstyle} items-center z-10`}>{details.quote}</h1>
                        <div className='opacity-70 bottom-0 flex flex-col justify-center items-center'>
                        <img src={logo} alt="" width='60px' />
                        <small className='text-white text-xs  pb-3 '>QuoteHut</small>
                        </div>
                  
                </div>
               
            </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center  gap-2 mb-5'>
            <div
           download
           onClick={() => onButtonClick()}
           className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-80 hover:opacity-100  hover:shadow-md outline-none  "
           >
             <HiDocumentDownload className='h-6 w-6' color='teal' />
           </div>
         
    {details?.postedBy?._id === user._id &&
 <button onClick={e => { e.stopPropagation()
  showPinModal(true)}} className='flex items-center justify-center bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-9 h-9  text-base hover:shadow-md outlined-none'>
<AiFillDelete className='h-6 w-6' />
    </button>

 } 
        {alreadySaved? 
                         <div className='flex  justify-center gap-1 items-center'>
                         <div className='text-gray-700 text-sm'>{details?.save?.length}</div>
                          <BsFillBookmarkDashFill onClick={e => unsavePin(e)}  className='cursor-pointer h-5 w-5 text-red-500'/>
          </div>
          :
                <div className='flex  justify-center gap-1 items-center'>
                <div className='text-gray-700 text-sm'>{details?.save?.length}</div>
                 <BsFillBookmarkPlusFill onClick={e => savePin(e)}  className='cursor-pointer h-5 w-5 text-orange-500'/>
 </div>
 }
       
        </div>
        <div>
                    <h1 className='text-2xl font-bold break-words mt-3 capitalize'>
                        {details.title}
                    </h1>
                    <hr class="my-3 w-64 h-1 bg-gray-100 rounded border-0 dark:bg-gray-700" />
                  
                    <p className='flex gap-2 mt-2 text-base'><AiFillTags  /> {details.category}</p>
                    <p className='flex gap-2 mt-2 text-xs'><FcInfo className='mt-1'  /> {details.about}</p>
                    <h1 className='text-lg md:text-4xl text-gray-600 break-words mt-3 capitalize'>
                        "{details.quote}"
                    </h1>

                </div>
  
                
                <Link 
        to={`profile/${details.postedBy._id}`}
        className='flex gap-2 mt-4 items-center'
         >
            <img src={details.postedBy.image} 
            className='w-6 h-6 rounded-full object-contain' alt=""/>
            <p className='font semibold capitalize text-sm'>{details.postedBy?.userName}</p>
         </Link>

         <hr class="my-3 w-full h-1 bg-gray-100 rounded border-0 dark:bg-gray-700" />
         <h2 className='mt-9 text-base  text-gray-700'>Comments</h2>
         <div className='max-h-370 overflow-y-auto'>
            {details.comments?.map((comment, i) => (
                <div className='flex justify-between'>
                <div className='flex gap-2 mt-5  bg-white rounded-lg' key={i}>
                    <img src={comment.postedBy.image} alt="" className='h-7 w-7 rounded-full cursor-pointer'/>
                    <div className='flex flex-col'>
                        <p className='font-bold text-gray-600'>{comment.postedBy.userName}</p>
                        <p className='text-sm md:text-base text-gray-600'>{comment.comment}</p>
                        <hr class="my-3 w-full h-1 bg-gray-100 rounded border-0 dark:bg-gray-700" />
                </div>       
                </div>
                
                             {comment?.postedBy?._id === user._id &&
                                <div onClick={e => {
                                    setCid(comment._key)
                                    showCommentModal(true)
                                    }} className='flex flex-shrink-0 items-center justify-center bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-9 h-9  text-base hover:shadow-md outlined-none'>
                               <AiFillDelete />
                                   </div>
                                } 
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
         <div className='flex justify-center items-center ml-auto'>
           <button 
                            onClick={addComment}
                            type='button'
                            className='bg-blue-500 hover:bg-blue-600 h-7  text-white outline-none rounded-lg w-20 '
                            >{loading? '....' : 'Publish' }</button></div>
 </div>
</div>
        </div>
        <hr class="my-10 w-full h-1 bg-gray-100 rounded border-0 dark:bg-gray-500" />
    {
        similarpins?.length > 0 && (
            <>
        <h2 className='font-bold text-xl text-gray-700 mt-2'>Similar Quotes</h2>
        <MasonryGrid pins={similarpins} />
        </>
        )
    }
    
     </div>
    </>
    );
};

export default PinDetail;