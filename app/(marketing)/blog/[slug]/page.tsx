import { allPosts } from "@/.contentlayer/generated"
import Mdx from "@/components/mdx-component";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Metadata } from "next";
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Params {
    slug: string
}


async function getPostFromSlug(slug: string) {
    // This is where you would fetch the post from the CMS
    return allPosts.find((post) => post.slugAsParams === slug)
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    
    const page = await getPostFromSlug(params.slug)

    if (!page) {
        return {}
    }

    return {
        title: page.title,
        description: page.description,
        openGraph: {
            title: siteConfig.name,
            description: page.description,
            type: "article",
            locale: "ja_JP",
            url: siteConfig.url,
            siteName: siteConfig.name,
            images: [
                {
                    url: page.image,
                    width: 720,
                    height: 405,
                    alt: page.title
                }
            ]
        },
    }
}



export default async function PostPage({ params }: { params: Params }) {
    const slug  = params.slug
    const post = await getPostFromSlug(slug)

    if (!post) {
        notFound()
    }
        
  return (
    <article className="container max-w-3xl py-6 lg:py-10">
        <div>
            {post.date && (
                <time>
                    Published on {format(post.date, "yyyy/MM/dd")}
                </time>
            )}
            <h1 className="text-4xl font-extrabold mt-2 lg:text-5xl leading-tight">
                {post.title}
            </h1>
        </div>
        {post.image && (
            <Image
                src={post.image}
                alt={post.title}
                width={720}
                height={405} 
                className="my-8 border rounded-md bg-muted"
            />
        )}
        <Mdx code={post.body.code} />
        <hr className="mt-12" />
        <div className="py-6 text-center lg:py-10">
            <Link href={"/blog"} className={cn({ variant: "ghost"})}>
                Check All Posts
            </Link>
        </div>

            
    </article>
  )
}
