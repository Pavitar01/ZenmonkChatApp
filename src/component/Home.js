import React, { useEffect, useState } from "react";
import "../css/chat.css";
import logo from "../assets/images/logo.png";
import User from "./User";
import Details from "./Details";
import InputEmoji from "react-input-emoji";
import Message from "./Message";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore"; // Firestore
import { app } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import ConvoButton from "./ConvoButton";
import DelCard from "./DelCard";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth();
const Home = () => {
  const [toggle, setToggle] = useState(false);
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [startConvo, setStartConvo] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [del, setDel] = useState(false);

  const user = useSelector((state) => state.userData.user);
  const roomId = useSelector((state) => state.userData.roomId);

  const db = getFirestore(app);

  const chatQuery = query(collection(db, "Chat"), orderBy("createdAt", "asc"));
  const typingIndicatorRef = collection(db, "Chats");
  const typingQuery = query(typingIndicatorRef, where("roomId", "==", roomId));

  const handleOnEnter = async (text) => {
    try {
      await addDoc(collection(db, "Chat"), {
        roomId: roomId,
        senderId: user?.uid,
        message: text,
        isTyping: false,
        createdAt: serverTimestamp(),
      });
      stopTyping(); // Stop typing after sending a message
    } catch (err) {
      console.error("Error adding chat:", err);
    }
  };

  const handleOnChange = (text) => {
    setText(text);
    if (text.trim() !== "") {
      startTyping();
    } else {
      stopTyping();
    }
  };

  useEffect(() => {
    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredData = data.filter((item) => item.roomId === roomId);
      setChats(filteredData);
      const filteredChats = filteredData.filter((item) =>
        item.message.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredChats(filteredChats);
    });

    const unsubscribeTyping = onSnapshot(typingQuery, (snapshot) => {
      const typingStatus = snapshot.docs.some((doc) => doc.data().isTyping);
      setIsTyping(typingStatus);
    });

    return () => {
      unsubscribeChat();
      unsubscribeTyping();
    };
  }, [roomId, searchText]);

  const startTyping = async () => {
    const q1 = query(collection(db, "Chats"), where("userId", "==", user?.uid));
    const querysnap = await getDocs(q1);

    if (querysnap.empty) {
      await addDoc(collection(db, "Chats"), {
        isTyping: true,
        roomId: roomId,
        userId: user?.uid,
      });
    }
  };
  const stopTyping = async () => {
    try {
      const typingDocQuery = query(
        typingIndicatorRef,
        where("roomId", "==", roomId),
        where("userId", "==", user.uid)
      );
      const typingDocSnapshot = await getDocs(typingDocQuery);
      if (!typingDocSnapshot.empty) {
        const typingDocRef = typingDocSnapshot.docs[0].ref;
        await updateDoc(typingDocRef, { isTyping: false });
      }
    } catch (err) {
      console.error("Error stopping typing:", err);
    }
  };

  const handleSearch = () => {
    const filteredChats = chats.filter((item) =>
      item.message.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredChats(filteredChats);
  };

  const submit = async () => {
    try {
      await addDoc(collection(db, "Chat"), {
        roomId: roomId,
        senderId: user.uid,
        message: text,
        isTyping: false,
        url: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setText(""); // Clear the input field after sending a message
      stopTyping(); // Stop typing after sending a message
    } catch (err) {
      console.error("Error adding chat:", err);
    }
  };

  return (
    <div className="chatMain">
      <div className="Main">
        <div className="left">
          <div className="logo">
            <button className="button">
              <i
                className="fa-solid fa-chevron-left"
                onClick={() => signOut(auth)}
              ></i>
            </button>
            <img src={logo} className="logoIcon" alt="Logo" />

            <button className="button">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
          <div className="users">
            <User />
          </div>
        </div>
        <div className="right">
          <div className="top" style={{ position: "relative" }}>
            <button>
              <i
                className="fa-regular fa-envelope"
                onClick={() => {
                  del ? setDel(false) : setDel(true);
                }}
              ></i>

              {del && <DelCard />}
            </button>
            <div className="input">
              <input
                type="text"
                className="search"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <i
                className="fa-solid fa-magnifying-glass"
                onClick={handleSearch}
                style={{ color: "white", cursor: "pointer" }}
              ></i>
            </div>
            <button onClick={() => setToggle(!toggle)}>
              <i className="fa-solid fa-user"></i>
            </button>
            {toggle ? <Details /> : null}
          </div>
          <div className="messages">
            {startConvo ? (
              filteredChats.map((item) => (
                <Message
                  key={item?.id}
                  message={item?.message}
                  url={item?.url}
                  user={item?.senderId === user?.uid ? "me" : "other"}
                  time={item?.createdAt}
                />
              ))
            ) : (
              <ConvoButton
                setStartConvo={setStartConvo}
                startConvo={startConvo}
              />
            )}
          </div>
          <div className="messageField">
            <div className="bg">
              <InputEmoji
                className="inputBox"
                value={text}
                onChange={handleOnChange}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
              />
            </div>
            <button
              className="button"
              onClick={submit}
              disabled={!startConvo}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
