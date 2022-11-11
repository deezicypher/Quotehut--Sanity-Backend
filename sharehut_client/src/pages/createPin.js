import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import {BsUpload} from 'react-icons/bs';
import { client } from '../sanity';
import {AiFillDelete} from 'react-icons/ai';


const CreatePin = () => {
    const [inputs, setInputs] = useState({
        title: '',
        quote: '',
        about: '',
        category: '',
        image: '',

    })
    const {title,quote,about,category,image} = inputs;
    const [err, setErr] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }
  
   
    const user = useOutletContext();
    const categories = [
        { name:"Philosophy"},
        {name:'Life'},
        {name:"Self Development"},
        {name:"Coding"},
        {name:"Art"},
        {name:"Movies"},
        {name:"Others"},
    ]
    const uploadImage = (e) => {
        const {type, name} = e.target.files[0];
        if (type === 'image/png' || type === 'image/jpeg' || type === 'image/svg' || type === 'image/gif' || type==='image/tiff'){
            setLoading(true)
            client.assets.upload('image', e.target.files[0],{contentType:type, filename: name})
            .then(data => {
                
                setInputs(prev => ({...prev,image:data}))
                setLoading(false)
            }).catch(err => console.error(err))
        }else{
            setErr('Wrong image type')
        }
    }

    const handlePublish = () => {
        console.log(inputs)
        if(title && image.url && quote && about && category){
            setLoading(true)
            const doc = {
                _type:'pin',
                title,
                quote,
                about,
                category,
                image:{
                    _type:'image',
                    asset:{
                        _type:'reference',
                        _ref:image._id,
                    }
                },
                userId:user._id,
                postedBy:{
                    _type:'postedBy',
                    _ref:user._id,
                }
            }
            client.create(doc)
            .then(data => {
                navigate('/')
            })
        }else  {
        setLoading(false)
        setErr(true);
        window.scrollTo(0,0)
        setTimeout(()=> { 
            setErr(false)
        },5000)
    }
    }

    return (

       <div className='flex-1 px-2 md:px-5'>
            
        <div className='bg-gray-50'>
            <Header/>
        </div>
        <div className='flex flex-col justify-center items-center mt-5'>
            {err && (
                <p className='text-red-500 mb-5 text-sm transition-all duration-150 ease-in'>
                    Please Fill in all the fields below
                </p>
            )}
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-1 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
                        {loading?
                            <Spinner/>
                       :
                       <>
                     
                        {!image?
                        <label>
                            <div className='flex flex-col items-center justify-center h-full'>
                                <div className='flex flex-col justify-center items-center'>
                                    <p className="font-bold text-2xl">
                                        <BsUpload/>
                                    </p>
                                    <p className='text-lg'>Upload</p>
                                </div>
                                <p className='mt-20 text-gray-400'>
                                    Image should be less than 15mb
                                </p>
                            </div>
                            <input 
                                type="file"
                                name="upload"
                                onChange={uploadImage}
                                className="w-0 h-0"/>
                        </label> : 
                        <div className='relative h-full'>
                            <img src={image.url} alt="" className='h-full w-full' />
          
                            <button type='button' onClick={prev => setInputs({...prev,image:null})} className=' absolute flex items-center justify-center bottom-3 right-3  cursor-pointer bg-white opacity-70 hover:opacity-100 text-red-600 font-bold rounded-full w-8 h-8  text-xl hover:shadow-md outlined-none transition-all duration-500 ease-in-out'>
<AiFillDelete/>
    </button>
                        </div>
                        }</>}
                    </div>
                </div>
            </div>
            <div className='flex flex-1 flex-col gap-6 p-5 lg:w-4/5 lg:pl-5 mt-5  w-full'>
                <input 
                    type="text"
                    placeholder="Title"
                    name='title'
                    value={title}
                    onChange={handleChange}
                    className='outline-none text-2xl sm:text-3xl  border-b-2 border-gray-200 p-2'
                    />
                     <input 
                    type="textarea"
                    placeholder="Quote"
                    name='quote'
                    value={quote}
                    onChange={handleChange}
                    className='outline-none text-2xl sm:text-3xl  border-b-2 border-gray-200 p-2'
                    />
                    <input 
                    type="text"
                    placeholder="About"
                    name='about'
                    value={about}
                    onChange={handleChange}
                    className='outline-none text-2xl sm:text-3xl  border-b-2 border-gray-200 p-2'
                    />

                    <div className='flex flex-col'>
                        <div><p className='mb-2 font-semibold text-gray-700 text-lg sm:text-xl '>Choose Category</p></div>
                        <div className='flex flex-col'>
                            <select
                             name='category'
                             onChange={handleChange}
                             className='outline-none w-4/5 p-2 text-base text-gray-700 border-gray-200 border-b-2 rounded-md cursor-pointer'
                             >
                                <option value='other' name="category" className='bg-white'>Select Category</option>
                                {categories.map(category => (
                                    <option value={category.name} name="category"  className='text-base border-0 capitalize bg-white outline-none'>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex justify-end items-end mt-5'>
                            <button 
                            type='button'
                            onClick={handlePublish}
                            className='bg-blue-500 hover:bg-blue-600 text-white outline-none rounded-full w-28 p-2 font-bold'
                            >Publish</button>

                        </div>
                    </div>
            </div>
        </div>
        </div>
    )
};

export default CreatePin;