import { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";



export default function Food(props)
{
    
    const [eatenQuantity,setEatenQuantity]=useState(100);
    const [food,setFood]=useState(props.food)
    const [foodInitial,setFoodInitial]=useState({})
    const [message,setMessage]=useState({
        type:'',
        text:''
    })
    let loggedData=useContext(UserContext)
    useEffect(()=>{
        setFood(props.food)
        setFoodInitial(props.food)
    },[props.food])

    
    function calculateMacros(event){
        if(event.target.value.length!==0){
            let quantity=Number(event.target.value)
            setEatenQuantity(quantity)
            let copyFood={...food};
            copyFood.protein=(foodInitial.protein*quantity)/100
            copyFood.carbohydrates=(foodInitial.carbohydrates*quantity)/100
            copyFood.fat=(foodInitial.fat*quantity)/100
            copyFood.fiber=(foodInitial.fiber*quantity)/100
            copyFood.calories=(foodInitial.calories*quantity)/100
            setFood(copyFood)
        }else{
            setFood(foodInitial)
            setEatenQuantity(100)
        }
    }

    function trackFood(){
        setMessage({type:"success",text:"Item added to diet"})
        setTimeout(() => {
            setMessage({ type: "invisible", text: "" });
        }, 2000);
        let trackedItem={
            userId:loggedData.loggedUser.userid,
            foodId:food._id,
            details:{
                protein:food.protein,
                carbohydrates:food.carbohydrates,
                fat:food.fat,
                fiber:food.fiber,
                calories:food.calories
            },
            quantity:eatenQuantity
        }

        console.log(trackedItem)
        fetch("http://localhost:8000/track",{
            method:"POST",
            
            body:JSON.stringify(trackedItem),
            headers:{
                "Authorization":`Bearer ${loggedData.loggedUser.token}`,
                "Content-type":"application/json"
            }
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data)
        })
        .catch(err=>{
            console.log(err)
        })

    }
    return(
        <div className='food'>
            <div className='food-img'>
                <img src={food.image} alt="item"/>
            </div>
            <h2 className='food-name'>{food.name} ({food.calories})Kcal for {eatenQuantity} Gms</h2>
                <div className='nutrient'>
                    <p className='n-title'>Protein</p>
                    <p className='n-value'>{food.protein}</p>
                </div>
                <div className='nutrient'>
                    <p className='n-title'>Carbs</p>
                    <p className='n-value'>{food.carbohydrates}</p>
                </div>
                <div className='nutrient'>
                    <p className='n-title'>Fat</p>
                    <p className='n-value'>{food.fat}</p>
                </div>
                <div className='nutrient'>
                    <p className='n-title'>Fiber</p>
                    <p className='n-value'>{food.fiber}</p>
                </div>
                <div className="track-control">
                    <input type="number" placeholder='Quantity in Gms' className='quantity' onChange={calculateMacros} required/>
                    <button className='btn track-btn' onClick={trackFood}>Track</button>


                
                </div>
                {
                    message.type==='success'?<p className={message.type}>{message.text} for {eatenQuantity}Gms</p>:null
                }
                
        </div>
    )
}