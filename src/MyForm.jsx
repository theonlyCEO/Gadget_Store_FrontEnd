import React from "react";
import { useState } from "react";

function MyForm(){
  const[name,setName] = useState("")
  const [para,setPara] = useState("what your name")
  const handleSubmit=(e)=>{
    setName(e.target.value)
    // e.preventDefault()
  }
   function Welcome(){
    if(name == "wilfred"){
    setPara(`Welcome my NIGGA ${name}`)
    }else{
      return alert("youre not him")
  }
}
  return(
    <>
    <form action="">
      <h1>{para}</h1>
      <input type="text"
      value ={name}
      onChange={handleSubmit} />
    </form>
    <h1>{name}</h1>
    <button onClick={Welcome}> welcome</button>
    </>
  )
}

export default MyForm