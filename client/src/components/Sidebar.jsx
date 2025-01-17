import React from 'react'
import Logo from '../assets/img/logo.png'
import { NavLink,Link } from 'react-router-dom'
const Sidebar = () => {
    const navlink=[
        {
        path:'/',
        title:'Dashboard'
        },
        {
            path:'/list',
            title:'Sales Invoice'
        },
        {
            path:'/stock',
            title:'Stocks'
        }
]
    return (
        <div>
            <div className="bg-blue-500 w-[15vw] h-screen flex flex-col items-center py-6 ">

                <img src={Logo} alt="logo" className='w-[10vw] rounded-full shadow-lg drop-shadow-xl' />

                <div className='flex flex-col gap-7 w-[15vw] text-white font-bold p-12 text-xl'>

                    {/* <div className='p-4 text-xl'>M.S.Mani Rewindings</div> */}
                    {
                        navlink.map((value,index)=>(
                          <NavLink key={index} to={value.path}>{value.title}</NavLink>
                        ))
                    }
                    {/* <div className='hover:bg-white hover:text-black '>Dashboard</div>
                    <div className='hover:bg-white hover:text-black '>Sales Invoice</div>
                    <div className='hover:bg-white hover:text-black '>PDFs</div> */}
                </div>
            </div>
        </div>
    )
}

export default Sidebar