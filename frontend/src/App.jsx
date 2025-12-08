import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import AboutPage from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = ()=> {
  return (
   <div className="min-h-screen w-screen bg-pink-100 overflow-x-hidden">
     <Navbar />
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     </Routes>
     <Footer />
    </div>
  )
}
export default App
