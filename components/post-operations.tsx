"use client"

import { Post } from "@prisma/client"
import { DropdownMenu,DropdownMenuItem, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Icon } from "./icon"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

import { useState } from "react"
import { toast } from "./ui/use-toast"
import { useRouter } from "next/navigation"

  

interface PostOperationsProps {
    post: Pick<Post, 'id' | 'title'>
}

async function deletePost(postId: string) {
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error('Failed to delete post')
        }

        return true
    } catch (error) {
        toast({
            title: "Failed to delete post",
            description: "Failed to delete post, please try again",
            variant: "destructive"
        })
    }
}

export default function PostOperations( { post }: PostOperationsProps) {
    const router = useRouter()
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Icon.ellipsis className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`/editor/${post.id}`} className="w-full">
                        編集
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => setShowDeleteAlert(true)}
                    className="text-destructive cursor-pointer focus:text-destructive"
                >
                        削除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
                <AlertDialogDescription>
                    この操作は元に戻せません。
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-red-600 focus:ring-red-600"
                    onClick={async (e) => {
                        e.preventDefault()
                        setIsDeleteLoading(true)
                        const deleted = await deletePost(post.id)
                        if (deleted) {
                            setShowDeleteAlert(false)
                            setIsDeleteLoading(false)
                            router.refresh()
                        }
                    }}
                >
                    {isDeleteLoading ? (
                        <Icon.spinner className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                        <Icon.trash className="mr-2 h-4 w-4" />
                    )   
                    }
                    削除
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}