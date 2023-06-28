import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";

import { async } from "react-input-emoji";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [err, setErr] = useState("");
 const auth =getAuth(app)
  const SignUp = async () => {
    if (email === "" || pass === "" || cpass === "") {
      setErr("Please Fill the Fld");
    } else if (pass !== cpass) {
      setErr("Both Pass Should Match");
    } else {
      try {
        const user = await createUserWithEmailAndPassword(auth,email,pass);
        console.log(user)
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
        <h1>Register Form</h1>
      </div>
      <div className="signup">
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
        <input
          type="password"
          placeholder="confirm password.."
          onChange={(e) => setCpass(e.target.value)}
        />
        <button onClick={() => SignUp()}>Signup</button>
      </div>
      <p>{err}</p>
    </div>
  );
};

export default Signup;
