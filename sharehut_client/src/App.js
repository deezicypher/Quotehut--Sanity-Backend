import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./pages/Home.js";
import PinDetail from "./pages/PinDetail";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import CreatePin from "./pages/createPin";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children: [
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/create",
        element: <CreatePin/>
      },
      {
        path:"/profile/:id",
        element: <Profile/>
      },
      {
        path:"/search",
        element: <Search/>
      },
      
      {
        path:"/categories/:id",
        element: <Feed/>
      },
      {
        path:"/Pin/:id",
        element: <PinDetail/>
      }
    ]},  {
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
