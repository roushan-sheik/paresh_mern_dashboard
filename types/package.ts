// types/package.ts
export interface IPackage {
    _id: string;
    package_name: string;
    validity_duration: number; // in days
    cost: number;
    total_sessions: number;
    isDeleted?: boolean;
}

export interface IPackageResponse {
    success: boolean;
    message: string;
    count?: number;
    data: IPackage[];
}
