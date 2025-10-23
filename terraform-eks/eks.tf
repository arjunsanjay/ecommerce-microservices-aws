# This is the blueprint for the EKS Cluster Control Plane (the "head chef")
resource "aws_eks_cluster" "main" {
  name     = "ecommerce-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    # It needs to know which subnets it can operate in.
    subnet_ids = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id,
      aws_subnet.private_a.id,
      aws_subnet.private_b.id
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
  ]
}

# This is the blueprint for our group of worker servers (the "kitchen staff")
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "app-workers"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  # Our containers will run in the private subnets for security.
  subnet_ids      = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  # Defines the size and number of our servers
  instance_types = ["t3.medium"]
  scaling_config {
    desired_size = 2 # Start with 2 servers
    max_size     = 3 # Allow scaling up to 3
    min_size     = 1 # Allow scaling down to 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ec2_container_registry_read_only,
  ]
}