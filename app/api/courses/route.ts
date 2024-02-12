import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		let { userId } = auth();
		console.log(userId);

		if (!userId) {
			userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		}
		console.log(userId);
		const { title } = await req.json();
		if (!userId) {
			return new NextResponse("Unauthorized ", { status: 401 });
		}
		const course = await db.course.create({
			data: {
				userId,
				title,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[COURSES]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
