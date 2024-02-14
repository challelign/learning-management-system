"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import axios from "axios";
interface ChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
}
const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
			toast.success("Chapter deleted");

			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex ice gap-x-2">
			<Button
				onClick={() => {}}
				disabled={disabled || isLoading}
				value="outline"
				size="sm"
			>
				{isPublished ? "Unpublished" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm">
					<Trash />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default ChapterActions;
