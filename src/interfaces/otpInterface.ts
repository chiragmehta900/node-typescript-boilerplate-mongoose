export interface IOtp {
    userId: any;
    type: string;
    otp: string;
    otpExpiration: Date | null;
}
