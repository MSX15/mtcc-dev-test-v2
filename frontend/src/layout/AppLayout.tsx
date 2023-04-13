import React, { ReactNode } from 'react';
import logo from './logo.svg';
import './../App.css';
import LhsNavMenu from './LhsNavMenu';

function AppLayout({children} : { children: ReactNode}) {
  return (
    <div className="h-screen w-screen bg-slate-200">
      <div className='h-full w-full flex overflow-hidden'>
        <div className='h-full w-52 bg-red'>
          <LhsNavMenu />
        </div>
        <div className='h-full flex-grow min-w-0 bg-slate-100'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
