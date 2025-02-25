import { format } from 'date-fns'
import { allPosts } from '@/.contentlayer/generated/index.mjs'
import Link from 'next/link'

export default function BlogPage() {
    const posts = allPosts
    return (
        <div className='container mx-max-w-4xl py-6 lg:py-10'>
            <div>
                <div className="space-y-4">
                    <h1 className='font-extrabold text-4xl lg:text-5xl tracking-tight'>
                        Blog🚀
                    </h1>
                    <p className='text-muted-foreground text-xl'>
                        ContentLayerとmdxで書いています。
                    </p>
                </div>
            </div>
            <hr className="my-8" />
            <div className='grid sm:grid-cols-2 gap-10'>
            {posts.map((post, index) => (
                <article key={post._id} className='relative flex flex-col space-y-2'>
                    {post.image && (
                        <img src={post.image} alt={post.title} width={804} height={452} 
                        className='rounded-md border bg-muted'
                        />
                    )}
                    <h2 className='text-2xl font-extrabold'>
                        {post.title}
                    </h2>
                    {post.description && (
                    <p className='text-muted-foreground'>{post.description}</p>
                    )}
                    {post.date && (
                        <p className='text-sm text-muted-foreground'>{format(post.date, "yyyy/MM/dd")}</p>
                    )}
                    <Link href={post.slug} className='absolute inset-0'>
                    </Link>
                </article>
            ))}
            </div>
        </div>
    )
}