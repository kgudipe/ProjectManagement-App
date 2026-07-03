"use client";

import React, { useState } from 'react'
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/app/redux';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { setIsSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import SafeImage from './SafeImage';


const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();

  const dispatch = useDispatch();

  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  const sidebarClassNmaes = `fixed flex h-full flex-col justify-between border-r border-gray-200/80 bg-white/90 shadow-xl shadow-gray-200/70 backdrop-blur-xl transition-all duration-300 z-40 dark:border-stroke-dark dark:bg-dark-bg/95 dark:shadow-black/20 ${isSidebarCollapsed ? 'w-0 hidden' : 'w-64'}`;

  return (
    <div className={sidebarClassNmaes}>
      <div className='flex w-full flex-1 flex-col justify-start overflow-y-auto'>
        <div className='z-50 flex min-h-16 w-64 items-center justify-between px-6 pt-3'>
          <div className='text-xl font-black tracking-tight text-gray-900 dark:text-white'>
            LIST
          </div>
          {isSidebarCollapsed ? null : (
            <button className='icon-button' onClick={() => {
              dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
            }}
            >
              <X className='h-5 w-5' />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className='mx-4 mb-3 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-4 dark:border-stroke-dark dark:bg-dark-secondary/80'>
          <SafeImage src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <h3 className='text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100'>TEAM NAME</h3>
            <div className='mt-1 flex items-start gap-2'>
              <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>
        {/* Navbar Links */}
        <nav className='z-10 w-full'>
          <SidebarLink href='/' icon={Home} label='Home' />
          <SidebarLink href='/timeline' icon={Briefcase} label='Timeline' />
          <SidebarLink href='/search' icon={Search} label='Search' />
          <SidebarLink href='/settings' icon={Settings} label='Settings' />
          <SidebarLink href='/users' icon={User} label='Users' />
          <SidebarLink href='/teams' icon={Users} label='Teams' />
        </nav>

        {/* Projects List */}
        <button onClick={() => { setShowProjects((prev) => !prev) }} className='mt-3 flex w-full items-center justify-between px-8 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
          <span>Projects</span>
          {showProjects ? (
            <ChevronUp className='h-5 w-5' />
          ) : (
            <ChevronDown className='h-5 w-5' />
          )}
        </button>

        {showProjects && projects?.map(project => {
          return (
            <SidebarLink key={project.id} href={`/projects/${project.id}`} icon={Briefcase} label={project.name} />
          )
        })}

        {/* Priority List */}

        <button onClick={() => { setShowPriority((prev) => !prev) }} className='mt-3 flex w-full items-center justify-between px-8 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
          <span>Priority</span>
          {showPriority ? (
            <ChevronUp className='h-5 w-5' />
          ) : (
            <ChevronDown className='h-5 w-5' />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink href='/priority/urgent' icon={AlertCircle} label='Urgent' />
            <SidebarLink href='/priority/high' icon={ShieldAlert} label='High' />
            <SidebarLink href='/priority/medium' icon={AlertTriangle} label='Medium' />
            <SidebarLink href='/priority/low' icon={AlertOctagon} label='Low' />
            <SidebarLink href='/priority/backlog' icon={Layers3} label='Backlog' />
          </>
        )}
      </div>
      <div className="z-10 flex w-full flex-col items-center gap-4 border-t border-gray-200 bg-white/80 px-6 py-4 dark:border-stroke-dark dark:bg-dark-bg/80 md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            <SafeImage
              src={currentUserDetails?.profilePictureUrl ? `/${currentUserDetails.profilePictureUrl}` : null}
              alt={currentUserDetails?.username || "User Profile Picture"}
              width={100}
              height={50}
              className="h-full rounded-full object-cover ring-2 ring-white dark:ring-dark-tertiary"
              fallbackLabel={currentUserDetails?.username}
              variant="avatar"
            />
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="ghost-button ml-auto px-3 py-2 text-xs"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  //isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  //isCollapsed
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === '/' && href === '/dashboard');


  return (
    <Link href={href} className="w-full">
      <div className={`relative mx-3 my-1 flex cursor-pointer items-center gap-3 rounded-lg px-5 py-3 transition-all ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-primary/15 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-dark-secondary dark:hover:text-white'}`}>
        {isActive && (
          <div className='absolute left-0 top-2 h-[calc(100%-1rem)] w-[3px] rounded-r-full bg-blue-primary' />
        )}

        <Icon className='h-5 w-5 shrink-0' />
        <span className='truncate font-medium'>
          {label}
        </span>
      </div>
    </Link>
  )
}

export default Sidebar
