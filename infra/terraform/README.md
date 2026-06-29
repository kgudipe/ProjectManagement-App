# Infrastructure (Terraform)

Infrastructure-as-Code for the entire AWS stack behind ProjectManagement-App.
This is the source of truth for the deployment and lets you bring the whole
environment up for a demo and tear it back down to **$0** afterwards.

## What it provisions

| Resource | Purpose |
|----------|---------|
| **VPC** | 2 public + 2 private subnets across 2 AZs, internet gateway, route tables. No NAT gateway (deliberate cost choice). |
| **EC2** (`t3.micro`) | Runs the Express API under PM2; bootstrapped via `user_data`. |
| **RDS PostgreSQL** (`db.t4g.micro`) | Application database in private subnets, reachable only from the API security group. |
| **S3** | Attachment storage with CORS for presigned uploads and public read for downloads. |
| **Cognito** | User pool + public SPA app client for authentication. |
| **IAM** | Instance role granting the API scoped S3 access + SSM (no static keys). |
| **Amplify** *(optional)* | Hosts the Next.js frontend from the `client/` folder when a GitHub repo + token are supplied. |

All instance classes are free-tier eligible. The design avoids the usual silent
cost sinks (NAT gateway, idle Elastic IPs, Multi-AZ RDS).

## Usage

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # then edit it
export TF_VAR_db_password='a-strong-password'   # or set it in terraform.tfvars

terraform init
terraform plan
terraform apply
```

Then read the connection values:

```bash
terraform output
```

Wire `cognito_user_pool_id`, `cognito_user_pool_client_id` and `api_public_url`
into the frontend env (`NEXT_PUBLIC_*`), and the API picks up its own config from
`user_data` automatically.

## Tear down to $0

```bash
terraform destroy
```

Because RDS uses `skip_final_snapshot` and nothing retains storage, `destroy`
returns the account to zero ongoing cost. Spin the stack up before an interview,
tear it down after.

> **Note:** Terraform state can contain secrets (the DB password). State files
> and `*.tfvars` are gitignored. For team use, switch to the S3 + DynamoDB
> remote backend stub in `versions.tf`.
