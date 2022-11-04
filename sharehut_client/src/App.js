import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path:"/",
    element:( <div className='text-3xl font-bold underline'>
    Hello world!
  </div>)
  }
]) 

function App() {
  return (
   <RouterProvider router={router} />
  );
}

export default App;
