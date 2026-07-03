import React, { useMemo, useState } from "react";
import { useAppSelector } from '../redux';
import { useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from '@rsagiev/gantt-task-react-19'
//import "gantt-task-react/dist/index.css";
import "@rsagiev/gantt-task-react-19/dist/index.css"

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskTypeItems = "task" | "milestone" | "project"

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false
      })) || []
    )
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading timeline...</div>

  if (error) return <div className="page-pad text-red-600 dark:text-red-300">An error occured while fetching tasks</div>

  return (
    <div className="px-4 pb-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h1 className="me-2 text-lg font-bold text-gray-950 dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-full sm:w-64">
          <select className="control-input appearance-none pr-8" name="" id="" value={displayOptions.viewMode} onChange={handleViewModeChange}>
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

          <div className="surface-card overflow-hidden">
            <div className="timeline">
              <Gantt 
                tasks={ganttTasks}
                {...displayOptions}
                columnWidth={displayOptions.viewMode===ViewMode.Month ? 150: 100}
                listCellWidth="100px"
                barBackgroundColor={isDarkMode?"#101214" : "#aeb8c2"}
                barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                />
            </div>
            <div className="px-4 pb-5 pt-1">
              <button className="primary-button"
              onClick={()=>setIsModalNewTaskOpen(true)}>
                Add New Task
              </button>
            </div>
          </div>
        </div>

  )
}

export default Timeline
