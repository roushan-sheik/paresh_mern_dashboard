// redux/api/serviceApi.ts
import { baseApi } from "./baseApi";
import { IServiceResponse } from "@/types/service";

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // get all services
        getAllServices: builder.query<IServiceResponse, void>({
            query: () => "/services",
            providesTags: ["Service"],
        }),

        // create new service
        createService: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/services",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),

        // delete service
        deleteService: builder.mutation<any, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),

        // get single service details
        getServiceById: builder.query<any, string>({
            query: (id) => `/services/${id}`,
            providesTags: ["Service"],
        }),
        // update service
        updateService: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/services/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),
    }),
});

export const { useGetAllServicesQuery, useCreateServiceMutation, useDeleteServiceMutation, useGetServiceByIdQuery, useUpdateServiceMutation } = serviceApi;
