import { BrowserRouter, Route, Routes, Navigate, Outlet} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import DataProvider from "./context/DataProvider.js";
import { useState } from "react";


const PrivateRoute = ({isAuth, setAuth}) => {
  console.log(isAuth)
  return isAuth ? <>
    <Sidebar setAuth={setAuth}/>
    <Outlet />
    <RightPanel />
  </>
  :
  <Navigate replace to="/login" />
}

function App() {
  const [isAuth, setAuth] = useState(false)

  return (
    <DataProvider>
      <BrowserRouter>
        <div className="flex max-w-6xl mx-auto">
          <Routes>
            <Route path="/signup" element={<SignUpPage setAuth={setAuth}/>} />
            <Route path="/login" element={<LoginPage setAuth={setAuth}/>} />
            <Route path="/" element= {<PrivateRoute isAuth={isAuth}/>}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route  path="/notifications" element= {<PrivateRoute isAuth={isAuth} setAuth={setAuth}/>}>
              <Route  path="/notifications" element={<NotificationPage />} />
            </Route>
            <Route path="/profile/:username" element= {<PrivateRoute isAuth={isAuth} setAuth={setAuth}/>}>
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Route>
            
          </Routes>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
