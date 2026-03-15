import { useState } from "react";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-2xl w-96"
      >
        <h2 className="text-2xl mb-6">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 bg-[#1a1a1a]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 bg-[#1a1a1a]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#2ec4b6] py-2 rounded-lg text-black font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
