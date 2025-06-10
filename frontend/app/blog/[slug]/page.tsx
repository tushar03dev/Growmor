"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/components/blog-card"
import { dummyBlogPosts } from "@/lib/dummy-data"
import { formatDate } from "@/lib/utils"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPost = dummyBlogPosts.find((p) => p.slug === params.slug)
    if (foundPost) {
      setPost(foundPost)
    } else {
      router.push("/blog")
    }
  }, [params.slug, router])

  if (!post) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground mt-2">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/blog")} className="mt-4">
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <article className="max-w-4xl mx-auto">
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

          <div className="whitespace-pre-wrap">{post.content}</div>

          {/* Extended content for demo */}
          <h2>Getting Started with Plant Care</h2>
          <p>
            Caring for plants can seem daunting at first, but with the right knowledge and approach, anyone can become a
            successful plant parent. The key is understanding that each plant has its own unique needs and preferences.
          </p>

          <h3>Understanding Light Requirements</h3>
          <p>
            Light is one of the most crucial factors in plant care. Most houseplants fall into one of three categories:
            low light, medium light, or bright light. Understanding these requirements will help you place your plants
            in the right spots in your home.
          </p>

          <ul>
            <li>
              <strong>Low light:</strong> North-facing windows or areas away from windows
            </li>
            <li>
              <strong>Medium light:</strong> East or west-facing windows
            </li>
            <li>
              <strong>Bright light:</strong> South-facing windows or very bright rooms
            </li>
          </ul>

          <h3>Watering Best Practices</h3>
          <p>
            Overwatering is one of the most common mistakes new plant parents make. Most plants prefer to dry out
            slightly between waterings. A good rule of thumb is to stick your finger about an inch into the soil - if
            it's dry, it's time to water.
          </p>

          <h3>Creating the Right Environment</h3>
          <p>
            Beyond light and water, plants also need the right humidity and temperature. Most houseplants prefer
            temperatures between 65-75°F and humidity levels around 40-50%. You can increase humidity by grouping plants
            together, using a humidifier, or placing plants on pebble trays filled with water.
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyBlogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <div key={relatedPost.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{relatedPost.excerpt}</p>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${relatedPost.slug}`)}>
                    Read More
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </article>
    </div>
  )
}
