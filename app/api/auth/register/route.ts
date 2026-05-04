import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Check existing email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ success: false, error: "Email sudah digunakan" }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    // Create session
    await createSession({
      userId: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("[REGISTER API]", error);
    return NextResponse.json(
      { success: false, error: "Gagal mendaftar" },
      { status: 500 }
    );
  }
}
