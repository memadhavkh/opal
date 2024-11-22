import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = req.json();
    const { id } = params;

    const completeProcessing = await client.video.update({
        where: {
            userId: id,
            source: body.filename
        },
        data: {
            processing: false
        }
    });
    if(completeProcessing) {
        return NextResponse.json({ status: 200, message: 'Processing completed' });
    }
    return NextResponse.json({ status: 400, message: 'Failed to complete processing' });
}