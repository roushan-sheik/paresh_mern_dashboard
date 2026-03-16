// types/service.ts
export interface IService {
    _id: string;
    service_name: string;
    duration: number; // in minutes
    cost: number;
}

export interface IServiceResponse {
    success: boolean;
    message: string;
    data: IService[];
}
