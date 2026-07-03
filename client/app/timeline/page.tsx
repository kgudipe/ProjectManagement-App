"use client"

import React, { useMemo, useState } from "react";
import { useAppSelector } from '../redux';
import { useGetProjectsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from '@rsagiev/gantt-task-react-19'
import "@rsagiev/gantt-task-react-19/dist/index.css"
import Header from "@/components/Header";


type TaskTypeItems = "task" | "milestone" | "project"

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const {
    data: projects,
    error,
    isLoading,
  } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
      })) || []
    )
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading timeline...</div>

  if (error || !projects) return <div className="page-pad text-red-600 dark:text-red-300">An error occured while fetching projects</div>

  return (
    <div className="page-pad max-w-full">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Header name="Projects Timeline"/>
        <div className="relative inline-block w-full sm:w-64">
          <select className="control-input appearance-none pr-8" name="" id="" value={displayOptions.viewMode} onChange={handleViewModeChange}>
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

          <div className="surface-card overflow-hidden">
            <div className="timeline">
              <Gantt 
                tasks={ganttTasks}
                {...displayOptions}
                columnWidth={displayOptions.viewMode===ViewMode.Month ? 150: 100}
                listCellWidth="100px"
                projectBackgroundColor={isDarkMode? "#101214": "#1f29317"}
                projectProgressColor={isDarkMode ? "#1f29317" : "#aeb8c2"}
                projectProgressSelectedColor={isDarkMode ? "#000" :"#9ba1a6"}
                />
            </div>
            
          </div>
        </div>
  )
}

export default Timeline
