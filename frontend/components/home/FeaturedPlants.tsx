import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { formatPrice } from "../../lib/utils"

interface FeaturedPlantsProps {
  trendingPlants: any[]
  bestSellerPlants: any[]
}

export default function FeaturedPlants({ trendingPlants, bestSellerPlants }: FeaturedPlantsProps) {
  return (
    <>
      {/* Trending Plants */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending Plants</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular plants that everyone's talking about
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingPlants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/plants?filter=trending">
              <Button variant="outline" size="lg">
                View All Trending Plants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-growmor-green-pale">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our customers' favorite plants that never go out of style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerPlants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/plants?filter=bestsellers">
              <Button variant="outline" size="lg">
                View All Best Sellers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function PlantCard({ plant }: { plant: any }) {
  const discountedPrice = plant.price * (1 - plant.discountPercentage / 100)

  return (
    <Link href={`/plants/${plant._id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="relative aspect-square">
          <Image
            src={plant.images[0]?.url || "/placeholder-plant.jpg"}
            alt={plant.name}
            fill
            className="object-cover"
          />
          {plant.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              {plant.discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-growmor-green-dark transition-colors">{plant.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{plant.description}</p>
          <div className="flex items-center justify-between">
            <div>
              {plant.discountPercentage > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-growmor-green-dark">{formatPrice(discountedPrice)}</span>
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(plant.price)}</span>
                </div>
              ) : (
                <span className="font-bold text-growmor-green-dark">{formatPrice(plant.price)}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{plant.category?.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
