import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/SignupPage";
import HomePage from "./home/HomePage";
import LoginPage from "./pages/auth/LoginPage";

function App() {

  return (
    <div className='flex max-w-6xl mx-auto'data-theme="black" >
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
