import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { postPatchSchema } from "@/lib/validations/post";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const routeContextSchema = z.object({
    params: z.object({
        postId: z.string()
    })
})

export async function PATCH(req: NextRequest, content: z.infer<typeof routeContextSchema>) {

    try {
        const { params } = routeContextSchema.parse(content);

        if (!await verifyCurrentUserHasAccessToPost(params.postId)) {
            return NextResponse.json("Unauthorized", { status: 403 });
        }
        
        const json = await req.json();
        const body = postPatchSchema.parse(json);

        await db.post.update({
            where: {
                id: params.postId
            },
            data: {
                title: body.title,
                content: body.content
            }
        })
        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(error.issues, { status: 422 });
        } else {
            return NextResponse.json(null, { status: 500 });
        }
    }
}

export async function DELETE(req: NextRequest, content: z.infer<typeof routeContextSchema>) {

    try {
        const { params } = routeContextSchema.parse(content);

        if (!await verifyCurrentUserHasAccessToPost(params.postId)) {
            return NextResponse.json("Unauthorized", { status: 403 });
        }
        

        await db.post.delete({
            where: {
                id: params.postId
            }
        })
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(error.issues, { status: 422 });
        } else {
            return NextResponse.json(null, { status: 500 });
        }
    }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
    const session = await getServerSession(authOptions);
    const count = await db.post.count({
        where: {
            id: postId,
            authorId: session?.user.id
        },
    });

    return count > 0;

}
