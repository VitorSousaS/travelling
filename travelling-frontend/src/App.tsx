import { useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context";
import { themeAntDesign } from "./shared";
import Router from "./router";
import { Footer, Navbar } from "./components";

function App() {
  const location = useLocation();

  const ROUTES_IGNORE_LAYOUT = ["/login", "/register"];

  return (
    <AuthProvider>
      <ConfigProvider theme={themeAntDesign}>
        <div className="flex flex-col min-h-screen bg-auxiliary-beige">
          {!ROUTES_IGNORE_LAYOUT.includes(location.pathname) && <Navbar />}
          <Router />
          {!ROUTES_IGNORE_LAYOUT.includes(location.pathname) && <Footer />}
        </div>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
