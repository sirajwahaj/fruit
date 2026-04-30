import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
        return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object as Stripe.PaymentIntent;

        // Mark order as processing
        const orders = await prisma.order.findMany({
            where: { paymentIntentId: pi.id },
            include: { items: true },
        });

        for (const order of orders) {
            // Update order status
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "PROCESSING", paymentStatus: "paid" },
            });

            // Decrement stock for each item
            for (const item of order.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
        }
    }

    if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
            where: { paymentIntentId: pi.id },
            data: { paymentStatus: "failed" },
        });
    }

    return NextResponse.json({ received: true });
}
