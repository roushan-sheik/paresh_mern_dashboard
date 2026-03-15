import { IUser } from "@/types/auth";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<{ success: boolean; data: IUser }, void>({
            query: () => "/users/me",
            providesTags: ["User"],
        }),
    }),
});

export const { useGetMeQuery } = userApi;
