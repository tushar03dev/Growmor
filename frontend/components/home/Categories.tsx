import Link from "next/link"
import Image from "next/image"

interface CategoriesProps {
  categories: any[]
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find the perfect plants for every space and style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/plants?category=${category._id}`}
              className="group relative overflow-hidden rounded-lg aspect-[4/3]"
            >
              <Image
                src={
                  category.image ||
                  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
