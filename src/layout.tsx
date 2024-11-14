import { Outlet } from "react-router-dom"
import Header from "./components/header"

const Layout = () => {
   return (
      <div className="h-[100vh] w-[100vw] flex flex-col m-0">
         <Header />
         <div className="flex-grow bg-[#0B0B0B]">
            <Outlet />
         </div>
      </div>
   )
}

export default Layout
