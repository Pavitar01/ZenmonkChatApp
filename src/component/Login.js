import React, { useState } from "react";
import { app } from "../firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setError] = useState("");
  const auth = getAuth(app);

  const login = async () => {
    if (email === "" || pass === "") {
      setError("Please Fill the Fld");
    } else {
      try {
        const user = await signInWithEmailAndPassword(auth, email, pass);
        // console.log(user)
      } catch (err) {
        alert(err.message);
      }
    }
  };
  return (
    <div>
      <div className="logo">
        <img src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png" />
      </div>
      <div className="text">
        <h1>Member Login</h1>
      </div>
      <div className="input">
        <input
          type="text"
          placeholder="username.."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password.."
          onChange={(e) => setPass(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
      <p>{err}</p>
    </div>
  );
};

export default Login;
