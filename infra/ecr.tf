# A private Docker registry — this is where your built image will live
resource "aws_ecr_repository" "app" {
  name                 = "${var.project_name}-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-ecr"
  }
}

output "ecr_repository_url" {
  description = "URL of the ECR repository — used to push/pull the Docker image"
  value       = aws_ecr_repository.app.repository_url
}