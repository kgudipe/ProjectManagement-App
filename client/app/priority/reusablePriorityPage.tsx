"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utility";
import {
  Priority,
  useGetTasksByPriorityQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByPriorityQuery(priority);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks ?? [];

  if (isTasksError) return <div className="page-pad text-red-600 dark:text-red-300">Error fetching tasks</div>;

  if (isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading tasks...</div>;

  return (
    <div className="page-pad">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="primary-button"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            view === "list" ? "bg-blue-primary text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-tertiary"
          }`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            view === "table" ? "bg-blue-primary text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-tertiary"
          }`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {view === "list" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.length === 0 && (
            <div className="surface-card p-5 text-gray-600 dark:text-gray-300">
              No {priority.toLowerCase()} priority tasks found.
            </div>
          )}
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        (
          <div className="z-0 h-[620px] w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
