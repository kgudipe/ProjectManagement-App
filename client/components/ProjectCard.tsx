import React from 'react'
import { Project } from '@/state/api'

type Props = {
    project: Project
}

const ProjectCard = ({ project }: Props) => {
    return (
        <div className='surface-card surface-card-hover p-4'>
            <h3 className='text-base font-semibold text-gray-950 dark:text-white'>{project.name}</h3>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{project.description || "No description provided"}</p>
            <div className='mt-4 grid gap-2 text-xs text-gray-500 dark:text-gray-400 sm:grid-cols-2'>
                <p><span className='font-semibold text-gray-700 dark:text-gray-200'>Start:</span> {project.startDate || "Not set"}</p>
                <p><span className='font-semibold text-gray-700 dark:text-gray-200'>End:</span> {project.endDate || "Not set"}</p>
            </div>
        </div>
    )
}

export default ProjectCard
