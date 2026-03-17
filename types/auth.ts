export interface IUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    blood_group?: string;
    image?: string;
    role: "admin" | "patient" | "staff";
    branch_id?: string;
    branch_name?: string;
    staff_id?: string;
    patient_id?: string;
}

export interface ILoginInput {
    email: string;
    password: string;
    role?: string;
}

export interface AuthState {
    user: IUser | null;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
    };
}
