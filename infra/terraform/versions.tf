terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # For a real deployment, store state remotely (uncomment and create the bucket
  # + DynamoDB lock table first). Left local here so the stack is clone-and-go.
  # backend "s3" {
  #   bucket         = "pm-terraform-state"
  #   key            = "project-management/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "pm-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "ProjectManagement-App"
      ManagedBy = "Terraform"
      Env       = var.environment
    }
  }
}
