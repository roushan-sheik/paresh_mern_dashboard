// types/staff.ts
import { IUser } from "./auth";

export interface IBranch {
    _id: string;
    branch_name: string;
    location: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}

export interface IStaff extends IUser {
    // Extend IUser with staff-specific fields
    branch: IBranch | null; // Populated branch data
    designation: string;
    status: "active" | "inactive";
    joiningDate: string;
}

export interface IStaffResponse {
    success: boolean;
    message: string;
    data: {
        staffs: any[]; // Using any[] temporarily, or mapping to a more specific type if we define it based on the response. The response has 'user' (name, email) and 'branch'.
        pagination?: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface IBranchResponse {
    success: boolean;
    message: string;
    data: IBranch[];
}
