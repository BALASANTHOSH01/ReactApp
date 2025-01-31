import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './page/Home/Home.jsx'
import About from './page/About/About.jsx'
import Admin from './page/Admin/Admin.jsx'
import Navbar from './components/Layout/Navbar.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
  },
  {
    path:"/about",
    element:<About/>
  },
  {
    path:"/admin",
    element:<Admin/>
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
