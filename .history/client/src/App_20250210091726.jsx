import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/SignupPage";
import HomePage from "./pages/auth/HomePage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  const theme = useSelector((state) => state.theme.theme); 

  return (
    <div className='flex max-w-6xl mx-auto' >
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
