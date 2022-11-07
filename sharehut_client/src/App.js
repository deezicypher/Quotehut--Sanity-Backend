import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home.js";
import Pins from "./pages/Pins";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path:"/",
    element: <Home/>
  },
  {
    path:"/profile/:id",
    element: <Profile/>
  },
  ,
  {
    path:"/categories/:id",
    element: <Pins/>
  },
  {
    path:"/Login",
    element: <Login/>
  }
]) 

function App() {
  return (
   <RouterProvider router={router} />
  );
}

export default App;
