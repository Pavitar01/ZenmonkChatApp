import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
const Details = () => {
  const [img, setImg] = useState(
    "https://s3.amazonaws.com/thinkific-import/284749/3JzokDFKQ66wIF2stcSw_Alec_cuence_reviews_tiktok_workshops_png.png"
  );
  const db = getFirestore(app);
  const data = useSelector((state) => {
    return state.userData.user;
  });

useEffect(()=>{})
  const auth = getAuth(app);
  const handleSignout = async () => {
    if (data && data?.uid) {
      try {

        const q = query(collection(db, "User"), where("uid", "==", data?.uid));
      
        const quersnap = await getDocs(q);
        let i = "";
        quersnap.forEach((doc) => (i = doc.id));

        const ref = doc(db, "User", i);
        await updateDoc(ref, {
          flag: false,
        });
      } catch (error) {
        alert("Error updating field and signing out: ", error);
      }
    }
        signOut(auth);
       
  };
  return (
    <div className="details">
      <div className="outerdiv">
        <div className="userDetails">
          <div className="img">
            {data?.photoUrl ? (
              <img src={img} alt="no image" />
            ) : (
              <img src={data?.photoURL} alt="no image" />
            )}
          </div>
          <h1>{data?.displayName}</h1>
          <p>{data?.email}</p>
        </div>
        <div className="logout">
          <i
            class="fa-solid fa-right-from-bracket"
            style={{
              fontSize: "40px",
              float: "right",
              color: "gray",
              cursor: "pointer",
            }}
            onClick={() => {
              handleSignout();
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Details;
