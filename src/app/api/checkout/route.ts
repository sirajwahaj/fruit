import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number().int().min(1).max(99),
    })).min(1),
    addressId: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey || stripeKey === "sk_test_placeholder") {
            return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
        }

        const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = checkoutSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
        }

        const { items, addressId } = parsed.data;

        // Verify products and check stock
        const productIds = items.map((i) => i.id);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds }, published: true },
        });

        // Validate all products exist and have sufficient stock
        const errors: string[] = [];
        for (const item of items) {
            const product = products.find((p) => p.id === item.id);
            if (!product) {
                errors.push(`Product ${item.id} not found`);
            } else if (product.stock < item.quantity) {
                errors.push(`${product.name}: only ${product.stock} available (requested ${item.quantity})`);
            }
        }
        if (errors.length > 0) {
            return NextResponse.json({ error: "Stock validation failed", details: errors }, { status: 400 });
        }

        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
            const product = products.find((p) => p.id === item.id)!;
            subtotal += product.price * item.quantity;
        }

        const tax = subtotal * 0.08;
        const shipping = subtotal >= 75 ? 0 : 9.99;
        const total = subtotal + tax + shipping;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            metadata: { userId: session.user.id },
        });

        // Create pending order
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                addressId: addressId || null,
                subtotal,
                tax,
                shipping,
                total,
                paymentIntentId: paymentIntent.id,
                paymentStatus: "pending",
                items: {
                    create: items.map((item) => {
                        const product = products.find((p) => p.id === item.id)!;
                        const images = JSON.parse(product.images);
                        return {
                            productId: product.id,
                            quantity: item.quantity,
                            price: product.price,
                            name: product.name,
                            image: images[0] ?? null,
                        };
                    }),
                },
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            orderId: order.id,
            total,
            subtotal,
            tax,
            shipping,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
