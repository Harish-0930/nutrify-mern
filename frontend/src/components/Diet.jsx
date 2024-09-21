import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import Header from "./Header";
export default function Diet(){
    const loggedData=useContext(UserContext)

    const tokenRef = useRef(loggedData.loggedUser.token);
    const userIdRef = useRef(loggedData.loggedUser.userid);


    const [items,setItems]=useState([])
    const [date,setDate]=useState(new Date())

    let [total,setTotal] = useState({
        totalCalories:0,
        totalProtein:0,
        totalCarbs:0,
        totalFats:0,
        totalFiber:0
    })
    useEffect(()=>{

        const token = tokenRef.current;
        const userId = userIdRef.current;
        fetch(`http://localhost:8000/track/${userId}/${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`,{
            method:"GET",
            header:{
                "Authorization":`Bearer ${token}`
            }
        })
        .then((response)=>response.json())
        .then((data)=>{
            setItems(data)
            console.log(items)
        })
        .catch((error)=>console.log(error))
    },[date])

    useEffect(() => {
        function calculateTotal(){
            let totalCopy = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0,
                totalFiber: 0
            };
            items.forEach((item) => {
                totalCopy.totalCalories += item.details.calories;
                totalCopy.totalProtein += item.details.protein;
                totalCopy.totalCarbs += item.details.carbohydrates;
                totalCopy.totalFiber += item.details.fiber;
                totalCopy.totalFats += item.details.fat;
            });
            setTotal(totalCopy);
        }
        
        calculateTotal();
    }, [items]);
    

    return (
        
        <section className="container diet_container">
            <Header/>
            <input type="date" onChange={(event)=>{
                setDate(new Date(event.target.value))
            }}/>
            {
                items.length!==0?(
                    items.map((item)=>
                        {
                            return (
                                <div className="item_diet" key={item._id}>
                                    <h3>{item.foodId.name} ({item.details.calories}Kcal for {item.quantity}Gms) </h3>
                                    <p>Protien: {item.details.protein}g</p>
                                    <p>Carbs: {item.details.carbohydrates}</p>
                                    <p>Fiber: {item.details.fiber}</p>
                                    <p>Fat: {item.details.fat}</p>
                                </div>
                            )
                        })
                ):<h2>No Food Eaten</h2>
            }
            {items.length!==0?<h1>Total Nutrition</h1>:null}
            {

                items.length!==0?(
                    <div className="item_diet">
                        
                        <h3>{total.totalCalories}Kcal</h3>
                        <p>Protien: {total.totalProtein}g</p>
                        <p>Carbs: {total.totalCarbs}g</p>
                        <p>Fiber: {total.totalFiber}g</p>
                        <p>Fat: {total.totalFats}g</p>
                    </div>
                ):<p >No Diet Found</p>
            }
        </section>


    )
}