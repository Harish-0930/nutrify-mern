import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { UserContext } from "./components/contexts/UserContext";
import Diet from "./components/Diet";
import Header from "./components/Header";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Private from "./components/Private";
import Register from "./components/Register";
import TrackFood from "./components/TrackFood";
function App() {

  const [loggedUser,setLoggedUser]=useState(JSON.parse(localStorage.getItem('nutrify-user')));
  useEffect(()=>{
    console.log(loggedUser)

  })
  return (
    <>
      <UserContext.Provider value={{loggedUser,setLoggedUser}}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/header' element={<Private Component={Header}/>}/>
            <Route path='/track' element={<Private Component={TrackFood}/>}/>
            <Route path='/diet' element={<Private Component={Diet}/>}/>
            <Route path='/*' element={<NotFound/>}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
