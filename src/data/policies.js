export const doctorPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DoctorEMRAccess",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::medicloud-records/hospitalA/*",
        "arn:aws:s3:::medicloud-records"
      ],
      "Condition": {
        "StringLike": { "s3:prefix": "hospitalA/*" }
      }
    },
    {
      "Sid": "DenyS3Write",
      "Effect": "Deny",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:DeleteBucket", "s3:PutBucketPolicy", "s3:DeleteBucketPolicy"],
      "Resource": "*"
    },
    {
      "Sid": "DenyNonHospitalA",
      "Effect": "Deny",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::medicloud-records/*"],
      "Condition": {
        "StringNotLike": { "s3:prefix": "hospitalA/*" }
      }
    }
  ]
}`;

export const billerPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BillerS3ReadOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::*", "arn:aws:s3:::*/*"]
    },
    {
      "Sid": "DenyS3Write",
      "Effect": "Deny",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:DeleteBucket", "s3:PutBucketPolicy", "s3:DeleteBucketPolicy", "s3:PutBucketAcl", "s3:PutObjectAcl"],
      "Resource": "*"
    },
    {
      "Sid": "DenySensitiveBuckets",
      "Effect": "Deny",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::medicloud-records/hospitalA/*"]
    }
  ]
}`;

export const devUserPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DevUserS3ReadOnly",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": "*"
    },
    {
      "Sid": "DenyAllExceptS3Read",
      "Effect": "Deny",
      "NotAction": [
        "s3:GetObject",
        "s3:ListBucket",
        "iam:GetUser",
        "iam:ChangePassword"
      ],
      "Resource": "*"
    }
  ]
}`;

export const opsUserPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "OpsUserEC2Full",
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    },
    {
      "Sid": "DenyAllS3",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}`;

export const kmsPolicy = `{
  "Version": "2012-10-17",
  "Id": "medicloud-key-policy",
  "Statement": [
    {
      "Sid": "Allow Doctor Role",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::502339147379:role/DoctorRole" },
      "Action": ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
      "Resource": "*"
    },
    {
      "Sid": "Allow Biller User",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::502339147379:user/biller" },
      "Action": ["kms:Decrypt", "kms:DescribeKey"],
      "Resource": "*"
    },
    {
      "Sid": "Allow CloudTrail",
      "Effect": "Allow",
      "Principal": { "Service": "cloudtrail.amazonaws.com" },
      "Action": ["kms:GenerateDataKey*", "kms:DescribeKey"],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "kms:EncryptionContext:aws:cloudtrail:arn": ["arn:aws:cloudtrail:*:502339147379:trail/*"]
        }
      }
    },
    {
      "Sid": "Deny Key Deletion",
      "Effect": "Deny",
      "Principal": { "AWS": "*" },
      "Action": ["kms:ScheduleKeyDeletion", "kms:DeleteKey"],
      "Resource": "*"
    }
  ]
}`;
