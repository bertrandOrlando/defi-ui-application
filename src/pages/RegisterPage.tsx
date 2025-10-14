
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import userData from "../data/users.json";
//import fs from "../data/users.json";
//import { promises as fs } from 'fs';

import path from "path";



const RegisterPage = () => {
    const currentDate = new Date().toISOString();

    const newUserId = Date.now().toString();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });   
    const [database, setDatabase] = useState(userData);
    const navigate = useNavigate(); 
   
   
    const fs = require("fs");
    
     useEffect(() => {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify('../data.users.json'));
        }
    }, []);

    const  handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentDate = new Date().toISOString();
// const newUserId = Date.now().toString(); // Example unique ID
// const fullName = "John Doe";
// const email = "john@example.com";
// const password = "secret123";
// const [message, setMessage] = useState({ text: "", type: "" });
// const newUserId = Date.now().toString();
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
// const [message, setMessage] = useState({ text: "", type: "" });
            setMessage({ text: "", type: "" }); // Reset message on new submission

//cara keempat
setMessage({ text: "", type: "" });

    // --- Validation (remains the same) ---
    if (!fullName || !email || !password || !confirmPassword) {
        setMessage({ text: "Please fill in all fields.", type: "error" });
        return;
    }
    if (password !== confirmPassword) {
        setMessage({ text: "Passwords do not match.", type: "error" });
        return;
    }

    // --- Create the new user object ---
    const newUser = {
        userId: Date.now().toString(),
        name: fullName,
        email: email,
        password: password, // WARNING: Storing plain text passwords is very insecure!
        roleId: "3",
        updatedBy: "self_registered",
        lastSignIn: new Date().toISOString(),
        isDeleted: false
    };

try {
        const getUsers = () => {
    try {
        const usersJson = localStorage.getItem('users');
        // If no users exist yet, return an empty array
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("Error reading users from localStorage", error);
        return [];
    }
};

// This function simulates writing to a "database" (localStorage)
const saveUsers = (users) => {
    try {
        localStorage.setItem('users', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error saving users to localStorage", error);
    }
};

// This is the main function you'll import into your component
const registerUserInLocalStorage = (newUser) => {
    // 1. Get the current list of users
    const allUsers = getUsers();
    
    // 2. Check if the email already exists (optional but good practice)
    const userExists = allUsers.some(user => user.email === newUser.email);
    if (userExists) {
        // We throw an error so the component can catch it and show a message
        throw new Error("A user with this email already exists.");
    }
    
    // 3. Add the new user to the list
    allUsers.push(newUser);
    
    // 4. Save the updated list back to localStorage
    saveUsers(allUsers);
};
        // --- Handle success ---
        setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });
        setTimeout(() => {
            navigate("/login");
        }, 2000);

    } catch (error) {
        // Handle errors, like a duplicate email
        setMessage({ text: error.message, type: "error" });
    }


// //cara ketiga (kalo mau work harus pake backend api)
// // --- Validation ---
//         if (!fullName || !email || !password || !confirmPassword) {
//             setMessage({ text: "Please fill in all fields.", type: "error" });
//             return;
//         }

//         if (password !== confirmPassword) {
//             setMessage({ text: "Passwords do not match.", type: "error" });
//             return;
//         }

//         // --- Read existing data from localStorage (simulates reading a file) ---
//         //const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
//         fs.readFile('../data/users.json', function(err:any, data:any) {
//           const json = JSON.parse(data)
//           json.push({
//             userId: Date.now().toString(),
//             name: fullName,
//             email: email,
//             password: password,
//             roleId: "3",
//             updatedBy: "self_registered",
//             lastSignIn: new Date().toISOString(),
//             isDeleted: false
//           })
//           fs.writeFile("../data/users.json", JSON.stringify(json))
//         })
//         // Check if user with the same email already exists
//         // const userExists = storedUsers.some(user => user.email.toLowerCase() === email.toLowerCase());

//         // if (userExists) {
//         //     setMessage({ text: "An account with this email already exists.", type: "error" });
//         //     return;
//         // }

//         // --- Create new user object ---
//         // const newUser = {
//         //     userId: Date.now().toString(),
//         //     name: fullName,
//         //     email: email,
//         //     password: password, // In a real app, hash and salt the password.
//         //     roleId: "3",
//         //     updatedBy: "self_registered",
//         //     lastSignIn: new Date().toISOString(),
//         //     isDeleted: false,
//         // };

//         // --- Add new data to the array and save it back to localStorage (simulates writing to a file) ---
//         // const updatedUsers = [...storedUsers, newUser];
//         // localStorage.setItem('users', JSON.stringify(updatedUsers, null, 2));

//         //console.log("Updated user list in localStorage:", updatedUsers);

//         // --- Handle Success ---
//         setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });
//         setTimeout(() => {
//             navigate("/login");
//         }, 2000);
//       };
            
//cara kedua
// function registerUser(fullName, email, password) {
// const filePath = path.join('../data/users.json', "data", "users.json");
//  const newUser = {
//     userId: Date.now().toString(),
//     name: fullName,
//     email: email,
//     password: password,
//     roleid: "3",
//     updatedBy: "self_registered",
//     lastSignIn: new Date().toISOString(),
//     isDeleted: false,
//   };

//   fs.readFile(filePath, "utf8", (err: any, data: any) => {
//     if (err) {
//       console.error("❌ Read error:", err);
//       return;
//     }

