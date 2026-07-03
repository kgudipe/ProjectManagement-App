import React from 'react'
import { Task } from '@/state/api'
import { format } from "date-fns"
import SafeImage from './SafeImage'

type Props = {
    task: Task
}

const TaskCard = ({ task }: Props) => {
    return (
        <div className='surface-card surface-card-hover mb-3 p-4'>
            {task.attachments && task.attachments.length > 0 && (
                <div className='mb-4'>
                    <strong className='text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400'>Attachments</strong>
                    <div className='flex flex-wrap'>
                        {task.attachments && task.attachments.length > 0 && (
                            <SafeImage
                                src={task.attachments[0].fileURL ? `/${task.attachments[0].fileURL}` : null}
                                alt={task.attachments[0].fileName}
                                width={400}
                                height={200}
                                className="mt-2 h-48 w-full rounded-lg object-cover"
                            />
                        )}
                    </div>
                </div>
            )}
            <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-primary/15 dark:text-blue-200'>{task.status}</span>
                <span className='rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'>{task.priority}</span>
            </div>
            <h3 className='mt-3 text-base font-semibold text-gray-950 dark:text-white'>{task.title}</h3>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>{task.description || "No description provided"}</p>
            <div className='mt-4 grid gap-2 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2'>
                <p><strong className='text-gray-800 dark:text-gray-200'>ID:</strong> {task.id}</p>
                <p><strong className='text-gray-800 dark:text-gray-200'>Tags:</strong> {task.tags || "No tags"}</p>
                <p><strong className='text-gray-800 dark:text-gray-200'>Start:</strong> {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}</p>
                <p><strong className='text-gray-800 dark:text-gray-200'>Due:</strong> {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}</p>
                <p><strong className='text-gray-800 dark:text-gray-200'>Author:</strong> {task.author ? task.author.username : "Unknown"}</p>
                <p><strong className='text-gray-800 dark:text-gray-200'>Assignee:</strong> {task.assignee ? task.assignee.username : "Unknown"}</p>
            </div>
        </div>
    )
}

export default TaskCard
