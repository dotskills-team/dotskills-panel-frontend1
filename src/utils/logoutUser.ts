"use server"

import { deleteCookie } from "./tokenHandlers";

export const logoutUser = async () => {
    const logoutRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    console.log("logout res", logoutRes)
    await deleteCookie("refreshToken");
    await deleteCookie("accessToken");
}