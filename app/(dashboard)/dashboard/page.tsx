import DashboardHeader from '@/components/dashboard-header'
import DashboardShell from '@/components/dashboard-shell'
import React from 'react'
import PostCreateButton from '@/components/post-create-button'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import PostItem from '@/components/post-item'

export default async function DashboardPage() {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader heading='記事投稿' text='記事の作成と管理'>
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {posts.length ? (
          <div className='divide-y border rounded-md'>
            {posts.map(post => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className='ml-2'>
            投稿がありません
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
