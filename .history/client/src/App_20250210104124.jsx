import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/SignupPage";
import HomePage from "./home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";

function App() {

  return (
    <div className='flex max-w-6xl mx-auto'data-theme="black" >
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
      </Routes>
      <RightPanel />
    </div>
   
  );
}

export default App;
