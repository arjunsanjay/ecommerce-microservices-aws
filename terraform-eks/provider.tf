# This block tells Terraform we'll be using the AWS provider.
provider "aws" {
  # We'll use the region you've been using.
  region = "ap-south-1"
}

# This block configures Terraform itself and the required provider versions.
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}