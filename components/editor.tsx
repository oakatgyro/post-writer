"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import TextareaAutosize from "react-textarea-autosize"
import { useEffect, useState, useCallback, useRef } from "react";
import EditorJS from '@editorjs/editorjs';
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import { Post } from "@prisma/client";
import  { useForm } from  "react-hook-form"
import  { zodResolver } from  "@hookform/resolvers/zod"
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";


interface EditorProps {
    post: Pick<Post, "id" | "title" | "content" | "published">
}

export default function Editor({post}: EditorProps) {
    const ref = useRef<EditorJS>()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const body = postPatchSchema.parse(post)

    const initializeEditor = useCallback(async () => {
        const editor = new EditorJS({
            holder: 'editor',
            onReady: () => {
                ref.current = editor
            },
            placeholder: 'Let`s write an awesome story!',
            inlineToolbar: true,
            data: body.content,
            tools: {
                header: Header,
                linkTool: LinkTool,
                list: List,
                code: CodeTool
            }
        })
    }, [post])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])
    
    useEffect(() => {
        if(isMounted) {
            initializeEditor()
        }

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }, [isMounted, initializeEditor])

    const { register, handleSubmit, formState: {errors} } = useForm<postPatchSchemaType>({
        resolver: zodResolver(postPatchSchema),
    })

    const onSubmit = async (data: postPatchSchemaType) => {
        setIsSaving(true)
        const blocks = await ref.current?.save()

        console.log("blocks", blocks)
        
        const res = await fetch(`/api/posts/${post.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: data.title,
                content: blocks
            })
        })
        setIsSaving(false)

        if (!res.ok) {
            return toast({
                title: "Failed to save post",
                description: "Please try again",
                variant: "destructive"
            })
        }
        router.refresh()

        return toast({
            title: "Post saved",
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full gap-10">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <Link
                            href={"/dashboard"}
                            className={cn(buttonVariants({ variant: "ghost"}))}
                        >
                            戻る
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            公開
                        </p>
                            
                    </div>
                    <button
                        className={cn(buttonVariants())}
                        type="submit"
                    >
                        {isSaving && (
                            <Icon.spinner className="mr-2 w-4 h-4 animate-spin" />
                        )}
                        保存
                    </button>
                </div>
                <div className="w-[800px] mx-auto">
                    <TextareaAutosize
                        id="title"
                        autoFocus
                        defaultValue={post.title}
                        placeholder="Post title"
                        className="w-full resize-none overflow-hidden bg-transparent text-5xl focus:outline-none"
                        {...register("title")}
                    >
                    </TextareaAutosize>
                </div>
                <div id="editor" className="min-h-[500px]">

                </div>
                <p className="text-sm text-gray-500">
                    Use
                    <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                        Tab
                    </kbd>
                    to open the command menu
                </p>
            </div>
        </form>
    )
}