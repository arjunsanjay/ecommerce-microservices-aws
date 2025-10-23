output "eks_cluster_endpoint" {
  description = "The endpoint for your EKS cluster"
  value       = aws_eks_cluster.main.endpoint
}

output "eks_cluster_ca" {
  description = "The certificate authority for your EKS cluster"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "lbc_role_arn" {
  description = "The ARN of the IAM role for the AWS LoadBalancerController"
  value       = aws_iam_role.lbc_role.arn
}

output "vpc_id" {
  description = "The ID of the EKS VPC"
  value       = aws_vpc.main.id
}