import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		let { userId } = auth();
		console.log(userId);
		userId = "659804040fd75fd95096cb02";
		const { title } = await req.json();
		// console.log("title", title);
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
