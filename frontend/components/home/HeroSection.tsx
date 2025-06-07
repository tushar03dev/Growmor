import Link from "next/link"
import { Button } from "../ui/button"

export default function HeroSection() {
  return (
    <section className="hero-gradient text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bring Nature
            <br />
            <span className="text-green-200">Into Your Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Discover our curated collection of premium plants, expert care guides, and everything you need to create
            your perfect green sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plants">
              <Button size="lg" variant="secondary" className="text-green-700">
                Shop Plants
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
