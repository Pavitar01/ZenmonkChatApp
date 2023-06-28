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
import { async } from "@firebase/util";
const Details = () => {
  const [val, setVal] = useState([]);
  const [img, setImg] = useState(
    "https://s3.amazonaws.com/thinkific-import/284749/3JzokDFKQ66wIF2stcSw_Alec_cuence_reviews_tiktok_workshops_png.png"
  );
  const db = getFirestore(app);
  const data = useSelector((state) => {
    return state.userData.user;
  });
  const q = query(collection(db, "User"), orderBy("createdAt", "asc"));

  useEffect(() => {
    const a = onSnapshot(q, (snapshot) => {
      const data1 = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredData = data1?.filter((item) => item?.uid === data?.uid);
      setVal([filteredData]);
    });

    return () => {
      a();
    };
  }, []);

  const auth = getAuth(app);
  const handleSignout = async () => {
    if (data && data?.uid) {
      try {
        signOut(auth);
        const ref = doc(db, "User", val[0][0]?.id);
        await updateDoc(ref, {
          flag: false,
        });
      } catch (error) {
        alert("Error updating field and signing out: ", error);
      }
    }
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