import React,{useState,useCallback, useRef} from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {client, urlFor} from '../sanity'; 
import {FcDownload} from 'react-icons/fc';
import {v4 as uuidv4} from 'uuid';
import {AiFillDelete} from 'react-icons/ai';
import logo from '../assets/img/apelogo.png';
import {BsFillBookmarkPlusFill} from 'react-icons/bs';
import {BsFillBookmarkDashFill} from 'react-icons/bs';
import { toJpeg } from 'html-to-image';


const Pin = ({pin:{_id, image, postedBy,quote,title,save}}) => {
    const navigate = useNavigate();
    const [postHovered, setPostHovered] = useState(false);
    const {user} = useOutletContext();
    const ref = useRef()
    
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
    const unsavePin = e => {
        e.stopPropagation()
        if(alreadySaved){
        const pintoUnsave = ['save[0]',`save[userId=="${user._id}"]`]
           client
           .patch(_id)
           .unset(pintoUnsave)
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
        const onButtonClick = useCallback(() => {
            if (ref.current === null) {
              return
            }
        
            toJpeg(ref.current, { quality: 1.0 })
            .then((dataUrl) => {
              const link = document.createElement('a')
              link.download = `${title}.jpeg`
              link.href = dataUrl
              link.click()
            })
            .catch((err) => {
              console.log(err)
            })
          }, [ref])
  

        return (
    
    <div className='mt-2 p-2'>
        <div 
                ref={ref}
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out" >

<img src={urlFor(image).width(250).url()} className='rounded-lg w-full' alt=""/>
<div className='flex flex-col absolute rounded-lg w-full justify-center items-center top-0 left-0 bottom-0 right-0 bg-hQuotes'>
                       
                        <h1 className={` text-gray-100 uppercase py-5 px-3 mt-5 text-center text-bold ${quote.length <= 50 ? 'text-4xl' : 'text-xl'  } md:text-base items-center`}>{quote}</h1>
                       {/* <div className=' p-2 flex   flex-col  justify-center items-center'>
                        <img src={logo} alt="" width='20px' />
                        <small className='text-white text-xsm pb-3 '>QuoteHut</small>
        </div>*/}
              
                        <div className='absolute opacity-70 bottom-0 flex flex-col justify-center items-center'>
                        <img src={logo} alt="" width='20px' />
                        <small className='text-white text-xsm pb-3 '>QuoteHut</small>
                        </div>
                        </div>
                  
                      
   {postHovered && (
    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-0' style={{height:'100%'}} >
        <div className='flex items-center justify-between'>
        {/*  <div className='flex gap-2'>
                <div
              download
              onClick={e => onButtonClick(e)}
              className="bg-gray-100 w-9 h-9 cursor-pointer rounded-full flex items-center justify-center text-dark text-xl opacity-80 hover:opacity-100  hover:shadow-md outline-none  "
              >
                    <FcDownload/>
                </div>
   </div>
   */}
            <div className='flex ml-auto px-1'>
            {alreadySaved? 
                         <div className='flex  justify-center gap-1 items-center'>
                         <div className='text-white text-sm'>{save?.length}</div>
                          <BsFillBookmarkDashFill onClick={e => unsavePin(e)}  className='cursor-pointer h-5 w-5 text-red-500'/>
          </div>
          :
                <div className='flex  justify-center gap-1 items-center'>
                <div className='text-white text-sm'>{save?.length}</div>
                 <BsFillBookmarkPlusFill onClick={e => savePin(e)}  className='cursor-pointer h-5 w-5 text-orange-500'/>
 </div>
 }
 </div> 
            </div>
          {/*  <div className='flex justify-between items-end gap-2 w-full'>
    {postedBy?._id === user._id ?
 <button onClick={e => deletePin(e)} className='flex items-center justify-center bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-6 h-6  text-base hover:shadow-md outlined-none'>
<AiFillDelete/>
    </button>
:
<></>
 } 
</div>*/}
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