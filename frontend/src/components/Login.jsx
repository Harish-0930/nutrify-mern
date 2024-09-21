import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
export default function Login() {


    const loggedData=useContext(UserContext)

   // console.log(loggedInData)
    const [userCred,setUserCred]=useState({
        email:'',
        password:''
    })

    const [message,setMessage]=useState({
        type:'',
        text:''
    })

    const navigate=useNavigate()
    function handleChange(event){
        setUserCred((prev)=>{
            return {...prev,[event.target.name]:event.target.value}
        })

    }
    async function handleSubmit(event){
        event.preventDefault()
        console.log(userCred)
        await fetch("https://nutrify-backend-ma47.onrender.com/login",{
            method:"POST",
            body:JSON.stringify(userCred),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((response)=>{
            
            if(response.status===404){
                setMessage({type:"error",text:"Username or Email Doesn't Exist"})
            }
            else if(response.status===401){
                setMessage({type:"error",text:"Incorrect Password"})
            }
            else if(response.status===200){

                return response.json()
            }
        })
        .then((data)=>{
            if(data.token!==undefined)
            {
                //setMessage({type:"Login Success",text:data.message})
                localStorage.setItem("nutrify-user",JSON.stringify(data))
                loggedData.setLoggedUser(data)
                
                navigate('/track')
            }
        })
        .catch((err)=>{console.log(err)})

        setTimeout(()=>{
            setMessage({type:"invisible",text:""})
        },2000)
    }
    return (
    <section className='container user'>
    <form className='form' onSubmit={handleSubmit}>
        <h1>Login To Fitness</h1>
        <input className='inp'type="email" placeholder='Enter Name' name="email" autoComplete='off' onChange={handleChange} value={userCred.email} required/>
        <input className='inp'type="password" placeholder='Enter Password' max={8} name="password" onChange={handleChange} value={userCred.password} required/>
        <button className="btn">Login</button>
        <p>Don't Have Account? <Link to="/" >Create a Account</Link></p>
        <p className={message.type}>{message.text}</p>
    </form>
</section>
  )
}
