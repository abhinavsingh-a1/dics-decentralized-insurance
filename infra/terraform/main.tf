provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name = "dics-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  cluster_name    = "dics-cluster"
  cluster_version = "1.29"
  subnets         = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id
}

module "rds" {
  source = "terraform-aws-modules/rds/aws"
  identifier = "dics-db"
  engine = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  allocated_storage = 20
  db_name = "dicsdb"
  username = "admin"
  password = var.db_password
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  subnet_ids = module.vpc.private_subnets
}
