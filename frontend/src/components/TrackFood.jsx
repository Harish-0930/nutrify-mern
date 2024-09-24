import React, { useContext, useState } from 'react';
import { UserContext } from './contexts/UserContext';
import Food from './Food';
import Header from './Header';

function TrackFood() {

  const loggedData=useContext(UserContext);

  const [foodItems,setFoodItems]=useState([]);

  const [food,setFood]=useState(null)
  console.log("selected food item",food)

  function searchFood(event){
    console.log(event.target.value)

    if(event.target.value!=="" && event.target.value.trim()!=="" && event.target.value.length>0)
    {

      fetch(`http://localhost:8000/foods/${event.target.value}`,{
        method:"GET",
        headers:{
          "Authorization":"Bearer "+loggedData.loggedUser.token
        }
      })
      .then((response)=>response.json())
      .then((data)=>{
        //console.log(data)
        if(data.message===undefined){
          setFoodItems(data);
        }
      })
      .catch((err)=>console.log(err))
    }else{
      setFoodItems([])
    }
}

  return (
    <>
      <section className='container track-container'>
        <Header/>
        <div className='search'>
          <input type="search" placeholder='Search Food Item'
          className='search-inp' onChange={searchFood}/>

          {
            food===null?<h1>Search and Add food item</h1>:null
          }
              <div className='search-results'>
                {
                  foodItems.map((item)=>{
                    return(
                      <p className='item' key={item._id} onClick={()=>{
                        setFood(item)
                      }}>{item.name}</p>
                    )
                  })
                }
              </div>
          </div>
        {
          food!==null?<Food food={food}/>:null
        }
      </section>
    </>
  )
}

export default TrackFood