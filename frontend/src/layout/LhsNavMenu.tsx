import React, { ReactNode } from 'react';
import logo from '../logo.svg';
// import './../App.css';
import { Outlet, Link } from "react-router-dom";



function NavItem({route, label} : {route: string, label: string})
{
    return(
        <Link to={route}>
            <div className='py-2 pl-2 bg-slate-300 hover:bg-slate-800 hover:text-white hover:transition-all hover:duration-700 text-md font-semibold '>
                {label}
            </div>
        </Link>

    )
}

function LhsNavMenu() {
    return (
        <>
          <nav className="h-full w-full bg-slate-200 border-r-2 border-r-slate-300">
            <div className='flex w-full items-center'>
              {/* <img src={logo} alt='logo' className='h-auto w-12'/> */}
              <img src="https://s3-ap-southeast-1.amazonaws.com/mse-misc/company-images/logo/MTCC.png" alt='logo' className='h-auto w-16'/>
              <div className='font-bold py-5 pl-2 text-lg'>
                MTCC - MTD
              </div>
            </div>
            <ul className='h-full w-full flex flex-col gap-1'>
              {/* <li>
                <NavItem route='/' label='Home' />
              </li> */}
              <li>
                <NavItem route='/locations' label='Locations' />
              </li>
              <li>
                <NavItem route='/trips' label='Trips' />
              </li>
              <li>
                <NavItem route='/trip-requests' label='Trip Requests' />
              </li>
              <li>
                <NavItem route='/loading-page' label='Loading Page' />
              </li>
            </ul>
          </nav>
    
          <Outlet />
        </>
      )
}

export default LhsNavMenu;
