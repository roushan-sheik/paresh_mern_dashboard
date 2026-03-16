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
    }),
});

export const { useGetAllPackagesQuery } = packageApi;
