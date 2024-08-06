import prisma from "@/db/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
    const newUser = await prisma.user.create({
        data: {
            name: 'Adosh',
            email: 'adosh@test2.com',
            password: 'password',
        }
    });

    return NextResponse.json({
        user: newUser
    })
    
}