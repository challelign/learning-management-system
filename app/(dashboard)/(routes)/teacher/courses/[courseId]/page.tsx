import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

// courseId must be the same as [courseId]
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();
	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
	});
	return <div>Course Id Page {params.courseId}</div>;
};

export default CourseIdPage;
