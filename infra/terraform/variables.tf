variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name used for tagging and resource names."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Short slug used to prefix resource names."
  type        = string
  default     = "project-management"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

# --- EC2 (API server) ---
variable "ec2_instance_type" {
  description = "EC2 instance type for the API. t3.micro is free-tier eligible."
  type        = string
  default     = "t3.micro"
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to SSH to the API instance. Lock this to your IP."
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_pair_name" {
  description = "Optional existing EC2 key pair name for SSH access. Empty = no SSH key."
  type        = string
  default     = ""
}

variable "app_port" {
  description = "Port the Express API listens on."
  type        = number
  default     = 8000
}

# --- RDS (PostgreSQL) ---
variable "db_instance_class" {
  description = "RDS instance class. db.t4g.micro is free-tier eligible."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_name" {
  description = "Initial database name."
  type        = string
  default     = "project_management"
}

variable "db_username" {
  description = "Master database username."
  type        = string
  default     = "pmadmin"
}

variable "db_password" {
  description = "Master database password. Provide via TF_VAR_db_password or tfvars (do not commit)."
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "RDS storage in GB (20 GB is within the free tier)."
  type        = number
  default     = 20
}

# --- Amplify (frontend) ---
variable "github_repository" {
  description = "GitHub repo URL hosting the frontend (for Amplify). Empty = skip Amplify."
  type        = string
  default     = ""
}

variable "github_access_token" {
  description = "GitHub personal access token for Amplify to connect the repo. Empty = skip Amplify."
  type        = string
  sensitive   = true
  default     = ""
}
