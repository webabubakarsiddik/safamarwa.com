import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <Image
        onClick={() => router.push('/')}
        className="w-12 sm:w-12 md:w-12 lg:w-12 cursor-pointer rounded-full"
         src={assets.logo}
         alt="logo"
         sizes="(max-width: 640px) 80px, 
         (max-width: 768px) 96px,
         (max-width: 1024px) 112px,
         128px"
/>

      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar