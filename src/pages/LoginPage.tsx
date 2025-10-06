import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import userData from "../data/users.json";


const Header = () => {
    return (
        <header className="flex items-center justify-center h-20 p-4 bg-[#282828] w-full text-white">
            <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">5G Def-i</span>
            </div>
        </header>
    );
};

const Login = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const navigate = useNavigate();



    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((userData.users.filter((users) => users.email === loginEmail && users.Password === loginPassword))) {
            navigate("/dashboard");
        } else {
            alert("Invalid email or password.");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="flex shadow-5xl">
                <form onSubmit={(e) => handleLogin(e)} className="flex flex-col item-center justify-center text-center p-20 gap-8 bg-[#343536] rounded 5xl">

                    <h1 className="text-2xl font-sans font-bold ">LOGIN</h1>

                    <div className="flex flex-col text-2x1 text-left gap-1">

                        <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="px-4 py-2 rounded-md p-1  outline-none bg-[#282828] placeholder-gray-400" placeholder="Email Address"></input>

                    </div>

                    <div className="flex flex-col text-2x1 text-left gap-1">

                        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="px-4 py-2  rounded-md p-1 outline-none bg-[#282828] placeholder-gray-400" placeholder="Password"></input>

                        <div className="flex gap-6 item-center">
                            <div className="flex items-center">
                                <input type="checkbox" className="bg-[#282828]"></input>
                                <span className="text-xs ml-1">Remember Password</span>
                            </div>
                            <span className="text-xs"><a href="#" className="text-blue-400 hover:underline">Forgot password?</a></span>
                        </div>
                    </div>
                    <button type="submit" className="px-10 py-2 text 2xl rounded-md bg-[#3b82f6]">login</button>
                    <p>Don't have an account? <Link to="/register" className="text-blue-400 hover:underline ">Register</Link></p>
                </form>
            </div>
        </section>
    )
}

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-[#282828] text-white  ">
            <Header />
            <Login />
        </div>
    );
};

export default LoginPage;