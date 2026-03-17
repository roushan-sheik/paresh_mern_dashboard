// redux/api/packageApi.ts
import { baseApi } from "./baseApi";
import { IPackage, IPackageResponse } from "@/types/package";

export const packageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // get all packages
        getAllPackages: builder.query<IPackageResponse, string>({
            query: (search = "") => `/packages?search=${search}`,
            providesTags: ["Package"],
        }),

        // get package by id
        getPackageById: builder.query<{ success: boolean; data: IPackage }, string>({
            query: (id) => `/packages/${id}`,
            providesTags: (result, error, id) => [{ type: "Package", id }],
        }),

        // create new package
        createPackage: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/packages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Package"],
        }),

        // update package
        updatePackage: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/packages/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Package", { type: "Package", id }],
        }),

        // delete package
        deletePackage: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/packages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Package"],
        }),
    }),
});

export const { 
    useGetAllPackagesQuery, 
    useCreatePackageMutation, 
    useGetPackageByIdQuery, 
    useUpdatePackageMutation,
    useDeletePackageMutation 
} = packageApi;
