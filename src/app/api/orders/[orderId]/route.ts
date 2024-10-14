import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function PUT(request: Request, { params }: { params: { orderId: string } }) {
    const { orderId } = params;
    const { shippingLabel } = await request.json();

    if (!shippingLabel) {
        return NextResponse.json({ error: "Shipping label is required" }, { status: 400 });
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { shippingLabel },
        });
        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update shipping label" }, { status: 500 });
    }
}
