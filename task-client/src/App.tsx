import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />

          <Route
            path="/Home"
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/*" index element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
