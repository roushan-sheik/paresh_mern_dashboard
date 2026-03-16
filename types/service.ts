export interface ISubSection {
    heading: string;
    description: string;
}

export interface IOverviewSection {
    heading: string;
    description: string;
    sub_sections: ISubSection[];
}

export interface IService {
    _id?: string;
    service_name: string;
    duration: number;
    cost: number;
    image: string | File;
    description: string;
    overview: IOverviewSection[];
}

export interface IServiceResponse {
    success: boolean;
    message: string;
    data: IService[];
}
