export const dataGridClassNames= "surface-card overflow-hidden border-none shadow-none";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    border: "none",
    color: isDarkMode ? "#e5e7eb" : "#172033",
    backgroundColor: "transparent",
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : "#374151"}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "#f7f8fb"}`,
        borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      },
    },
    "& .MuiIconButton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-cell": {
      borderColor: `${isDarkMode ? "#2d3135" : "#eef2f7"}`,
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      "&:hover": {
        backgroundColor: isDarkMode ? "rgba(59, 61, 64, 0.55)" : "#f8fafc",
      },
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
    "& .MuiDataGrid-footerContainer": {
      borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
    "& .MuiDataGrid-toolbarContainer": {
      padding: "12px",
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
  };
};
