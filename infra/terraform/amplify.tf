# Amplify hosting for the Next.js frontend. Only created when a GitHub repo and
# access token are supplied (otherwise the frontend can be hosted elsewhere).
resource "aws_amplify_app" "frontend" {
  count = var.github_repository != "" && var.github_access_token != "" ? 1 : 0

  name         = "${local.name}-web"
  repository   = var.github_repository
  access_token = var.github_access_token
  platform     = "WEB_COMPUTE" # Next.js SSR

  # Build the app from the client/ subdirectory.
  build_spec = <<-EOT
    version: 1
    applications:
      - appRoot: client
        frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
          artifacts:
            baseDirectory: .next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
  EOT

  environment_variables = {
    NEXT_PUBLIC_API_BASE_URL                = "http://${aws_instance.api.public_dns}:${var.app_port}"
    NEXT_PUBLIC_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.web.id
  }

  tags = { Name = "${local.name}-web" }
}

resource "aws_amplify_branch" "main" {
  count = var.github_repository != "" && var.github_access_token != "" ? 1 : 0

  app_id      = aws_amplify_app.frontend[0].id
  branch_name = "main"
  stage       = "PRODUCTION"
}
