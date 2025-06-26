import React, { useState } from "react";
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
  Eye,
  MousePointer,
  Grid3X3,
  List,
  TrendingUp,
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

  const handleLinkClick = (linkId: string, url: string) => {
    if (onLinkClick) {
      onLinkClick(linkId);
    }
    window.open(url, "_blank");
  };

  const formatBusinessHours = (day: string) => {
    const hours =
      profile.businessHours?.[
        day.toLowerCase() as keyof typeof profile.businessHours
      ];
    if (!hours || !hours.isOpen) return "Closed";
    return `${hours.start} - ${hours.end}`;
  };

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

  const totalClicks =
    profile.links?.reduce((total, link) => total + (link.clicks || 0), 0) || 0;
  const activeLinks = profile.links?.filter((link) => link.isActive) || [];
  const featuredLinks = activeLinks.filter((link) => link.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#7c3aed40,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_300px,#ec489940,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_20%_600px,#06b6d440,transparent)]" />
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mb-6 relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold group-hover:from-purple-400 group-hover:to-pink-400 transition-colors duration-300">
                {profile.displayName?.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            {profile.displayName}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            {profile.verified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Verified
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
              <Eye className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">
                {profile.views || 0} views
              </span>
            </div>
          </div>

          {profile.bio && (
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              {profile.bio}
            </p>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-md mx-auto">
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-400">
                {activeLinks.length}
              </div>
              <div className="text-xs text-white/60">Links</div>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-pink-400">
                {totalClicks}
              </div>
              <div className="text-xs text-white/60">Clicks</div>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">
                {profile.gallery?.length || 0}
              </div>
              <div className="text-xs text-white/60">Photos</div>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl font-bold text-green-400">
                {profile.products?.length || 0}
              </div>
              <div className="text-xs text-white/60">Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Links Highlight */}
      {featuredLinks.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Featured Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="group p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    {link.thumbnailUrl ? (
                      <img
                        src={link.thumbnailUrl}
                        alt={link.title}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-white text-left mb-2">
                    {link.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-400 font-medium">
                      ⭐ Featured
                    </span>
                    <span className="text-white/60">
                      {link.clicks || 0} clicks
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Links and Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* All Links Section */}
            {activeLinks.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <ExternalLink className="w-6 h-6 text-purple-400" />
                  Quick Links
                  <span className="text-sm text-white/60 ml-auto">
                    {activeLinks.length} links
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id, link.url)}
                      className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {link.thumbnailUrl ? (
                            <img
                              src={link.thumbnailUrl}
                              alt={link.title}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="text-left">
                            <h3 className="font-medium text-white text-sm">
                              {link.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <MousePointer className="w-3 h-3" />
                              {link.clicks || 0} clicks
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {profile.gallery && profile.gallery.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                    Gallery
                    <span className="text-sm text-white/60 ml-2">
                      {profile.gallery.length} images
                    </span>
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGalleryView("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        galleryView === "grid"
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGalleryView("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        galleryView === "list"
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {galleryView === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.gallery.map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={image.url}
                          alt={image.altText || "Gallery image"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.gallery.map((image) => (
                      <div
                        key={image.id}
                        className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <img
                          src={image.url}
                          alt={image.altText || "Gallery image"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {image.altText || `Image ${image.id.slice(0, 8)}`}
                          </h3>
                          <p className="text-white/60 text-sm">Gallery item</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog Posts Section */}
            {profile.type === "VCARD" &&
              profile.blogPosts &&
              profile.blogPosts.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                    Latest Posts
                    <span className="text-sm text-white/60 ml-2">
                      {profile.blogPosts.length} posts
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {profile.blogPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="flex gap-4">
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {post.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  post.publishedAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Right Column - Business Info */}
          <div className="space-y-6">
            {/* Services Section */}
            {profile.type === "VCARD" &&
              profile.services &&
              profile.services.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-green-400" />
                    Services
                    <span className="text-sm text-white/60 ml-2">
                      {profile.services.length}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {profile.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <h3 className="font-semibold text-lg mb-2">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-white/70 text-sm mb-3">
                            {service.description}
                          </p>
                        )}
                        {service.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 font-semibold">
                              {service.price}
                            </span>
                            <Zap className="w-4 h-4 text-green-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Products Section */}
            {profile.type === "VCARD" &&
              profile.products &&
              profile.products.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-orange-400" />
                    Products
                    <span className="text-sm text-white/60 ml-2">
                      {profile.products.length}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {profile.products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-colors"
                      >
                        <div className="flex gap-4">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-white/70 text-sm mb-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="text-green-400 font-bold text-lg">
                                ${product.price?.toFixed(2)}
                              </div>
                              {product.linkUrl && (
                                <a
                                  href={product.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 text-sm hover:underline flex items-center gap-1"
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Business Hours Section */}
            {profile.type === "VCARD" && profile.businessHours && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Business Hours
                </h2>
                <div className="space-y-3">
                  {dayNames.map((day) => {
                    const isToday = day === today;
                    const hours = formatBusinessHours(day);
                    const isOpen = hours !== "Closed";

                    return (
                      <div
                        key={day}
                        className={`flex justify-between items-center py-3 px-4 rounded-lg transition-colors ${
                          isToday
                            ? "bg-blue-500/20 border border-blue-400/30"
                            : "bg-white/5"
                        }`}
                      >
                        <span
                          className={`capitalize font-medium ${
                            isToday ? "text-blue-400" : "text-white/80"
                          }`}
                        >
                          {day}
                          {isToday && (
                            <span className="ml-2 text-xs">(Today)</span>
                          )}
                        </span>
                        <span
                          className={`text-sm ${
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
            )}

            {/* Testimonials Section */}
            {profile.type === "VCARD" &&
              profile.testimonials &&
              profile.testimonials.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Testimonials
                    <span className="text-sm text-white/60 ml-2">
                      {profile.testimonials.length}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {profile.testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <Quote className="w-6 h-6 text-purple-400 mb-3" />
                        <p className="text-white/90 italic mb-4">
                          "{testimonial.quote}"
                        </p>
                        <div className="text-right">
                          <div className="font-semibold text-purple-300">
                            {testimonial.author}
                          </div>
                          {testimonial.company && (
                            <div className="text-white/60 text-sm">
                              {testimonial.company}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      {(profile.views || totalClicks) && (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Performance Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-400">
                  {profile.views || 0}
                </div>
                <div className="text-sm text-white/60">Profile Views</div>
              </div>
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <MousePointer className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-400">
                  {totalClicks}
                </div>
                <div className="text-sm text-white/60">Total Clicks</div>
              </div>
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-400">
                  {Math.floor(
                    (totalClicks / Math.max(profile.views || 1, 1)) * 100
                  )}
                  %
                </div>
                <div className="text-sm text-white/60">Engagement</div>
              </div>
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-400">
                  {featuredLinks.length}
                </div>
                <div className="text-sm text-white/60">Featured</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="text-white/80 font-medium">
              Powered by LinkApp
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            {profile.views && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {profile.views.toLocaleString()} views
              </div>
            )}
            {totalClicks > 0 && (
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                {totalClicks.toLocaleString()} clicks
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Updated {new Date().toLocaleDateString()}
            </div>
          </div>

          <p className="text-white/40 text-xs mt-4">
            Create your own professional profile at linkapp.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeluxeTemplate;
