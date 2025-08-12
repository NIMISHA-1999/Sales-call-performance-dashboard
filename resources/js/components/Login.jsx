// import React from "react";
// import "./login.css"; // We'll style separately

// export default function Login() {
//     return (
//         <div className="login-container">
//             <div className="login-left">
//                 <img
//                     src="/images/call-center.png"
//                     alt="Call Center"
//                     className="login-image"
//                 />
//             </div>
//             <div className="login-right">
//                 <div className="logo">
//                     <img src="/images/scalex-logo.png" alt="Scalex Logo" />
//                     <h2 className="login-text">Login</h2>
//                 </div>
//                 <form>
//                     <label className="label-text">User Name</label>
//                     <input type="text" placeholder="Enter User Name" />

//                     <label className="label-text">Password</label>
//                     <input type="password" placeholder="Enter Password" />

//                     <div className="remember">
//                         <input type="checkbox" id="remember" />
//                         <label className="remember-text" htmlFor="remember">Remember</label>
//                         <a href="#">Forgot Password?</a>
//                     </div>

//                     <button type="submit">Login</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

import React, { useState } from "react";
import "./login.css";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const getCsrfToken = async () => {
    const res = await fetch("http://127.0.0.1:8000/csrf-token");
    const data = await res.json();
    return data.csrf_token;
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await getCsrfToken();

            const res = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": token
    },
    body: JSON.stringify({ username, password })
})


            const data = await res.json();
            setMessage(data.message);

            if (res.ok) {
                // Redirect to dashboard (for example)
                console.log("Redirecting to dashboard...");
                 window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img
                    src="/images/call-center.png"
                    alt="Call Center"
                    className="login-image"
                />
            </div>
            <div className="login-right">
                <div className="logo">
                    <img src="/images/scalex-logo.png" alt="Scalex Logo" />
                    <h2 className="login-text">Login</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <label className="label-text">User Name</label>
                    <input
                        type="text"
                        placeholder="Enter User Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label className="label-text">Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="remember">
                        <input type="checkbox" id="remember" />
                        <label className="remember-text" htmlFor="remember">Remember</label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
