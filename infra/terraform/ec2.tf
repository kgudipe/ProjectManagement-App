# Latest Amazon Linux 2023 AMI for the region (no hardcoded AMI ids).
data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

locals {
  database_url = format(
    "postgresql://%s:%s@%s/%s?schema=public",
    var.db_username,
    var.db_password,
    aws_db_instance.main.endpoint,
    var.db_name,
  )

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    repo_url             = var.github_repository != "" ? var.github_repository : "https://github.com/kgudipe/ProjectManagement-App.git"
    app_port             = var.app_port
    database_url         = local.database_url
    aws_region           = var.aws_region
    s3_bucket            = aws_s3_bucket.attachments.bucket
    cognito_user_pool_id = aws_cognito_user_pool.main.id
    cognito_client_id    = aws_cognito_user_pool_client.web.id
  })
}

resource "aws_instance" "api" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.api.id]
  iam_instance_profile   = aws_iam_instance_profile.api.name
  key_name               = var.key_pair_name != "" ? var.key_pair_name : null

  user_data                   = local.user_data
  user_data_replace_on_change = true

  root_block_device {
    volume_size = 16
    volume_type = "gp3"
    encrypted   = true
  }

  tags = { Name = "${local.name}-api" }

  depends_on = [aws_db_instance.main]
}
