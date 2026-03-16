// redux/api/serviceApi.ts
import { baseApi } from "./baseApi";
import { IServiceResponse } from "@/types/service";

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query<IServiceResponse, void>({
            query: () => "/services",
            providesTags: ["Service"],
        }),
    }),
});

export const { useGetAllServicesQuery } = serviceApi;
