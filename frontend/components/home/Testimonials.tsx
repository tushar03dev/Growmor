import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "The plants arrived in perfect condition and are thriving in my home. The Snake Plant I ordered has grown so much in just a few months!",
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
  {
    quote:
      "GROWMOR's customer service is exceptional. When I had questions about caring for my Fiddle Leaf Fig, they provided detailed guidance.",
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
  {
    quote:
      "I've ordered from many plant shops, but GROWMOR's packaging is the best by far. My plants arrived safely with no damage.",
    author: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy plant parents who trust GROWMOR for their green companions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <blockquote className="text-muted-foreground mb-4">"{testimonial.quote}"</blockquote>

              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
