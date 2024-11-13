import Header from "./components/header"
import Home from "./components/home"

const App = () => {
   return (
      <div className="h-[100vh] w-[100vw] flex flex-col m-0">
         <Header />
         <div className="flex-grow bg-[#0B0B0B]">
            <Home />
         </div>
      </div>
   )
}

export default App
