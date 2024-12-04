import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext, useEffect } from "react";
import { getUserDetails } from "./context/Users/User";
import { UserContext } from "./context/context";
import ProtectedRoutes from "./utils/routes/ProtectedRoutes";
import AlreadySignIn from "./utils/routes/AlreadySignIn";
import { getUserChats } from "./context/Chats/Chats";
import { UserChatContext } from "./context/chatContext";

function App() {
  const { loading, setUser, user, setIsAuthen, setLoading, setError } =
    useContext(UserContext);
  const { chats, setChats, setLoadingChats, setErrorChats } =
    useContext(UserChatContext);
  useEffect(() => {
    const checkCookiesAndDispatch = () => {
      getUserDetails(setIsAuthen, setUser, setLoading, setError);
      getUserChats(setChats, setLoadingChats, setErrorChats);
      setLoading(false);
    };
    checkCookiesAndDispatch();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={
            <AlreadySignIn>
              <RegisterPage />
            </AlreadySignIn>
          }
        />
        <Route
          path="*"
          element={
            <>
              <div>Error No Page</div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
