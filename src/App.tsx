import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; 
import Profile from "./pages/Profile";
import Signup from "./pages/SignUp";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} /> 
      <Route path="/profile" element={<Profile />} /> 
      <Route path = "/signup" element = {<Signup />} />
    </Routes>
  );
};

export default App;
