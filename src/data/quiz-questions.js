export const quizQuestions = [
  {
    question: "What is the principle of least privilege in IAM?",
    options: [
      "Users should have maximum permissions for convenience",
      "Users should have only the minimum permissions necessary to perform their job",
      "All users should have the same permissions",
      "Permissions should be granted based on seniority"
    ],
    correct: 1,
    explanation: "The principle of least privilege states that users should have only the minimum permissions necessary to perform their job functions."
  },
  {
    question: "Which AWS service is used for managed encryption key management?",
    options: ["IAM", "KMS", "S3", "CloudTrail"],
    correct: 1,
    explanation: "AWS Key Management Service (KMS) provides managed encryption key management for AWS services and applications."
  },
  {
    question: "What is the purpose of a NAT instance in a VPC?",
    options: [
      "To allow inbound traffic from the internet",
      "To provide DNS resolution",
      "To allow outbound internet access for private subnets",
      "To encrypt network traffic"
    ],
    correct: 2,
    explanation: "A NAT instance allows instances in private subnets to access the internet while remaining protected from inbound traffic."
  },
  {
    question: "What does Zero Trust architecture emphasize?",
    options: [
      "Trust all internal network traffic",
      "Never trust, always verify",
      "Trust based on IP address",
      "Trust after initial authentication"
    ],
    correct: 1,
    explanation: "Zero Trust follows 'Never trust, always verify' - no user or device should be trusted by default."
  },
  {
    question: "Which service provides automated threat detection in AWS?",
    options: ["CloudWatch", "CloudTrail", "GuardDuty", "Config"],
    correct: 2,
    explanation: "Amazon GuardDuty provides intelligent threat detection by continuously monitoring for malicious activity."
  },
  {
    question: "What does an explicit Deny in IAM policy do?",
    options: [
      "Allows the action by default",
      "Overrides any Allow statements",
      "Has the same effect as no policy",
      "Only works for root users"
    ],
    correct: 1,
    explanation: "An explicit Deny always overrides any Allow statements, making it the strongest policy mechanism in AWS IAM."
  },
  {
    question: "Why is ScheduleKeyDeletion denied in the KMS policy?",
    options: [
      "To reduce AWS costs",
      "To prevent accidental or malicious key deletion that would make data unrecoverable",
      "KMS doesn't support key deletion",
      "Only CloudTrail can delete keys"
    ],
    correct: 1,
    explanation: "Denying key deletion prevents accidental or malicious destruction of encryption keys, which would make all encrypted data permanently unrecoverable."
  },
  {
    question: "What does Pod Security Standards 'restricted' enforce in Kubernetes?",
    options: [
      "Only HTTP traffic allowed",
      "Pods must run as root",
      "Non-root, no privilege escalation, dropped capabilities",
      "Unlimited resource usage"
    ],
    correct: 2,
    explanation: "The 'restricted' policy enforces running as non-root, disabling privilege escalation, and dropping all capabilities for maximum container security."
  },
];
