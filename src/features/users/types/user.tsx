export type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
}