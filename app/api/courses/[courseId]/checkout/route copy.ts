import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Session } from "inspector";

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		let userId = "user_2c7WDRhRgaTXgF3G3JIaInZbQD4";

		/* 		const user = await currentUser();
		console.log("[user] =?", user);
		if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
			return new NextResponse("Unauthorized ", { status: 401 });
		} */

		if (!userId) {
			return new NextResponse("Unauthorized User not found", { status: 401 });
		}
		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				isPublished: true,
			},
		});
		// check if user purchase this course
		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					// userId: user.id,
					userId: userId,
					courseId: params.courseId,
				},
			},
		});
		console.log("[PURCHASE]", purchase);

		if (purchase) {
			return new NextResponse("Already purchased", { status: 400 });
		}

		if (!course) {
			return new NextResponse("Course not found ", { status: 404 });
		}
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				quantity: 1,
				price_data: {
					currency: "USD",
					product_data: {
						name: course.title,
						description: course.description!,
						images: [course.imageUrl!],
					},
					unit_amount: Math.round(course.price! * 100),
				},
			},
		];

		// check if stripeCustomer found in our database table stripeCustomer
		let stripeCustomer = await db.stripeCustomer.findUnique({
			where: {
				// userId: user.id,
				userId: userId,
			},
			select: {
				stripeCustomerId: true,
			},
		});
		//   if stripeCustomer not found, create a customer
		if (!stripeCustomer) {
			// save to stripe database
			const customer = await stripe.customers.create({
				// email: user.emailAddresses[0].emailAddress,
				email: "chalie2123@gmail.com",
			});

			// save to the database
			stripeCustomer = await db.stripeCustomer.create({
				data: {
					// userId: user.id,
					userId: userId,
					stripeCustomerId: customer.id,
				},
			});
			console.log("[stripeCustomer]", stripeCustomer);
		}
		const session = await stripe.checkout.sessions.create({
			customer: stripeCustomer.stripeCustomerId,
			line_items,
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
			metadata: {
				courseId: params.courseId,
				// userId: user.id,
				userId: userId,
			},
		});

		console.log("[SESSION]", session);
		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.log("[COURSE_ID_CHECKOUT]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
