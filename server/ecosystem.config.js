module.exports = {
  apps: [
    {
      name: "ProjectManagement-App",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};