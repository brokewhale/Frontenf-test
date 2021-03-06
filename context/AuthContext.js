import { createContext, useEffect, useState } from "react";
import { NEXT_URL } from "../config/index";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => checkUserLoggedIn(), []);

  // Login User
  const login = async ({ email: identifier, password }) => {
    console.log("i am in");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await res.json();

    console.log(data);
    if (res.ok) {
      setUser(data.user);
      router.push("/dashboard");
    } else {
      setError(data.message);
      setError(null);
    }
  };

  // Logout User
  //   const logout = async () => {
  //     const res = await fetch(`${NEXT_URL}/api/logout`, {
  //       method: "POST",
  //     });

  //     if (res.ok) {
  //       setUser(null);
  //       router.push("/");
  //     }
  //   };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`);

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, login, checkUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
