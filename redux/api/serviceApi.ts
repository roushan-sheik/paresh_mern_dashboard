// redux/api/serviceApi.ts
import { baseApi } from "./baseApi";
import { IServiceResponse } from "@/types/service";

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllServices: builder.query<IServiceResponse, void>({
            query: () => "/services",
            providesTags: ["Service"],
        }),
        createService: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/services",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),
    }),
});

export const { useGetAllServicesQuery, useCreateServiceMutation } = serviceApi;
