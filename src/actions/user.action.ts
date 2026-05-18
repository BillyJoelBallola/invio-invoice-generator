"use server";

import { getJwtSecretKey, TOKEN_NAME } from "../lib/auth";
import prisma from "../lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function currentUser() {
  try {
    const token = (await cookies()).get(TOKEN_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecretKey());
    if (!payload.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, email: true },
    });

    return user;
  } catch {
    return null;
  }
}
