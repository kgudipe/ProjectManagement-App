import { useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/state/api';
import { EllipsisVertical, MessageSquareMore, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import SafeImage from '@/components/SafeImage';

type BoardProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatuses = ['To Do', 'Work In Progress', 'Under Review', 'Completed'];

const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200'
            : priority === 'High' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200'
                : priority === 'Medium' ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200'
                    : priority === 'Low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-dark-tertiary dark:text-gray-200'
        }`}>
        {priority}
    </div>
);

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
    const {
        data: tasks,
        isLoading,
        error,
    } = useGetTasksQuery({ projectId: Number(id) });
    const [updateTaskStatus] = useUpdateTaskStatusMutation();

    const moveTask = (taskId: number, toStatus: string) => {
        updateTaskStatus({ taskId, status: toStatus });
    };

    if (isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading tasks...</div>;
    if (error) return <div className="page-pad text-red-600 dark:text-red-300">An error occurred while fetching tasks</div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 lg:p-8 md:grid-cols-2 xl:grid-cols-4">
                {taskStatuses.map((status) => (
                    <TaskColumn
                        key={status}
                        status={status}
                        tasks={tasks || []}
                        moveTask={moveTask}
                        setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

type TaskColumnProps = {
    status: string;
    tasks: TaskType[];
    moveTask: (taskId: number, toStatus: string) => void;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
    status,
    tasks,
    moveTask,
    setIsModalNewTaskOpen
}: TaskColumnProps) => {
    const [{ isOver }, drop] = useDrop<{ id: number }, void, { isOver: boolean }>(() => ({
        accept: 'task',
        drop: (item: { id: number }) => moveTask(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const tasksCount = tasks.filter((task) => task.status === status).length;

    const statusColor: Record<string, string> = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        Completed: "#000000",
    };

    return (
        <div ref={(instance) => {
            drop(instance);
        }}
            className={`rounded-lg py-2 transition ${isOver ? 'bg-blue-50/80 ring-2 ring-blue-primary/25 dark:bg-blue-primary/10' : ''}`}>
            <div className='mb-3 flex w-full'>
                <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`} style={{ backgroundColor: statusColor[status] }} />
                <div className='surface-card flex w-full items-center justify-between rounded-s-none px-4 py-3'>
                    <h3 className='flex items-center text-base font-semibold text-gray-950 dark:text-white'>
                        {status}{" "}

                        <span className='ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 dark:bg-dark-tertiary dark:text-gray-300'>
                            {tasksCount}
                        </span>
                    </h3>
                    <div className='flex items-center gap-1'>
                        <button className='icon-button h-8 w-8'>
                            <EllipsisVertical size={20} />
                        </button>
                        <button className='icon-button h-8 w-8 bg-gray-100 dark:bg-dark-tertiary' onClick={() => { setIsModalNewTaskOpen(true) }}>
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {tasks.filter((task) => task.status === status).map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    )
}

type TaskProps = {
    task: TaskType;
};

const Task = ({ task }: TaskProps) => {
    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
    const [{ isDragging }, drag] = useDrag<{ id: number }, void, { isDragging: boolean }>(() => ({
        type: 'task',
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))

    const handleDelete = () => {
        if (window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
            deleteTask(task.id);
        }
    };

    const taskTagsSplit = task.tags ? task.tags.split(',') : [];

    const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';

    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';

    const numberOfComments = (task.comments && task.comments.length) || 0;

    return (
        <div ref={(instance) => { drag(instance) }}
            className={`surface-card surface-card-hover mb-4 ${isDragging ? 'opacity-50' : ''}`}>
            {task.attachments && task.attachments.length > 0 && (
                <SafeImage
                    src={task.attachments[0].fileURL ? `/${task.attachments[0].fileURL}` : null}
                    alt={task.attachments[0].fileName}
                    width={400}
                    height={200}
                    className="h-48 w-full rounded-t-lg object-cover"
                />
            )}
            <div className='p-4 md:p-6'>
                <div className='flex items-start justify-between'>
                    <div className='flex flex-1 flex-wrap items-center gap-2'>
                        {task.priority && <PriorityTag priority={task.priority} />}
                        <div className='flex gap-2'>
                            {taskTagsSplit.map((tag) => (
                                <div key={tag} className='rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-primary/15 dark:text-blue-200'>
                                    {" "} {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Delete task"
                        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-neutral-500 dark:hover:bg-red-500/10 dark:hover:text-red-300'>
                        <Trash2 size={20} />
                    </button>
                </div>
                <div className='my-3 flex justify-between'>
                    <h4 className='text-md font-bold text-gray-950 dark:text-white'>{task.title}</h4>
                    {typeof task.points === "number" && (
                        <div className='rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-dark-tertiary dark:text-white'>
                            {task.points} pts
                        </div>
                    )}
                </div>
                <div className='text-xs text-gray-500 dark:text-neutral-500'>
                    {formattedStartDate && <span>{formattedStartDate} - </span>}
                    {formattedDueDate && <span>{formattedDueDate}</span>}
                </div>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                    {task.description}
                </p>
                <div className='mt-4 border-t border-gray-200 dark:border-stroke-dark' />

                {/*USERS*/}
                <div className='mt-3 flex items-center justify-between'>
                    <div className='flex -space-x-1.5 overflow-hidden'>
                        {task.assignee && (
                            <SafeImage
                                key={task.assignee.userId}
                                src={task.assignee.profilePictureUrl ? `/${task.assignee.profilePictureUrl}` : null}
                                alt={task.assignee.username}
                                width={30}
                                height={30}
                                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                fallbackLabel={task.assignee.username}
                                variant="avatar"
                            />
                        )}
                        {task.author && (
                            <SafeImage
                                key={task.author.userId}
                                src={task.author.profilePictureUrl ? `/${task.author.profilePictureUrl}` : null}
                                alt={task.author.username}
                                width={30}
                                height={30}
                                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                                fallbackLabel={task.author.username}
                                variant="avatar"
                            />
                        )}
                    </div>
                    <div className='flex items-center text-gray-500 dark:text-neutral-500'>
                        <MessageSquareMore size={20}/>
                        <span className='ml-1 text-sm dark:text-neutral-400'>
                            {numberOfComments}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BoardView;
