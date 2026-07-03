"use client"

import React, { useEffect } from 'react'
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import StoreProvider, { useAppSelector } from './redux'
import AuthProvider from "./authProvider"

const DashboardLayout = ({children}:{children: React.ReactNode}) => {
    const isSidebarCollapsed = useAppSelector((state)=>state.global.isSidebarCollapsed);

    const isDarkMode = useAppSelector((state)=>state.global.isDarkMode);

    useEffect(() => {
        if(isDarkMode){
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

  return (
    <div className='app-shell flex min-h-screen w-full'>
        {/* Sidebar */}
        <Sidebar/>
        <main className={`flex min-w-0 w-full flex-col transition-[padding] duration-300 ${isSidebarCollapsed ? '' : 'md:pl-64'}`}>
            <Navbar />

            <div className="flex-1">
                {children}
            </div>

        </main>
    </div>
  )
}

const dashboardWrapper = ({children}:{children: React.ReactNode}) => {
    return(
        <StoreProvider>
            <AuthProvider>
                <DashboardLayout>{children}</DashboardLayout>
            </AuthProvider>
            
        </StoreProvider>
    )
}

export default dashboardWrapper;
