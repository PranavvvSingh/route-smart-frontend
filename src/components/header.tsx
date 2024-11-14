
const Header = () => {
   return (
      <div className="h-[70px] flex justify-between items-center text-white bg-[#100C08] px-10">
         <h1 className="text-2xl font-bold text-blue-500">RouteSmart 🛣️</h1>
         <nav className="flex gap-5 items-center justify-center">
            <p>Home</p>
            <p>Maps</p>
            <p>Sign In</p>
         </nav>
      </div>
   )
}

export default Header
