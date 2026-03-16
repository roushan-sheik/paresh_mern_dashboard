// types/package.ts
import { IOverviewSection } from "./service";

export interface IPackageService {
    service_id: string;
    required_sessions: number;
}

export interface IPackage {
    _id?: string;
    package_name: string;
    validity_duration: number;
    cost: number;
    description: string;
    image: string | File;
    total_sessions?: number; // Calculated field from backend for list view
    overview: IOverviewSection[];
    services: IPackageService[];
    isDeleted?: boolean;
}

export interface IPackageResponse {
    success: boolean;
    message: string;
    count?: number;
    data: IPackage[];
}
