"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, MoveRight } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";

const NavbarRoutes = () => {
	const pathname = usePathname();
	const isTeacherPage = pathname?.startsWith("/teacher");
	const isCoursePage = pathname?.includes("/courses");

	const isSearchPage = pathname === "/search";
	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-2 ml-auto">
				{isCoursePage && (
					<Link
						href={`/teacher/courses/search`}
						className="flex items-center text-sm hover:opacity-75 transition mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to course
					</Link>
				)}
				{isTeacherPage || isCoursePage ? (
					<Link href="/">
						<Button size="sm" variant="ghost">
							<LogOut className="h-4 w-4 mr-2" />
							Exit
						</Button>
					</Link>
				) : (
					<Link href="/teacher/courses">
						<Button size="sm" variant="ghost">
							<MoveRight className="text-red-800 " /> Teacher mode
						</Button>
					</Link>
				)}
				{/* this help when we logout it will not redirect to clerk site */}
				<UserButton afterSignOutUrl="/" />
			</div>
		</>
	);
};

export default NavbarRoutes;
