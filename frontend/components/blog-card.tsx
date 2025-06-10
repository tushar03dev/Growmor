import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  slug: string
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="rounded-lg border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="mr-1 h-4 w-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2">{post.excerpt}</p>

          <div className="mt-4 text-sm font-medium text-primary">Read more</div>
        </div>
      </div>
    </Link>
  )
}
