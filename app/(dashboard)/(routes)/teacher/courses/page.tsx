 
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursesPage = async () => {
	// let { userId } = auth();

	let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";
	if (!userId) {
		return redirect("/");
	}
	const course = await db.course.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return (
		<div className="p-6">
			<DataTable columns={columns} data={course} />
		</div>
	);
};

export default CoursesPage;
