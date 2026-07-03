"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="page-pad">
      <Header name="Search" />
      <div className="surface-card p-4">
        <input
          type="text"
          placeholder="Search..."
          className="control-input max-w-2xl"
          onChange={handleSearch}
        />
      </div>
      <div className="py-5">
        {isLoading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
        {isError && <p className="text-red-600 dark:text-red-300">Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div className="space-y-5">
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Tasks</h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
