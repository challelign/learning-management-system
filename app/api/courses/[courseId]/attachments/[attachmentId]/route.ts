import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; attachmentId: string } }
) {
	try {
		let { userId } = auth();
		if (!userId) {
			userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
		}
		const { attachmentId } = params.attachmentId;
		const { courseId } = params.courseId;
		console.log(attachmentId);
		console.log(courseId);

		const courseOwner = await db.course.findUnique({
			where: {
				userId: userId,
				id: courseId,
			},
		});
		if (!courseOwner) {
			return new NextResponse("Unauthorized ", { status: 401 });
		}

		const attachment = await db.attachment.delete({
			where: {
				id: attachmentId,
				courseId: courseId,
			},
		});
		return NextResponse.json(attachment);
	} catch (error) {
		console.log("AttachmentID", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
