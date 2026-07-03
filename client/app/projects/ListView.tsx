import { Task, useGetTasksQuery } from '@/state/api';
import React from 'react'
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({id, setIsModalNewTaskOpen}: Props) => {
    const {
        data: tasks,
        error,
        isLoading,
    } = useGetTasksQuery({projectId:Number(id)});

    if(isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading tasks...</div>

    if(error) return <div className="page-pad text-red-600 dark:text-red-300">An error occured while fetching tasks</div>

  return (
    <div className='px-4 pb-8 sm:px-6 lg:px-8'>
        <div className='pt-5'>
            <Header name="List"
                buttonComponent={
                    <button className='primary-button'
                    onClick={()=>setIsModalNewTaskOpen(true)}>
                        Add Task
                    </button>
                }
                isSmallText
            />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {tasks?.map((task:Task)=> <TaskCard key={task.id} task={task}/>)}
        </div>
    </div>
  )
}

export default ListView
