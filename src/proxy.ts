import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  UserRole,
  getDefaultDashboardRoute,
  getRouteOwner,
  isValidRouteForRole,
} from "@/utils/auth-utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const routeOwner = getRouteOwner(pathname);

  if (routeOwner === null) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let userRole: UserRole;

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    userRole = decoded.role as UserRole;
  } catch {
    const response = NextResponse.redirect(
      new URL("/error?reason=session-expired", request.url),
    );

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }

  if (!isValidRouteForRole(pathname, userRole)) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.well-known).*)",
  ],
};