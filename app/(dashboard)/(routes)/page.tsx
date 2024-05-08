import { UserButton } from "@clerk/nextjs";

export default function Home() {
	return (
		<div className="justify-center">
			<UserButton afterSignOutUrl="/" />
		</div>
	);
}
