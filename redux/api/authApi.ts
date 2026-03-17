import { ILoginInput, ILoginResponse } from "@/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILoginInput>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
        updatePassword: builder.mutation<{ success: boolean; message: string }, any>({
            query: (data) => ({
                url: "/auth/update-password",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useUpdatePasswordMutation } = authApi;
