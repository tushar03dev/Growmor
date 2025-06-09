import Head from "next/head"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Head>
        <title>GROWMOR - Premium Plant Store</title>
        <meta name="description" content="Premium plants for your home and garden" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">GROWMOR</h1>
              </div>
              <nav className="flex space-x-8">
                <Link href="/" className="text-gray-900 hover:text-primary-600">
                  Home
                </Link>
                <Link href="/plants" className="text-gray-900 hover:text-primary-600">
                  Plants
                </Link>
                <Link href="/cart" className="text-gray-900 hover:text-primary-600">
                  Cart
                </Link>
                <Link href="/auth/signin" className="text-gray-900 hover:text-primary-600">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to GROWMOR</h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">Premium plants for your home and garden</p>
              <Link href="/plants" className="btn-secondary">
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Hand-picked plants with guaranteed quality</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and safe delivery to your doorstep</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">💚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
                <p className="text-gray-600">Professional care guides and support</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
