import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import Login from "./pages/auth/login/login"
import Register from "./pages/auth/register/register"
import Home from "./pages/landing/home/home"
import RutaGeneral from "./layout/RutaGeneral"
import AuthLayout from "./layout/AuthLayout"
import NotFound from "./pages/not-found/not-found"
import Team from "./pages/landing/team/team"
import Packages from "./pages/landing/packages/packages"
import Courses from "./pages/landing/courses/courses"
import Contact from "./pages/landing/contact/contact"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<RutaGeneral />}>
          <Route index element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
