import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { UserProfile } from "@/utils/types";
import {
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Calendar,
  Quote,
  Briefcase,
  Package,
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
  Mail,
  Phone,
  Users,
  Award,
  ShoppingBag,
  Zap,
} from "lucide-react";

interface DeluxeTemplateProps {
  profile: UserProfile;
  onLinkClick?: (linkId: string) => void;
}

const DeluxeTemplate: React.FC<DeluxeTemplateProps> = ({
  profile,
  onLinkClick,
}) => {
  const [galleryView, setGalleryView] = useState<"grid" | "list">("grid");

  const handleLinkClick = useCallback(
    (linkId: string, url: string) => {
      try {
        if (onLinkClick) {
          onLinkClick(linkId);
        }
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error handling link click:", error);
      }
    },
    [onLinkClick]
  );

  const formatBusinessHours = useCallback(
    (day: string) => {
      try {
        const hours =
          profile.businessHours?.[
            day.toLowerCase() as keyof typeof profile.businessHours
          ];
        if (!hours || !hours.isOpen) return "Closed";
        return `${hours.start} - ${hours.end}`;
      } catch (error) {
        console.error("Error formatting business hours:", error);
        return "Closed";
      }
    },
    [profile.businessHours]
  );

  const { activeLinks, featuredLinks, today } = useMemo(() => {
    const dayNames = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const today =
      dayNames[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const activeLinks = profile.links?.filter((link) => link.isActive) || [];
    const featuredLinks = activeLinks.filter((link) => link.featured);

    return {
      activeLinks,
      featuredLinks,
      today,
    };
  }, [profile.links]);

  // Safety check for profile data
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-white/60">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  // ENHANCED DELUXE TEMPLATE - Better Design + All User Data
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Floating Contact Button */}
      {profile.email && (
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`mailto:${profile.email}`}
            className="group w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
          >
            <Mail className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </a>
        </div>
      )}

      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 py-20 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Avatar with glow effect */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-white/30 overflow-hidden bg-purple-600 shadow-2xl shadow-purple-500/25">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName || "Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
                onError={(e) => {
                  console.warn("Failed to load avatar image");
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                {profile.displayName?.charAt(0) || "?"}
              </div>
            )}
          </div>

          {/* Name with enhanced styling */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {profile.displayName || "User Profile"}
          </h1>

          {/* Verification badge */}
          {profile.verified && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full mb-6">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">
                Verified Profile
              </span>
            </div>
          )}

          {/* Bio with better typography */}
          {profile.bio && (
            <p className="text-xl md:text-2xl text-purple-100/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Contact Info */}
          {(profile.email || profile.phone || profile.location) && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </a>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Profile highlights */}
          <div className="flex flex-wrap justify-center gap-6 max-w-lg mx-auto">
            {activeLinks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-purple-200 text-sm font-medium">
                  {activeLinks.length} Link{activeLinks.length !== 1 ? 's' : ''} Available
                </span>
              </div>
            )}
            {featuredLinks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-yellow-200 text-sm font-medium">
                  ⭐ {featuredLinks.length} Featured
                </span>
              </div>
            )}
            {profile.type === "VCARD" && (
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="text-blue-200 text-sm font-medium">
                  Professional Profile
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-cyan-400" />
                Connect With Me
              </h2>
              <p className="text-slate-400">
                Follow me on social media platforms
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {profile.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {social.platform}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Featured Links with enhanced design */}
        {featuredLinks.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                Featured Links
              </h2>
              <p className="text-slate-400">
                Highlighted content and important links
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="group p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl hover:border-yellow-400/60 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-yellow-400 opacity-60 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {link.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-medium text-sm">
                        ⭐ Featured
                      </span>
                      <span className="text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to visit
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Links with better design */}
        {activeLinks.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <ExternalLink className="w-8 h-8 text-purple-400" />
                All Links
              </h2>
              <p className="text-slate-400">
                Complete collection of links and resources
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {activeLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="group p-5 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-slate-600 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-purple-300">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-slate-400 text-sm">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-white">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* vCard Sections with enhanced layouts */}
        {profile.type === "VCARD" && (
          <div className="space-y-16">
            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <section>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                    <Briefcase className="w-8 h-8 text-green-400" />
                    Services
                  </h2>
                  <p className="text-slate-400">
                    Professional services and offerings
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/30"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {service.title}
                        </h3>
                      </div>
                      {service.description && (
                        <p className="text-slate-300 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      {service.price && (
                        <div className="text-green-400 font-bold text-lg">
                          {service.price}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            {profile.products && profile.products.length > 0 && (
              <section>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-orange-400" />
                    Products
                  </h2>
                  <p className="text-slate-400">
                    Available products and merchandise
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/30"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {product.name}
                        </h3>
                      </div>
                      {product.description && (
                        <p className="text-slate-300 mb-4 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-bold text-xl">
                          ${product.price?.toFixed(2)}
                        </span>
                        {product.linkUrl && (
                          <a
                            href={product.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                          >
                            View Product <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Business Hours & Testimonials Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Business Hours */}
              {profile.businessHours && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-3">
                      <Clock className="w-7 h-7 text-blue-400" />
                      Business Hours
                    </h2>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="space-y-3">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => {
                        const isToday = day === today;
                        const hours = formatBusinessHours(day);
                        const isOpen = hours !== "Closed";

                        return (
                          <div
                            key={day}
                            className={`flex justify-between items-center p-3 rounded-lg ${
                              isToday
                                ? "bg-blue-500/20 border border-blue-400/30"
                                : "bg-slate-700/50"
                            }`}
                          >
                            <span
                              className={`capitalize font-medium ${
                                isToday ? "text-blue-300" : "text-white"
                              }`}
                            >
                              {day}
                              {isToday && (
                                <span className="ml-2 text-xs">(Today)</span>
                              )}
                            </span>
                            <span
                              className={`font-medium ${
                                isOpen ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {hours}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {profile.testimonials && profile.testimonials.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-3">
                      <Award className="w-7 h-7 text-yellow-400" />
                      Testimonials
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {profile.testimonials.slice(0, 3).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 border-l-4 border-l-yellow-400"
                      >
                        <Quote className="w-6 h-6 text-yellow-400 mb-3" />
                        <p className="text-slate-200 italic mb-4 leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-yellow-300">
                              {testimonial.author}
                            </div>
                            {testimonial.company && (
                              <div className="text-slate-400 text-sm">
                                {testimonial.company}
                              </div>
                            )}
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blog Posts */}
            {profile.blogPosts && profile.blogPosts.length > 0 && (
              <section>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                    <BookOpen className="w-8 h-8 text-indigo-400" />
                    Latest Blog Posts
                  </h2>
                  <p className="text-slate-400">Recent articles and updates</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.blogPosts.slice(0, 6).map((post) => (
                    <div
                      key={post.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-indigo-500/30"
                    >
                      {post.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={post.imageUrl}
                            alt={post.title || "Blog post"}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-300 mb-4 line-clamp-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-indigo-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Skills/Tags Section */}
        {profile.skills && profile.skills.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-amber-400" />
                Skills & Expertise
              </h2>
              <p className="text-slate-400">
                Areas of specialization and expertise
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full text-amber-300 font-medium hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced Gallery */}
        {profile.gallery && profile.gallery.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <ImageIcon className="w-8 h-8 text-blue-400" />
                Gallery
              </h2>
              <p className="text-slate-400">Visual showcase and portfolio</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.gallery.slice(0, 12).map((image) => (
                <div
                  key={image.id}
                  className="group aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500/30"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || "Gallery"}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            {profile.gallery.length > 12 && (
              <div className="text-center mt-8">
                <p className="text-slate-400">
                  <span className="font-semibold">
                    +{profile.gallery.length - 12}
                  </span>{" "}
                  more images in gallery
                </p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Enhanced footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-xl font-semibold text-white">LinkApp</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date().toLocaleDateString()}</span>
              </div>
              {profile.type === "VCARD" && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Professional Profile</span>
                </div>
              )}
            </div>
            <p className="text-slate-500 text-sm">
              Create your professional profile at linkapp.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeluxeTemplate;
