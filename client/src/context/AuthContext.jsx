import { createContext, useState, useEffect, Children } from "react";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  //retrieve user data from LocalStorage
  const storedUser = localStorage.getItem("user");
  let initialUser = null;
  //check  if user is Valid JSON
  if (storedUser && storedUser !== "undefined") {
    try {
      initialUser = JSON.parse(storedUser);
    } catch (error) {
      console.log("error parsing from local Storage", error);
      initialUser(null);
    }
  }
  const [currentUser, setCurrentUser] = useState(initialUser);
  const updateUser = (data) => {
    setCurrentUser(data);
  };
  useEffect(() => {
    if (currentUser === null) {
      localStorage.removeItem("user");
    } else {
      // store current user in localStorage
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
