"use server";

import { getJwtSecretKey, TOKEN_NAME } from "../lib/auth";
import prisma from "../lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function currentUser() {
  try {
    const token = (await cookies()).get(TOKEN_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecretKey());
    if (!payload.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        email: true,
        businessName: true,
        address: true,
        phone: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function updateProfile({
  username,
  email,
  businessName,
  address,
  phone,
}: {
  username: string;
  email: string;
  businessName?: string;
  address?: string;
  phone?: string;
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { username, email, businessName, address, phone },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating profile." };
  }
}

export async function updatePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!dbUser) return { error: "User not found." };

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      dbUser.password,
    );
    if (!passwordMatch) return { error: "Current password is incorrect." };

    if (newPassword !== confirmPassword)
      return { error: "Passwords do not match." };

    if (newPassword.length < 8)
      return { error: "Password must be at least 8 characters." };

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating password." };
  }
}
