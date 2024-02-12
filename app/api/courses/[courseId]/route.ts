import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		let { userId } = auth();
		console.log(userId);

		if (!userId) {
			userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		}
		// let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		const { courseId } = params;
		const values = await req.json();
		console.log(courseId);
		console.log("[COURSE_ID]", courseId);

		// console.log(values);
		if (!userId) {
			return new NextResponse("Unauthorized ", { status: 401 });
		}
		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[COURSE_ID]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
