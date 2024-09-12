/* import logo from "./logo.svg"; */
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navbar";
import "./assests/scss/base.scss";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import MyBlogs from "./pages/MyBlogs";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/create" element={<CreatePost />} />
        <Route exact path="/Post/post/:id" element={<PostDetails />} />
        <Route exact path="/edit/:id" element={<EditPost />} />
        <Route exact path="/myblogs/:id" element={<MyBlogs />} />
        <Route exact path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
