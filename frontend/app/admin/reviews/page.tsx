"use client"

import { useState, useEffect } from "react"
import { Search, Star, Trash2, Eye, AlertTriangle, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAllReviews, deleteReview, type Review } from "@/lib/api/admin"
import { useAuth } from "@/components/auth-provider"

const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
}

const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

export default function ReviewsPage() {
    const { isAdmin } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalReviews, setTotalReviews] = useState(0)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const reviewsPerPage = 10

    useEffect(() => {
        const fetchReviews = async () => {
            if (!isAdmin) return

            try {
                setIsLoading(true)
                setError(null)
                const response = await getAllReviews(currentPage, reviewsPerPage)
                setReviews(response.reviews)
                setTotalReviews(response.total)
            } catch (err) {
                console.error("Failed to fetch reviews:", err)
                setError("Failed to load reviews. Please try again.")
                setReviews([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchReviews()
    }, [isAdmin, currentPage])

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.plantId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
    })

    const handleDeleteReview = async (reviewId: string) => {
        try {
            setIsDeleting(reviewId)
            const success = await deleteReview(reviewId)
            if (success) {
                setReviews((prev) => prev.filter((review) => review._id !== reviewId))
                setTotalReviews((prev) => prev - 1)
                if (selectedReview && selectedReview._id === reviewId) {
                    setIsDialogOpen(false)
                    setSelectedReview(null)
                }
            } else {
                setError("Failed to delete review. Please try again.")
            }
        } catch (err) {
            console.error("Failed to delete review:", err)
            setError("Failed to delete review. Please try again.")
        } finally {
            setIsDeleting(null)
        }
    }

    const viewReviewDetails = (review: Review) => {
        setSelectedReview(review)
        setIsDialogOpen(true)
    }

    const reviewStats = {
        total: totalReviews,
        excellent: reviews.filter((r) => r.rating >= 4).length,
        good: reviews.filter((r) => r.rating === 3).length,
        poor: reviews.filter((r) => r.rating <= 2).length,
        avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0",
    }

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Review Management</h2>
                <p className="text-muted-foreground">Manage customer reviews and ratings</p>
                {error && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}
            </div>

            {/* Review Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.avgRating}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Excellent (4-5★)</CardTitle>
                        <Star className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.excellent}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Good (3★)</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.good}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Poor (1-2★)</CardTitle>
                        <Star className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.poor}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search reviews by customer, plant, or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Reviews Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading reviews...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Plant</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{review.userId.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{review.userId.name}</div>
                                                    <div className="text-sm text-muted-foreground">{review.userId.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {review.plantId.image?.imageUrl && (
                                                    <img
                                                        src={review.plantId.image.imageUrl || "/placeholder.svg"}
                                                        alt={review.plantId.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <span className="font-medium">{review.plantId.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <Badge className={getRatingBadgeColor(review.rating)}>{review.rating}/5</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs truncate">{review.comment || "No comment"}</div>
                                        </TableCell>
                                        <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => viewReviewDetails(review)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    disabled={isDeleting === review._id}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    {isDeleting === review._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Review Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                        <DialogDescription>Complete review information and management options</DialogDescription>
                    </DialogHeader>

                    {selectedReview && (
                        <div className="space-y-6">
                            {/* Customer and Plant Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Customer</h3>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>{selectedReview.userId.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedReview.userId.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedReview.userId.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Plant</h3>
                                    <div className="flex items-center gap-3">
                                        {selectedReview.plantId.image?.imageUrl && (
                                            <img
                                                src={selectedReview.plantId.image.imageUrl || "/placeholder.svg"}
                                                alt={selectedReview.plantId.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <p className="font-medium">{selectedReview.plantId.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Rating</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-6 w-6 ${
                                                    i < selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <Badge className={getRatingBadgeColor(selectedReview.rating)} variant="secondary">
                                        {selectedReview.rating}/5 Stars
                                    </Badge>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Comment</h3>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm">{selectedReview.comment || "No comment provided"}</p>
                                </div>
                            </div>

                            {/* Review Date */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Review Date</h3>
                                <p className="text-sm text-muted-foreground">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteReview(selectedReview._id)}
                                    disabled={isDeleting === selectedReview._id}
                                >
                                    {isDeleting === selectedReview._id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Review
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
