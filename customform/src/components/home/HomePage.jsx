import React from 'react'
import Header from './Header'
import Footer from './Footer'

function HomePage() {
  const isLogin = true 
  return (
    <div className='flex flex-col min-h-screen'>
      <Header isLogin={isLogin}/>

      <div className='grow bg-amber-50 flex items-center justify-center'>
        {isLogin ? <h1 className='text-2xl font-semibold'>Welcome back, User! 🎉</h1>
          : <h1 className='text-2xl font-semibold'>Please log in to access your account.</h1>
        }
      </div>

      <Footer />
    </div>
  )
}

export default HomePage
