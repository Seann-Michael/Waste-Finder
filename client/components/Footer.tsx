import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted mt-auto">
      {/* Business Owner CTA Section */}
      <section className="py-8 md:py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Dumpster Rental & Junk Removal Business?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
            Get more customers with our digital marketing services designed
            specifically for dumpster rental and junk removal companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="text-base md:text-lg px-6 md:px-8"
            >
              <a
                href="https://yourmarketingagency.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Grow Your Business
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg px-6 md:px-8"
              asChild
            >
              <Link to="/resources">Learn More</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Specialized SEO, local marketing, and lead generation for dumpster
            rental and junk removal services
          </p>
        </div>
      </section>

      {/* Footer Content */}
      <div className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg md:text-xl font-bold">DumpNearMe</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The most comprehensive database of waste disposal locations in
                the United States.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Location Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/all-locations"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Browse All Locations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Industry News
                  </Link>
                </li>
                <li>
                  <Link
                    to="/suggest-location"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Suggest Location
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Junk Removal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/digital-marketing-junk-removal"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/local-seo-junk-removal"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Local SEO Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lead-generation-junk-removal"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Lead Generation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/local-junk-removal"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Local Junk Removal Companies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Dumpster Rental</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/digital-marketing-dumpster-rental"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/local-seo-dumpster-rental"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Local SEO Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lead-generation"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Lead Generation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/local-dumpster-rental"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Local Dumpster Rental Companies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Admin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/admin-login"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sitemap"
                    className="hover:text-primary py-1 px-1 block"
                  >
                    Sitemap
                  </Link>
                </li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
            <div className="mb-2">© 2024 DumpNearMe. All rights reserved.</div>
            <div>
              Powered by{" "}
              <a
                href="https://localcontractorleads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LeadGen
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
