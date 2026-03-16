// redux/api/packageApi.ts
import { baseApi } from "./baseApi";
import { IPackageResponse } from "@/types/package";

export const packageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // get all packages
        getAllPackages: builder.query<IPackageResponse, string>({
            query: (search = "") => `/packages?search=${search}`,
            providesTags: ["Package"],
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
    }),
});

export const { useGetAllPackagesQuery, useCreatePackageMutation } = packageApi;
