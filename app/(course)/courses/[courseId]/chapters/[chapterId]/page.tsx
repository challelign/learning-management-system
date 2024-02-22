import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import CourseProgressButton from "./_components/course-progress-button";

const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	// let { userId } = auth();
	let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
	if (!userId) {
		return redirect("/");
	}

	const {
		chapter,
		course,
		muxData,
		attachments,
		nextChapter,
		userProgress,
		purchase,
	} = await getChapter({
		userId,
		chapterId: params.chapterId,
		courseId: params.courseId,
	});
	if (!chapter || !course) {
		return redirect("/");
	}

	const isLocked = !chapter.isFree && !purchase;
	const completedOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You already completed this chapter" />
			)}
			{isLocked && (
				<Banner
					variant="warning"
					label="You need to purchase this course to watch this chapter"
				/>
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={params.chapterId}
						title={chapter.title}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						playbackId={muxData?.playbackId!}
						isLocked={isLocked}
						completeOnEnd={completedOnEnd}
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						{purchase ? (
							// TODO Add CourseProgressButton
							<CourseProgressButton
								chapterId={params.chapterId}
								courseId={params.courseId}
								nextChapterId={nextChapter?.id}
								isCompleted={!!userProgress?.isCompleted}
							/>
						) : (
							<CourseEnrollButton
								courseId={params.courseId}
								price={course.price!}
							/>
						)}
					</div>

					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!attachments.lastIndexOf && (
						<div className="p-4">
							{attachments.map((attachment) => (
								<a
									href={attachment.url}
									target="_blank"
									key={attachment.id}
									className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
								>
									<p className="line-clamp-1">{attachment.name}</p>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;