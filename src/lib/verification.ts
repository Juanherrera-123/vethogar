export const verificationStatuses = ["pending", "approved", "rejected"] as const;

export type VerificationStatus = (typeof verificationStatuses)[number];

export type VerificationRecord = {
  id: string;
  vetId: string;
  status: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
};
