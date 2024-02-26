import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get("Stripe-Signature") as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error: any) {
		console.log("[WEBHOOK Error]", error);
		return new NextResponse(`Webhook Error : ${error.message}`, {
			status: 400,
		});
	}

	const session = event.data.object as Stripe.Checkout.Session;
	console.log("[SESSION]", session);
	const userId = session?.metadata?.userId;
	const courseId = session?.metadata?.chapterId;

	console.log("USER_ID", userId);
	console.log("COURSE_ID", courseId);
	if (event.type === "checkout.session.completed") {
		console.log("USER_ID", userId);
		console.log("COURSE_ID", courseId);
		if (!userId || !courseId) {
			return new NextResponse(`Webhook Error : Missing metadata `, {
				status: 400,
			});
		}
		const purchaseInfo = await db.purchase.create({
			data: {
				userId: userId,
				courseId: courseId,
			},
		});
		console.log("PURCHASE_INFO", purchaseInfo);
	} else {
		return new NextResponse(
			`Webhook Error :Unhandled event type ${event.type} `,
			{ status: 200 }
		);
	}
	return new NextResponse(null, { status: 200 });
}
