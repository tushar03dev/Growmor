import { Leaf, Truck, Heart, Phone } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Healthy Plants Guaranteed",
    description:
      "All our plants are carefully inspected and nurtured before shipping to ensure they reach you in perfect health.",
  },
  {
    icon: Truck,
    title: "Fast & Careful Delivery",
    description: "We use specialized packaging to protect plants during transit and offer express shipping options.",
  },
  {
    icon: Heart,
    title: "30-Day Plant Guarantee",
    description: "Not happy with your purchase? We'll replace it or refund your money within 30 days of delivery.",
  },
  {
    icon: Phone,
    title: "Expert Support",
    description: "Our team of plant specialists are available to help with care tips and troubleshooting.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-growmor-green-pale">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose GROWMOR?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the highest quality plants and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-growmor-green-light/20 text-growmor-green-dark mb-5">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
