import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";
import { FeaturedProducts } from "@/components/featured-products";
import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { CategorySection } from "@/components/category-section";
import { dummyBlogPosts } from "@/lib/dummy-data";

export default function Home() {
  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories Section */}
      <CategorySection />

      {/* Sale Products */}
      <FeaturedProducts
        title="Special Offers"
        subtitle="Limited time deals on premium plants"
        mode="sale"
      />

      {/* Blog Section */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Plant Care Tips</h2>
            <p className="text-muted-foreground">
              Learn how to keep your plants thriving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyBlogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="mb-6">
              Subscribe to receive plant care tips, exclusive offers, and
              updates on new arrivals.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md border border-primary-foreground/20 bg-transparent placeholder:text-primary-foreground/70"
                required
              />
              <Button variant="secondary">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
