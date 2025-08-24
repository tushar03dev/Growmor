import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GROWMOR</h3>
            <p className="text-muted-foreground">
              Premium plants for your home and garden. Quality guaranteed.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/plants"
                  className="text-muted-foreground hover:text-primary"
                >
                  All Plants
                </Link>
              </li>
              <li>
                <Link
                  href="/plants?category=indoor+plants"
                  className="text-muted-foreground hover:text-primary"
                >
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link
                  href="/plants?category=outdoor+plants"
                  className="text-muted-foreground hover:text-primary"
                >
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link
                  href="/plants?category=succulents"
                  className="text-muted-foreground hover:text-primary"
                >
                  Succulents
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/care-guide"
                  className="text-muted-foreground hover:text-primary"
                >
                  Plant Care Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GROWMOR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
