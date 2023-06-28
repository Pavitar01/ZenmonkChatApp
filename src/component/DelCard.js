import { writeBatch, deleteDoc, collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase/firebase";
const DelCard = () => {

  const roomId = useSelector((s) => {
    return s.userData.roomId;
  });

  const db = getFirestore(app);
const [alert,setAlert]=useState("")
  

  const delChat = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "Chat"), where("roomId", "==", roomId))
      );
  
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      setAlert("Chats deleted successfully!");
    } catch (err) {
      setAlert("Error deleting chats:", err);
    }
  };
      

  return (
    <div className="details" style={{ left: 0 }}>
      <div className="outerdiv">
        <div className="userDetails">
          <h1>Delete All Chats</h1>
          <h1
            style={{ color: "crimson", fontSize: "70px", cursor: "pointer" }}
            onClick={() => {
              delChat();
            }}
          >
            &#128465;
          </h1>
          <p style={{width:"100%",textAlign:"center",color:"green",fontSize:"25px"}}>{alert}</p>
        </div>
        {/* <i class="fa-solid fa-trash-can-list"></i> */}
      </div>
    </div>
  );
};

export default DelCard;
