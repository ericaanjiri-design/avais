import React, { useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './Pages/Home'
import Collection from './Pages/Collection'
import CategoryCollection from './Pages/CategoryCollection'
import ProductDetails from './Pages/ProductDetails'
import Footer from './components/Footer'
import Testimonial from './Pages/Testimonial'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import MyOrders from './Pages/MyOrders'
import Placeorders from  './Pages/PlaceOrders'
import Login from './components/Login'
import { ShopContext } from './context/ShopContext'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/admin/Sidebar'
import AdminLogin from './components/admin/AdminLogin'
import ProductList from './Pages/admin/ProductList'
import AddProduct from './Pages/admin/AddProduct'
import AddedItems from './Pages/admin/AddedItems'
import Orders from './Pages/admin/Orders'

const App = () => {

  const {showUserLogin, isAdmin} = useContext(ShopContext)

  const location = useLocation()
  const isAdminPath = location.pathname.includes('admin')

  return (
    <main className='overflow-hidden text-tertiary'>
      {showUserLogin && <Login />}
      {!isAdminPath && <Header />}
      <Toaster position='bottom-right' />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/collection' element={<Collection />} />
      <Route path='/collection/:category' element={<CategoryCollection />} />
      <Route path='/collection/:category/:id' element={<ProductDetails />} />
      <Route path='/testimonial' element={<Testimonial />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/place-orders' element={<Placeorders/>} />
      <Route path='/my-orders' element={<MyOrders/>} />
      <Route path='/admin' element={isAdmin ? <Sidebar/> : <AdminLogin />}>
        <Route index element={isAdmin ? <AddProduct/>: null}/>
        <Route path='added-items' element={<AddedItems/>} />
        <Route path='list' element={<ProductList/>} />
        <Route path='orders' element={<Orders />}/>
        
      </Route>
    </Routes>
    {!isAdminPath && <Footer />}
    </main>
  )
}

export default App
