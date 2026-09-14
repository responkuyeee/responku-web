export type SignUpPayload = {
    name: string;
    email: string;
    password: string; // min 8 chars
    providerId: 'CREDENTIALS' | 'GOOGLE';
};

export type SignUpResponse = {
    data: {
        userId: string;
        name: string;
        email: string;
        role: string;
    };
    message: string;
};

export type SignInPayload = {
    email: string;
    password: string;
    providerId: 'CREDENTIALS' | 'GOOGLE';
};

export type SignInResponse = {
    data: {
        id: string;
        name: string;
        email: string;
    };
    message: string;
};

export type GetUserResponse = {
    data: {
        id: string;
        name: string;
        email: string;
        verifiedAt: Date | null; // ISO Date string
        image: string | null;
        roles: string[];
    };
    message: string;
};

export type ConfirmVerificationPayload = {
    email: string;
    otp: string;
};

export type ConfirmVerificationResponse = {
    data: {
        email: string;
    };
    message: string;
};

export type ResendVerificationPayload = {
    email: string;
};

export type ResendVerificationResponse = {
    data: {
        email: string;
    };
    message: string;
};

export type SignOutResponse = {
    message: string;
};
