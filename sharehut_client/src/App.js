import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path:"/",
    element:( <div className='text-3xl font-bold underline'>
    Hello world!
  </div>)
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
