import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		  	let { userId } = auth();
	 
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
		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
		});
		if (!chapter) {
			return new NextResponse("No Found ", { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});
			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}
		}
		const deletedChapter = await db.chapter.delete({
			where: {
				id: chapterId,
			},
		});
		// finding all published chapters
		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: courseId,
				isPublished: true,
			},
		});
		// if no published chapter then set the entire course to be unpublished
		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}
		return NextResponse.json(deletedChapter);
	} catch (error) {
		console.log("[COURSE_ID_DELETE] ", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
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
		if (values.videUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});
			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}
			const asset = await Video.Assets.create({
				input: values.videUrl,
				playback_policy: "public",
				test: false,
			});
			await db.muxData.create({
				data: {
					chapterId: chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0].id,
				},
			});
		}
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[COURSE_CHAPTERS_ID] ", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
