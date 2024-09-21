import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function Register() {
    const navigate=useNavigate()
    const [userDetails,setUserDetails]=useState({
        name:'',
        email:'',
        password:'',
        age:''
    })
    const [message,setMessage]=useState({
        type:"invisible",
        text:""
    })
    function handleInput(event){
        
        setUserDetails((prevState)=>{
            return {...prevState,[event.target.name]:event.target.value}
        })
    }
    function handleSubmit(event){
        event.preventDefault()
        console.log(userDetails)
        fetch("http://localhost:8000/register",{
            method:"POST",
            body:JSON.stringify(userDetails),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((response)=>{return response.json()})
        .then((data)=>{
            setMessage({type:"success",text:data.message})
            setUserDetails({
                name:'',
                email:'',
                password:'',
                age:''
            })
            navigate('/login');
        })
        .catch((err)=>{console.log(err)})

        setTimeout(()=>{
            setMessage({type:"invisible",text:""})
        },2000)
        

    }
  return (
    <section className='container user'>
        <form className='form' onSubmit={handleSubmit}>
            <h1>Start Your Fitness</h1>

            <input className='inp'type="text"
            placeholder='Enter Name' name="name"
            autoComplete='off' required onChange={handleInput} value={userDetails.name}/>

            <input className='inp'type="email"
            placeholder='Enter Email' name="email"
            autoComplete='off' required onChange={handleInput} value={userDetails.email}/>

            <input className='inp'type="password"
            placeholder='Enter Password' name="password"
            onChange={handleInput} required maxLength={8} value={userDetails.password}/>

            <input className='inp'type="number"
            placeholder='Enter Age' name="age"
            autoComplete='off' required max={100} min={12} onChange={handleInput} value={userDetails.age}/>

            <button className="btn">Join</button>

            <p>Already Registered? <Link to="/login" >Login</Link></p>

            <p className={message.type}>{message.text}</p>
        </form>
    </section>
)
}
