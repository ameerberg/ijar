import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Turo</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="/team" className="text-sm text-gray-600 hover:text-gray-900">
                  Team
                </a>
              </li>
              <li>
                <a href="/policies" className="text-sm text-gray-600 hover:text-gray-900">
                  Policies
                </a>
              </li>
              <li>
                <a href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="/press" className="text-sm text-gray-600 hover:text-gray-900">
                  Press
                </a>
              </li>
              <li>
                <a href="/openroad" className="text-sm text-gray-600 hover:text-gray-900">
                  OpenRoad
                </a>
              </li>
              <li>
                <a href="/shop" className="text-sm text-gray-600 hover:text-gray-900">
                  Turo shop
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Locations</h3>
            <ul className="space-y-3">
              <li>
                <a href="/us" className="text-sm text-gray-600 hover:text-gray-900">
                  USA (EN)
                </a>
              </li>
              <li>
                <a href="/au" className="text-sm text-gray-600 hover:text-gray-900">
                  Australia (EN)
                </a>
              </li>
              <li>
                <a href="/ca" className="text-sm text-gray-600 hover:text-gray-900">
                  Canada (EN)
                </a>
              </li>
              <li>
                <a href="/ca-fr" className="text-sm text-gray-600 hover:text-gray-900">
                  Canada (FR)
                </a>
              </li>
              <li>
                <a href="/fr" className="text-sm text-gray-600 hover:text-gray-900">
                  France (FR)
                </a>
              </li>
              <li>
                <a href="/uk" className="text-sm text-gray-600 hover:text-gray-900">
                  UK (EN)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a href="/why" className="text-sm text-gray-600 hover:text-gray-900">
                  Why choose Turo
                </a>
              </li>
              <li>
                <a href="/weddings" className="text-sm text-gray-600 hover:text-gray-900">
                  Weddings
                </a>
              </li>
              <li>
                <a href="/pitch" className="text-sm text-gray-600 hover:text-gray-900">
                  Pitch a trip
                </a>
              </li>
              <li>
                <a href="/trust-safety" className="text-sm text-gray-600 hover:text-gray-900">
                  Trust & safety
                </a>
              </li>
              <li>
                <a href="/help" className="text-sm text-gray-600 hover:text-gray-900">
                  Get help
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li>
                <a href="/list-your-car" className="text-sm text-gray-600 hover:text-gray-900">
                  List your car
                </a>
              </li>
              <li>
                <a href="/calculator" className="text-sm text-gray-600 hover:text-gray-900">
                  Calculator
                </a>
              </li>
              <li>
                <a href="/all-star-hosts" className="text-sm text-gray-600 hover:text-gray-900">
                  All-Star Hosts
                </a>
              </li>
              <li>
                <a href="/host-tools" className="text-sm text-gray-600 hover:text-gray-900">
                  Host tools
                </a>
              </li>
              <li>
                <a href="/insurance" className="text-sm text-gray-600 hover:text-gray-900">
                  Insurance & protection
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Follow</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <a
              href="/blog"
              className="inline-block px-4 py-2 text-xs font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              BLOG
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Turo Clone. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <span className="text-lg">🇺🇸</span>
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}