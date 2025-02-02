import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './page/Home/Home.jsx'
import MaterialsPage from './page/StudyMaterials/StudyMaterial.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
  },
  {
    path:"/materials",
    element:<MaterialsPage/>
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Navbar/> */}
    <RouterProvider router={router}/>
    {/* <Footer/> */}
  </StrictMode>,
)
