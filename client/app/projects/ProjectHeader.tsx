import React, { useState } from 'react'
import Header from '@/components/Header';
import { Clock, Filter, Grid3X3, List, PlusSquare, Share2, Table } from 'lucide-react';
import ModalNewProject from './ModalNewProject';

type Props = {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
}

const ProjectHeader = ({activeTab, setActiveTab}: Props) => {
    const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
        <ModalNewProject 
            isOpen={isModalNewProjectOpen}
            onClose={()=> setIsModalNewProjectOpen(false)}
            />
        <div className='pb-5 pt-6 lg:pt-8'>
            <Header name='Product Design Development'
                buttonComponent={
                    <button className='primary-button'
                    onClick={()=>setIsModalNewProjectOpen(true)}>
                        <PlusSquare className='h-5 w-5'/> New Board
                    </button>
                }
            />
        </div>
        {/* TABS */}
        <div className='surface-card flex flex-wrap-reverse gap-3 p-2 md:items-center'>
            <div className='flex flex-1 items-center gap-1 overflow-x-auto'>
                <TabButton 
                    name="Board" 
                    icon={<Grid3X3 className='h-5 w-5' />} 
                    setActiveTab={setActiveTab} 
                    activeTab={activeTab}
                />

                <TabButton 
                    name="List" 
                    icon={<List className='h-5 w-5' />} 
                    setActiveTab={setActiveTab} 
                    activeTab={activeTab}
                />

                <TabButton 
                    name="Timeline" 
                    icon={<Clock className='h-5 w-5' />} 
                    setActiveTab={setActiveTab} 
                    activeTab={activeTab}
                />

                <TabButton 
                    name="Table" 
                    icon={<Table className='h-5 w-5' />} 
                    setActiveTab={setActiveTab} 
                    activeTab={activeTab}
                />
            </div>
            <div className='flex w-full items-center gap-2 sm:w-auto'>
                <button className='icon-button'>
                    <Filter className='h-5 w-5' />
                </button>
                <button className='icon-button'>
                    <Share2 className='h-5 w-5' />
                </button>
                <div className='relative min-w-0 flex-1 sm:w-60 sm:flex-none'>
                    <input type="text" placeholder='Search Task'className='control-input pl-9'/>
                    <Grid3X3 className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500' />
                </div>
            </div>
        </div>
    </div>
  )
}

type TabButtonProps = {
    name: string;
    icon: React.ReactNode;
    setActiveTab: (tabName: string) => void;
    activeTab: string;
}

const TabButton=({name, icon, setActiveTab, activeTab}: TabButtonProps)=>{
    const isActive = activeTab === name;

    return(
        <button className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-blue-primary text-white shadow-sm shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-dark-tertiary dark:hover:text-white'}`} onClick={()=>{setActiveTab(name)}}>
            {icon}
            {name}
        </button>
    )

}

export default ProjectHeader
