

export interface Verification {
    userEmail: string;
    isVerified?: boolean;
    verificationToken?: string;
    isVerificationTokenExpired?: boolean;
    verificationTokenExpiresAt?: Date;
    resetPasswordToken?: string;
    isResetPasswordTokenExpired?: boolean;
    resetPasswordTokenExpiresAt?: Date;
    isSuspended?: boolean;
    suspendReason?: string;
    suspendStartDate?: Date;
    suspendEndDate?: Date;
    isPermanentlySuspended?: boolean;
}