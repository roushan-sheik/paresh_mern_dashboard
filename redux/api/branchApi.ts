// redux/api/branchApi.ts
import { baseApi } from "./baseApi";
import { IBranch, IBranchResponse } from "@/types/staff";

export const branchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // get all branches
        getAllBranches: builder.query<IBranchResponse, string | void>({
            query: (search) => ({
                url: "/branches",
                params: search ? { search } : {},
            }),
            providesTags: ["Branch"],
        }),

        // add branch
        addBranch: builder.mutation<{ success: boolean; message: string; data: IBranch }, Partial<IBranch>>({
            query: (data) => ({
                url: "/branches",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Branch"],
        }),

        // update branch
        updateBranch: builder.mutation<{ success: boolean; message: string; data: IBranch }, { id: string; data: Partial<IBranch> }>({
            query: ({ id, data }) => ({
                url: `/branches/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Branch"],
        }),

        // delete branch
        deleteBranch: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/branches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Branch"],
        }),
    }),
});

export const {
    useGetAllBranchesQuery,
    useAddBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation
} = branchApi;
