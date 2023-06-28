import React, { useEffect, useState } from "react";
import Feild from "./Feild";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { SetRoom } from "../Redux/Slice/UserSlice";

const User = () => {
  const currentUser = useSelector((state) => state.userData.user);
  const db = getFirestore(app);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);
  const [user, setUser] = useState([]);
  const roomId = useSelector((state) => state.userData.roomId);
  const q = query(collection(db, "User"), orderBy("createdAt", "asc"));

  useEffect(() => {
    const sub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      sub();
    };
  }, []);

  const chatQuery = query(collection(db, "Chats"), orderBy("createdAt", "asc"));

  useEffect(() => {
    const s = onSnapshot(chatQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredData = data.filter((item) => item.roomId === roomId);
      setUser(filteredData);
    });

    return () => {
      s();
    };
  });

  const handleUserClick = (index, userId) => {
    setActiveIndex(index);
    const roomId = generateRoomId(currentUser?.uid, userId);
    dispatch(SetRoom({ sid: currentUser?.uid, rid: userId, roomId }));
  };

  const generateRoomId = (uid1, uid2) => {
    const sortedUids = [uid1, uid2].sort();
    return sortedUids.join("_");
  };

  const isUserTyping = (userId) => {
    const typingUser = user.find((item) => item.userId === userId);
    return typingUser ? typingUser.isTyping : false;
  };

  return (
    <div className="mainfeild">
      {users?.map((user, index) => {
        if (user?.uid !== currentUser?.uid) {
          const isActive = index === activeIndex;
          const typing = isUserTyping(user.uid);
          return (
            <div
              key={user?.id}
              onClick={() => handleUserClick(index, user.uid)}
              style={{ cursor: "pointer" }}
            >
              <Feild
                color={isActive ? "#f23f79" : ""}
                width={isActive ? "800px" : ""}
                padding={isActive ? "10px" : ""}
                name={user?.name}
                url={user?.url}
                time={user?.flag ? "🟢" : "🔴"}
                text={"hello"}
                Typing={typing} // Pass the typing status to the Feild component
              />
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default User;
