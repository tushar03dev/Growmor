"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost } from "@/components/blog-card"
import { dummyBlogPosts } from "@/lib/dummy-data"
import { formatDate } from "@/lib/utils"

export default function AdminBlogPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: user?.name || "",
    slug: "",
  })

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/")
      return
    }

    // In a real app, this would be an API call
    setPosts(dummyBlogPosts)
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleAddPost = () => {
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: user?.name || "",
      slug: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      slug: post.slug,
    })
    setIsDialogOpen(true)
  }

  const handleSavePost = () => {
    const slug = formData.slug || generateSlug(formData.title)
    const postData: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image || "/placeholder.svg?height=400&width=800",
      author: formData.author,
      date: editingPost?.date || new Date().toISOString().split("T")[0],
      slug,
    }

    if (editingPost) {
      // Update existing post
      setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? postData : p)))
    } else {
      // Add new post
      setPosts((prev) => [...prev, postData])
    }

    setIsDialogOpen(false)
  }

  const handleDeletePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Blog</h1>
          <p className="text-muted-foreground">Create and manage your blog posts and articles</p>
        </div>
        <Button onClick={handleAddPost}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="relative aspect-video overflow-hidden rounded-md">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>By {post.author}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">/{post.slug}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Update the blog post information below."
                : "Fill in the details to create a new blog post."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: generateSlug(title),
                  }))
                }}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-slug"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the post"
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePost}>{editingPost ? "Update Post" : "Publish Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
