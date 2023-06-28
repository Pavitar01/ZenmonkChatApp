import React from "react";

const Feild = ({ time, url, name, text,isActive,color,transform,padding,Typing}) => {
  return (
    <div className="UserFeild" style={{backgroundColor:color,padding:padding,transform:transform,}}>
      <div className="image">
        <img src={url} />
      </div>
      <div className="middle">
        <div className="name">{name}</div>
        <div className="lastText">{Typing}</div>
      </div>
      <div className="time">{
        time==="Now" ?<span style={{backgroundColor:"white",width:"50px",color:"crimson",textAlign:"center"}}>{time}</span>:<span>{time}</span>
      }</div>
    </div>
  );
};

export default Feild;
