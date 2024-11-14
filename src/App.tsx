import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout"
import Home from "./components/home"
import TravelRoute from "./components/travelRoute"

const App = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<Home />} />
               <Route path="/travel" element={<TravelRoute />} />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export default App
