import React, { Component, useState } from "react";
import { render } from "react-dom"
import Homepage from "./Homepage"
import {axios} from "axios"
import LayoutComponent from "./Layout"
import { BrowserRouter } from "react-router-dom";
// import 'antd/dist/reset.css';
// import './App.css';

let data;
//
const sampleAPIcall = (event) => {
    console.log("ACTIVE")
    //@import 'antd/dist/antd.css';
    const requestOptions = {
        method: 'GET'
    }
    fetch("http://localhost:8000/account/bills", requestOptions)
    .then(response => response.json())
    .then(response =>{ console.log(response)
     data =Object.keys(response[0])
     console.log(`This is console.log.${data}`)
     console.log("updated")
    })
}

const App = () => {

     const [activeUser, setActiveUser] = useState("All Users")

    return ( 
        <BrowserRouter>
    <LayoutComponent activeUser={activeUser} setUser={setActiveUser}>        
   
    </LayoutComponent>
    </BrowserRouter>
    );
  }

  

export default App;

