output "api_public_url" {
  description = "Public URL of the Express API."
  value       = "http://${aws_instance.api.public_dns}:${var.app_port}"
}

output "api_instance_id" {
  description = "EC2 instance id (for SSM Session Manager)."
  value       = aws_instance.api.id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint."
  value       = aws_db_instance.main.endpoint
}

output "s3_bucket_name" {
  description = "S3 bucket for attachments."
  value       = aws_s3_bucket.attachments.bucket
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool id (NEXT_PUBLIC_COGNITO_USER_POOL_ID)."
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito App Client id (NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID)."
  value       = aws_cognito_user_pool_client.web.id
}

output "amplify_app_url" {
  description = "Amplify default domain (if Amplify was provisioned)."
  value = length(aws_amplify_branch.main) > 0 ? "https://${aws_amplify_branch.main[0].branch_name}.${aws_amplify_app.frontend[0].default_domain}" : "Amplify not provisioned (host the frontend elsewhere)"
}
