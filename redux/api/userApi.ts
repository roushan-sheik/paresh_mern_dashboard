import { IUser } from "@/types/auth";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<{ success: boolean; data: IUser }, void>({
            query: () => "/users/me",
            providesTags: ["User"],
        }),
        updateMe: builder.mutation<{ success: boolean; data: IUser }, FormData>({
            query: (data) => ({
                url: "/users/me",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useGetMeQuery, useUpdateMeMutation } = userApi;
