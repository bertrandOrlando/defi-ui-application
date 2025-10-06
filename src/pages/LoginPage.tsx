import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import usersData from "../data/users.json";

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = usersData.users.find(
      (user) => user.email === loginEmail && user.password === loginPassword
    );

    if (userData) {
      const data = {
        email: userData.email,
        name: userData.name,
        role: userData.roleId,
      };
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } else {
      alert("Invalid email or password.");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
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
          <form
            onSubmit={handleLogin}
            className="flex flex-col item-center justify-center text-center p-20 gap-6 bg-[#343536] rounded-lg"
          >
            <h1 className="text-2xl font-bold">LOGIN</h1>

            <div className="flex flex-col text-2x1 text-left gap-1">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="px-4 py-2 rounded-md p-1  outline-none bg-[#282828] placeholder-gray-400"
                placeholder="Email Address"
              ></input>
            </div>

            <div className="flex flex-col text-2x1 text-left gap-1">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="px-4 py-2  rounded-md p-1 outline-none bg-[#282828] placeholder-gray-400"
                placeholder="Password"
              ></input>
            </div>

            <div className="flex gap-6 items-center justify-between ">
              <div className="flex items-center gap-x-2">
                <input type="checkbox" className="bg-[#282828]"></input>
                <span className="text-sm">Remember me?</span>
              </div>
              <span className="text-sm">
                <a href="#" className="text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </span>
            </div>

            <button
              type="submit"
              className="px-10 py-2 text 2xl rounded-md bg-[#3b82f6]"
            >
              Login
            </button>

            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:underline ">
                Register
              </Link>{" "}
              here.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
