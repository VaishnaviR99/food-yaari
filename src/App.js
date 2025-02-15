import { Navbar } from "./Components/Navbar";
import "./App.css";
import AllRoutes from "./Routes/AllRoutes";
import { useLocation } from "react-router-dom";
import { SideBar } from "./Components/SideBar";

function App() {
  const location = useLocation();

  // Routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/login", "/signup"]; 
  const showSidebarRoutes = ["/dashboard", "/dashboard/profile", "/dashboard/create", "/dashboard/myposts", "/dashboard/requests", "/dashboard/subscription"]; 

  return (
    <div id="App">
      
      {showSidebarRoutes.includes(location.pathname) ? (
        <SideBar />
      ) : (
        !noNavbarRoutes.includes(location.pathname) && <Navbar />
      )}
      <div id="main">
        <AllRoutes />
      </div>
    </div>
  );
}

export default App;
