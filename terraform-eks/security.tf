resource "aws_security_group_rule" "vpc_to_nodes" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1" # "-1" means all protocols
  
  # This is the source: allow anything from within our VPC
  cidr_blocks       = [aws_vpc.main.cidr_block]
  
  # This is the destination: the main security group for our EKS cluster nodes
  security_group_id = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
  
  description       = "Allow all traffic from within the VPC to the EKS nodes"
}