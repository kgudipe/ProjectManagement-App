resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "attachments" {
  bucket = "${local.name}-attachments-${random_id.bucket_suffix.hex}"
  tags   = { Name = "${local.name}-attachments" }
}

# Allow public read of objects so attachment URLs render directly, while the
# bucket itself stays locked down to presigned PUT uploads for writes.
resource "aws_s3_bucket_public_access_block" "attachments" {
  bucket                  = aws_s3_bucket.attachments.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "attachments" {
  bucket = aws_s3_bucket.attachments.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"] # Tighten to the Amplify domain in production.
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "attachments_public_read" {
  bucket = aws_s3_bucket.attachments.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadObjects"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.attachments.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.attachments]
}
