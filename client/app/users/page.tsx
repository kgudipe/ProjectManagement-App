"use client"

import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import { DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utility";
//import { GridToolbar } from "@mui/x-data-grid/internals";


// const CustomToolbar = () => (
//     <GridToolbar className="toolbar flex gap-2">
//         {/* <GridToolbarQuickFilter /> */}
//         <GridToolbarExportContainer />
//     </GridToolbar>
// )

const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 100 },
    { field: "username", headerName: "Username", width: 150 },
    {
        field: "profilePictureUrl", headerName: "Profile Picture", width: 100,
        renderCell: (params) => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-9 w-9">
                    <Image
                        src={`/${params.value}`}
                        alt={params.row.username}
                        width={100}
                        height={50}
                        className="h-full rounded-full object-cover"
                    />
                </div>
            </div>
        )
    },
]

const Users = () => {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const isDarkmode = useAppSelector((state) => state.global.isDarkMode)

    if (isLoading) return <div>Loading</div>

    if (error || !users) return <div>An error occured while fetching users</div>

    return (
        <div className="flex w-full flex-col p-8">
            <Header name="Users" />
            <div style={{ height: 650, width: "100%" }}>
                <DataGrid
                    rows={users || []}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                    showToolbar
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkmode)} />
            </div>
        </div>
    )
}

export default Users;