//     let json;
//     try {
//       json = JSON.parse(data);
//     } catch (parseErr) {
//       console.error("❌ Invalid JSON format:", parseErr);
//       return;
//     }

//     // Ensure file contains array or object with myArr
//     if (Array.isArray(json)) {
//       // ✅ users.json is just an array
//       if (json.some(u => u.email === email)) {
//         console.log("⚠️ User with this email already exists.");
//         return;
//       }
//       json.push(newUser);
//     } else if (Array.isArray(json.myArr)) {
//       // ✅ users.json has structure { myArr: [ ... ] }
//       if (json.myArr.some(u => u.email === email)) {
//         console.log("⚠️ User with this email already exists.");
//         return;
//       }
//       json.myArr.push(newUser);
//     } else {
//       // Fallback
//       json = { myArr: [newUser] };
//     }

//     // Write updated data back
//     fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
//       if (err) {
//         console.error("❌ Write error:", err);
//       } else {
//         console.log("✅ User registered successfully!");
//       }
//     });
// });
// };
// registerUser(fullName, email, password);












 

  return (
            //header
            <div className="min-h-screen bg-[#282828] text-white">
                <header className="flex items-center justify-center h-20 p-4 bg-[#282828] w-full text-white fixed">
                    <div className="flex items-center space-x-2">
                    <span className="text-xl">
                        <span className="font-semibold">5G</span> Def-i
                    </span>
                    </div>
                </header>

        <section className="min-h-screen flex items-center justify-center">
            <div className="flex shadow-5xl">
                <form onSubmit={handleSubmit} className="flex flex-col item-center justify-center text-center p-20 gap-8 bg-[#343536] rounded 5xl">
                    <h1 className="text-2xl text 5xl font-sans font-bold">REGISTER</h1>
                    <div className="flex flex-col text-2x1 text-left gap-1">  

                     {message.text && (
                            <div className={`p-3 rounded-md text-center text-sm ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {message.text}
                            </div>
                        )}
                             
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="px-4 py-2 rounded-md p-1  outline-none bg-[#282828] placeholder-gray-400" placeholder="Fullname"></input>
                    </div>
                    <div className="flex flex-col text-2x1 text-left gap-1">                      
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 rounded-md p-1  outline-none bg-[#282828] placeholder-gray-400" placeholder="Email Adress"></input>
                    </div>
                    <div className="flex flex-col text-2x1 text-left gap-1">                       
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 rounded-md p-1  outline-none bg-[#282828] placeholder-gray-400" placeholder="Password"></input>
                    </div>
                    <div className="flex flex-col text-2x1 text-left gap-1">             
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="px-4 py-2 rounded-md p-1 outline-none bg-[#282828] placeholder-gray-400" placeholder="Confirm Password"></input>                  
                        <div className="flex gap-6 item-center">
                            <div className="flex items-center">
                                <input type="checkbox" id="rememberMe" className="bg-[#282828]"></input>
                                <span className="text-xs ml-1">Remember Password</span>
                            </div>
                            
                        </div>
                    </div>
                    <button type="submit" className="px-10 py-2 text 2xl rounded-md bg-[#3b82f6]">Register</button>
                    <p>Already have an account? <Link to="/login" className="text-blue-400 hover:underline ">Login</Link></p>


                </form>
            </div>
        </section>
        </div>
    );
   };  



    


export default RegisterPage;


//cara pertama
// fspromises.readFile('../data/users.json', 'utf8')
//   .then(data => {
//     let json;

//     // Try parsing JSON safely
//     try {
//       json = JSON.parse(data);
//     } catch (err) {
//       console.error("Invalid JSON format:", err);
//       return;
//     }

//     // Ensure myArr exists
//     if (!Array.isArray(json.myArr)) {
//       json.myArr = [];
//     }

//     // === VALIDATION SECTION ===
//     if (!newUserId || !fullName || !email || !password) {
//       console.log("Validation failed: All fields are required.");
//       return;
//     }

//     // Check for valid email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       console.log("Validation failed: Invalid email format.");
//       return;
//     }

//     // Check password length
//     // if (password.length < 6) {
//     //   console.log("Validation failed: Password must be at least 6 characters.");
//     //   return;
//     // }

//     // Check for duplicates
//     const userExists = json.myArr.some(
//       u=> u.email === email || u.userId === newUserId
//     );

//     if (userExists) {
//       console.log("Validation failed: User with same email or userId already exists.");
//       return;
//     }

//     // === ADD NEW USER ===
//     json.myArr.push({
//       userId: newUserId,
//       name: fullName,
//       email: email,
//       roleid: "3",
//       updatedBy: "self_registered",
//       lastSignIn: currentDate,
//       isDeleted: false,
//       password: password
//     });

//     // === WRITE BACK TO FILE ===
//     fspromises.writeFile('../data/users.json', JSON.stringify(json, null, 2))
//       .then(() => {
//         console.log("✅ User successfully added!");
//       })
//       .catch(err => {
//         console.error("Write Error:", err);
//         navigate("/login");
//       });
//   })
//   .catch(err => {
//     console.error("Read Error:", err);
//   });

//               setMessage({ text: "Registration successful!", type: "success" });
//             setFullName("");
//             setEmail("");
//             setPassword("");
//             setConfirmPassword("");