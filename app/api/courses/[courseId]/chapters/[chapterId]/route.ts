import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		/* 	let { userId } = auth();
		if (!userId) {
			userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		} */
		let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		const { isPublished, ...values } = await req.json();
		const courseId = params.courseId;
		const chapterId = params.chapterId;

		// check the course owner
		const courseOwner = await db.course.findUnique({
			where: {
				id: courseId,
				userId: userId,
			},
		});
		if (!courseOwner) {
			return new NextResponse("Unauthorized ", { status: 401 });
		}
		if (!userId) {
			return new NextResponse("Unauthorized ", { status: 401 });
		}

		const chapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: {
				...values,
			},
		});
		// TODO: handle video update
		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[COURSE_CHAPTERS_ID] ", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
