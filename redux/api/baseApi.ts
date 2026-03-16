import { logout } from "@/store/slices/authSlice";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
        headers.set("Accept", "application/json");
        return headers;
    },
    credentials: "include", // Essential for cookies
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    if (isRefreshing) {
        await new Promise<void>((resolve) => { pendingRequests.push(resolve); });
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshResult = await baseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);

                if (refreshResult.data) {
                    const resolvePending = [...pendingRequests];
                    pendingRequests = [];
                    isRefreshing = false;
                    resolvePending.forEach((resolve) => resolve());
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    const resolvePending = [...pendingRequests];
                    pendingRequests = [];
                    isRefreshing = false;
                    resolvePending.forEach((resolve) => resolve());
                    api.dispatch(logout());
                    // NOTE: Do NOT call resetApiState() here — doing so clears the cache
                    // and causes useGetMeQuery to re-fire, creating an infinite 401 loop.
                }
            } catch {
                const resolvePending = [...pendingRequests];
                pendingRequests = [];
                isRefreshing = false;
                resolvePending.forEach((resolve) => resolve());
                api.dispatch(logout());
                // NOTE: Do NOT call resetApiState() here.
            }
        } else {
            await new Promise<void>((resolve) => { pendingRequests.push(resolve); });
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Staff", "Package", "Branch", "Service"],
    endpoints: () => ({}),
});
