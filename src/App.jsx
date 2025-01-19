import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideBtn, Header } from "./pages/header.jsx";
import { Login, Signup} from "./pages/login.jsx";
import MyProfile from "./pages/profile.jsx";
import { UploadCards} from "./pages/upload.jsx";
import Notification from "./pages/notify.jsx";
import Detail from "./pages/detail.jsx";

function App() {
    return (
        <Router> 
            <div>
                <Routes>
                  {/* Home route */}
                  <Route path="/" element={<><Header/> <SideBtn/></>} />

                  {/* Protected routes */}
                  <Route path="/upload" element={<><Header/> <UploadCards/> <SideBtn/></>} />
                  <Route path="/profile" element={<><Header/> <MyProfile/> <SideBtn/></>} />
                  <Route path="/notify" element={<><Header/> <Notification/> <SideBtn/></>} />
                  <Route path="/details" element={<><Header/> <Detail/> <SideBtn/></>} />
                  <Route path="/search" element={<><Header/> <SideBtn/></>} />
                  <Route path="/:id" element={<><Header/> <MyProfile/> <SideBtn/></>} />  {/* will work for any user id */}

                  {/* Auth routes */}
                  <Route path="/login" element={<><Header/> <Login/> <SideBtn/></>} />
                  <Route path="/signup" element={<><Header/> <Signup/> <SideBtn/></>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
