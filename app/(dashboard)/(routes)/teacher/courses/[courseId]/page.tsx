import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";

// courseId must be the same as [courseId]
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	// let { userId } = auth();

	let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
	// console.log(userId);
	console.log(userId);

	if (!userId) {
		userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
	}

	// if (!userId) {
	// 	return redirect("/");
	// }
	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			userId,
		},
		include: {
			chapters: {
				orderBy: {
					position: "asc",
				},
			},
			attachments: {
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});
	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});
	console.log(categories);
	if (!course) {
		return redirect("/");
	}
	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];
	// console.log(requiredFields);
	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-medium">Course setup </h1>
					<span className="text-sm text-slate-700">
						Complete all fields{completionText}
					</span>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LayoutDashboard} />
						<h2 className="text-xl"> Customize your course</h2>
					</div>
					<div>
						<TitleForm initialData={course} courseId={course.id} />
					</div>
					<div>
						<DescriptionForm initialData={course} courseId={course.id} />
					</div>
					<div>
						<ImageForm initialData={course} courseId={course.id} />
					</div>
					<div>
						<CategoryForm
							initialData={course}
							courseId={course.id}
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
						/>
					</div>
				</div>
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={ListChecks} />
							<h2>Course Chapters</h2>
						</div>
						<div>
							<ChaptersForm initialData={course} courseId={course.id} />
						</div>
					</div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={CircleDollarSign} />
						<h2 className="text-4xl">Sell your course</h2>
					</div>
					<div>
						<PriceForm initialData={course} courseId={course.id} />
					</div>

					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={File} />
							<h2 className="text-4xl">Resources and Attachment</h2>
						</div>
						<div>
							<AttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseIdPage;
