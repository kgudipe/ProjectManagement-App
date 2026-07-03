// import { getUserTasks } from './../../server/src/controllers/taskController';
// import { getUsers } from './../../server/src/controllers/userController';
// import { create } from 'domain';
// import { provide } from './../../server/node_modules/effect/src/Layer';
// import { getProjects } from './../../server/src/controllers/projectController';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
  Backlog="Backlog"
}

export enum Status {
  TODO = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed="Completed"
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileURL: string;
  uploadedById: number;
  taskId: number;
  uploadedBy?: Pick<User, "userId" | "username">;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  user?: User;
}

export interface PresignedUpload {
  uploadUrl: string;
  key: string;
  fileUrl: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults{
  tasks?: Task[]
  projects?: Project[]
  users?: User[]
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
   }),

  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Comments", "Attachments"],
  endpoints: (build) => ({
    getAuthUser: build.query({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if (!session) throw new Error("No session found");
          const { userSub } = session;
          const usersResponse = await fetchWithBQ("users");
          if (usersResponse.error) return { error: usersResponse.error };

          const users = usersResponse.data as User[];
          let userDetails = users.find((item) => item.cognitoId === userSub);

          if (!userDetails) {
            const createdUserResponse = await fetchWithBQ({
              url: "users",
              method: "POST",
              body: {
                username: user.username,
                cognitoId: userSub,
              },
            });

            if (createdUserResponse.error) return { error: createdUserResponse.error };

            userDetails = (createdUserResponse.data as { user: User }).user;
          }

          return { data: { user, userSub, userDetails } };
        } catch (error: unknown) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "Could not fetch user data",
            },
          };
        }
      },
    }),
    getProjects: build.query<Project[], void>({ 
      query: () => 'projects',
      providesTags: ['Projects'],
    }),
    getProject: build.query<Project, number>({
      query: (id) => `projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: project
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: build.mutation<Project, { id: number } & Partial<Project>>({
      query: ({ id, ...patch }) => ({
        url: `projects/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Projects", id }, "Projects"],
    }),
    deleteProject: build.mutation<void, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Tasks"],
    }),
    getTasks: build.query<Task[], {projectId:number}>({ 
      query: ({projectId}) => `tasks?projectId=${projectId}`,
      providesTags: (result)=>
        result 
        ? result.map(({id})=>({type:'Tasks' as const, id}))
        :[{type:'Tasks' as const}],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId)=> `tasks/user/${userId}`,
      providesTags: (result, error, userId)=>
        result
          ? result.map(({id})=>({type:"Tasks", id}))
          : [{type: "Tasks", id:userId}]
    }),
    getTasksByPriority: build.query<Task[], Priority>({
      queryFn: async (priority, _queryApi, _extraoptions, fetchWithBQ) => {
        const projectsResponse = await fetchWithBQ("projects");
        if (projectsResponse.error) return { error: projectsResponse.error };

        const projects = projectsResponse.data as Project[];
        const taskResponses = await Promise.all(
          projects.map((project) => fetchWithBQ(`tasks?projectId=${project.id}`)),
        );
        const failedResponse = taskResponses.find((response) => response.error);
        if (failedResponse?.error) return { error: failedResponse.error };

        const tasks = taskResponses.flatMap((response) => response.data as Task[]);
        return {
          data: tasks.filter((task) => task.priority === priority),
        };
      },
      providesTags: (result, error, priority) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const, id: priority }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: 'tasks',
        method: 'POST',
        body: task
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTaskStatus: build.mutation<Task, {taskId: number, status: string}>({
      query: ({taskId, status}) => ({
        url: `tasks/${taskId}/status`,
        method: 'PATCH',
        body: {taskId, status}
      }),
      invalidatesTags: (result,error,{taskId})=>[{type:'Tasks', id: taskId},],
    }),
    updateTask: build.mutation<Task, { taskId: number } & Partial<Task>>({
      query: ({ taskId, ...patch }) => ({
        url: `tasks/${taskId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),
    deleteTask: build.mutation<void, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getComments: build.query<Comment[], number>({
      query: (taskId) => `comments?taskId=${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Comments", id: taskId }],
    }),
    createComment: build.mutation<Comment, { text: string; taskId: number; userId: number }>({
      query: (body) => ({ url: "comments", method: "POST", body }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),
    updateComment: build.mutation<Comment, { id: number; taskId: number; text: string }>({
      query: ({ id, text }) => ({ url: `comments/${id}`, method: "PATCH", body: { text } }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Comments", id: taskId }],
    }),
    deleteComment: build.mutation<void, { id: number; taskId: number }>({
      query: ({ id }) => ({ url: `comments/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),
    getAttachments: build.query<Attachment[], number>({
      query: (taskId) => `attachments?taskId=${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Attachments", id: taskId }],
    }),
    presignAttachment: build.mutation<
      PresignedUpload,
      { fileName: string; contentType: string; taskId: number }
    >({
      query: (body) => ({ url: "attachments/presign", method: "POST", body }),
    }),
    createAttachment: build.mutation<
      Attachment,
      { fileURL: string; fileName?: string; taskId: number; uploadedById: number }
    >({
      query: (body) => ({ url: "attachments", method: "POST", body }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteAttachment: build.mutation<void, { id: number; taskId: number }>({
      query: ({ id }) => ({ url: `attachments/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Attachments", id: taskId },
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    updateUser: build.mutation<
      User,
      { cognitoId: string; username?: string; profilePictureUrl?: string; teamId?: number }
    >({
      query: ({ cognitoId, ...patch }) => ({
        url: `users/${cognitoId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<
      Team,
      { teamName: string; productOwnerUserId?: number; projectManagerUserId?: number }
    >({
      query: (body) => ({ url: "teams", method: "POST", body }),
      invalidatesTags: ["Teams"],
    }),
    assignTeamToProject: build.mutation<unknown, { teamId: number; projectId: number }>({
      query: (body) => ({ url: "teams/assign", method: "POST", body }),
      invalidatesTags: ["Teams", "Projects"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`
    })
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetAttachmentsQuery,
  usePresignAttachmentMutation,
  useCreateAttachmentMutation,
  useDeleteAttachmentMutation,
  useSearchQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useAssignTeamToProjectMutation,
  useGetTasksByUserQuery,
  useGetTasksByPriorityQuery,
  useGetAuthUserQuery
} = api;
