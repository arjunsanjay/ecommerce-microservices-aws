# --- 1. VPC ---
# This creates the main container for our network.
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "EKS-VPC"
  }
}

# --- 2. Subnets ---
# We create two public and two private subnets across different "Availability Zones"
# for high availability. This is like building in two separate physical data centers.
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "EKS-Public-Subnet-A"
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "EKS-Public-Subnet-B"
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "EKS-Private-Subnet-A"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "EKS-Private-Subnet-B"
  }
}

# --- 3. Internet Gateway & Public Routing ---
# The Internet Gateway is the main "front door" to the internet for our public subnets.
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "EKS-IGW"
  }
}

# This Route Table is the "signpost" for our public subnets. It says:
# "To get to the internet (0.0.0.0/0), go through the Internet Gateway."
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "EKS-Public-RT"
  }
}

# Associate our public subnets with this route table.
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public_rt.id
}

# --- 4. NAT Gateway & Private Routing ---
# The NAT Gateway is a secure "exit-only" door for our private subnets.
# It allows our backend services to reach the internet (e.g., to download updates)
# but prevents the internet from initiating connections to them.

# A NAT Gateway needs a static IP address to work.
resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id # It must live in a public subnet

  tags = {
    Name = "EKS-NAT-GW"
  }
}

# This Route Table is for our private subnets. It says:
# "To get to the internet (0.0.0.0/0), go through the NAT Gateway."
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "EKS-Private-RT"
  }
}

# Associate our private subnets with this route table.
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private_rt.id
}