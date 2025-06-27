import React from "react";
import { UserProfile, LinkItem } from "@/utils/types";
import {
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Facebook,
  Music,
  ExternalLink,
  Clock,
  Star,
  MessageSquare,
  Briefcase,
  ShoppingBag,
  Camera,
  BookOpen,
  X,
  Twitch,
  MessageCircle,
  BookOpenCheck,
  MessageCircleHeart,
  Wallet,
  Frame,
  Dribbble,
  Rss,
  CircleDollarSign,
  Video,
  Heart,
  Coffee,
  CreditCard,
  Store,
  Book,
  Calendar,
  NotepadText,
  Figma,
  Gitlab,
  Codepen,
  CaseSensitive,
  Podcast,
  AppWindow,
  Signal,
  Slack,
  Fullscreen,
} from "lucide-react";

// Enhanced icon mapping based on platform constants
const iconMap: { [key: string]: React.ComponentType<{className?: string}> } = {
  'Twitter': Twitter,
  'X': X,
  'Instagram': Instagram,
  'Facebook': Facebook,
  'LinkedIn': Linkedin,
  'GitHub': Github,
  'TikTok': Music, // placeholder
  'YouTube': Youtube,
  'Twitch': Twitch,
  'Discord': MessageCircle,
  'Reddit': BookOpenCheck,
  'Snapchat': MessageCircle,
  'Pinterest': MessageCircleHeart,
  'Telegram': MessageCircle,
  'WhatsApp': Wallet,
  'Behance': Frame,
  'Dribbble': Dribbble,
  'Medium': Rss,
  'Substack': Rss,
  'OnlyFans': CircleDollarSign,
  'Clubhouse': MessageCircle,
  'Vimeo': Video,
  'Patreon': Heart,
  'Kofi': Coffee,
  'Buy Me a Coffee': Coffee,
  'PayPal': Wallet,
  'Cash App': Wallet,
  'Venmo': Wallet,
  'Stripe': CreditCard,
  'Shopify': Store,
  'Etsy': Store,
  'Gumroad': Book,
  'Calendly': Calendar,
  'Notion': NotepadText,
  'Figma': Figma,
  'GitLab': Gitlab,
  'Codepen': Codepen,
  'Stack Overflow': CaseSensitive,
  'Spotify': Music,
  'Apple Music': Music,
  'SoundCloud': Music,
  'Bandcamp': Music,
  'Tidal': Music,
  'YouTube Music': Youtube,
  'Deezer': Music,
  'Amazon Music': Store,
  'Apple Podcasts': Podcast,
  'Google Podcasts': Podcast,
  'App Store': AppWindow,
  'Google Play': AppWindow,
  'Email': Mail,
  'Phone': Phone,
  'Website': Globe,
  'Signal': Signal,
  'Slack': Slack,
  'Zoom': Fullscreen,
  'Generic Link': LinkIcon,
  // Legacy mappings
  'link': LinkIcon,
  'mail': Mail,
  'phone': Phone,
  'map': MapPin,
  'website': Globe,
  'youtube': Youtube,
  'twitter': Twitter,
  'instagram': Instagram,
  'github': Github,
  'linkedin': Linkedin,
  'facebook': Facebook,
};

const RichProfileTemplate: React.FC<{ profile: UserProfile }> = ({
  profile,
}) => {
  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Profile not found.
          </h2>
        </div>
      </div>
    );
  }

  // Categorize links for different sections
  const socialLinks = profile.links.filter((link) => 
    link.isActive && ['Twitter', 'X', 'Instagram', 'Facebook', 'LinkedIn', 'GitHub', 'TikTok', 'Discord', 'Reddit', 'Snapchat', 'Pinterest', 'Telegram', 'OnlyFans', 'Clubhouse'].includes(link.icon || '')
  );

  const videoLinks = profile.links.filter((link) => 
    link.isActive && (link.url.includes('youtube.com') || link.url.includes('youtu.be') || ['YouTube', 'Twitch', 'Vimeo'].includes(link.icon || ''))
  );

  const musicLinks = profile.links.filter((link) => 
    link.isActive && ['Spotify', 'Apple Music', 'SoundCloud', 'Bandcamp', 'Tidal', 'YouTube Music', 'Deezer', 'Amazon Music', 'Apple Podcasts', 'Google Podcasts'].includes(link.icon || '')
  );

  const contactLinks = profile.links.filter((link) => 
    link.isActive && ['Email', 'Phone', 'WhatsApp', 'Calendly', 'Signal', 'Slack', 'Zoom'].includes(link.icon || '')
  );

  const professionalLinks = profile.links.filter((link) => 
    link.isActive && ['Behance', 'Dribbble', 'Medium', 'Substack', 'Notion', 'Figma', 'GitLab', 'Codepen', 'Stack Overflow'].includes(link.icon || '')
  );

  const otherLinks = profile.links.filter((link) => 
    link.isActive && 
    ![...socialLinks, ...videoLinks, ...musicLinks, ...contactLinks, ...professionalLinks].some(categorizedLink => categorizedLink.id === link.id)
  );

  // Format business hours
  const formatBusinessHours = () => {
    if (!profile.businessHours) return null;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const hours = profile.businessHours![day as keyof typeof profile.businessHours];
      return (
        <div key={day} className="flex justify-between text-sm">
          <span className="font-medium">{dayNames[index]}</span>
          <span className={hours?.isOpen ? 'text-green-600' : 'text-gray-400'}>
            {hours?.isOpen ? `${hours.start} - ${hours.end}` : 'Closed'}
          </span>
        </div>
      );
    });
  };

  // Render social media icons row
  const renderSocialIcons = () => {
    if (socialLinks.length === 0) return null;
    
    return (
      <div className="flex justify-center space-x-4 mb-8">
        {socialLinks.map((link) => {
          const IconComponent = iconMap[link.icon || ''] || LinkIcon;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700">
                <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {link.title}
              </span>
            </a>
          );
        })}
      </div>
    );
  };

  // Render video content
  const renderVideoContent = () => {
    if (videoLinks.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Videos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {videoLinks.map((link) => {
            if (link.url.includes("youtube.com") || link.url.includes("youtu.be")) {
              const videoIdMatch = link.url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
              const videoId = videoIdMatch ? videoIdMatch[1] : null;
              if (!videoId) return null;

              return (
                <div
                  key={link.id}
                  className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800"
                >
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={link.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="p-4 font-semibold text-gray-800 dark:text-gray-200">
                    {link.title}
                  </p>
                </div>
              );
            }

            // For other video platforms, show as regular links
            const IconComponent = iconMap[link.icon || ''] || LinkIcon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <IconComponent className="mr-4 h-6 w-6 text-gray-600 dark:text-gray-400" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {link.title}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-blue-500" />
              </a>
            );
          })}
        </div>
      </section>
    );
  };

  // Render links section
  const renderLinksSection = (links: LinkItem[], title: string, icon: React.ComponentType<{className?: string}>) => {
    if (links.length === 0) return null;
    
    const IconComponent = icon;
    
    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <IconComponent className="mr-3 h-6 w-6" />
          {title}
        </h2>
        <div className="grid gap-4">
          {links.map((link) => {
            const LinkIconComponent = iconMap[link.icon || ''] || LinkIcon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <LinkIconComponent className="mr-4 h-6 w-6 text-gray-600 dark:text-gray-400" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {link.title}
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-blue-500" />
              </a>
            );
          })}
        </div>
      </section>
    );
  };

  // Render services section
  const renderServices = () => {
    if (!profile.services || profile.services.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <Briefcase className="mr-3 h-6 w-6" />
          Services
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {profile.services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h3>
              {service.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {service.description}
                </p>
              )}
              {service.price && (
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {service.price}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render products section
  const renderProducts = () => {
    if (!profile.products || profile.products.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <ShoppingBag className="mr-3 h-6 w-6" />
          Products
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profile.products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                {product.price && (
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${product.price.toFixed(2)}
                  </p>
                )}
                {product.linkUrl && (
                  <a
                    href={product.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render testimonials section
  const renderTestimonials = () => {
    if (!profile.testimonials || profile.testimonials.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <MessageSquare className="mr-3 h-6 w-6" />
          Testimonials
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {profile.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-600 dark:text-gray-300 mb-4 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </p>
                {testimonial.company && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.company}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render gallery section
  const renderGallery = () => {
    if (!profile.gallery || profile.gallery.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <Camera className="mr-3 h-6 w-6" />
          Gallery
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profile.gallery.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={image.url}
                alt={image.altText || 'Gallery image'}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render blog posts section
  const renderBlogPosts = () => {
    if (!profile.blogPosts || profile.blogPosts.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <BookOpen className="mr-3 h-6 w-6" />
          Blog Posts
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {profile.blogPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {post.content}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  };

  // Render business hours section
  const renderBusinessHours = () => {
    if (!profile.businessHours) return null;

    return (
      <section className="mb-12">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <Clock className="mr-3 h-6 w-6" />
          Business Hours
        </h2>
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="space-y-2">
            {formatBusinessHours()}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="relative mb-16 flex flex-col items-center">
          {profile.avatar && (
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt={profile.displayName}
              className="h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-white dark:ring-gray-800 mb-4"
            />
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-center">
            {profile.displayName}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
          {profile.verified && (
            <div className="mt-2 flex items-center text-blue-600">
              <Star className="h-5 w-5 mr-1 fill-current" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}
        </header>

        {/* Bio Section */}
        {profile.bio && (
          <section className="mb-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {profile.bio}
            </p>
          </section>
        )}

        {/* Social Media Icons Row */}
        {renderSocialIcons()}

        <main className="space-y-12">
          {/* Video Content Section */}
          {renderVideoContent()}

          {/* Music & Podcasts Section */}
          {renderLinksSection(musicLinks, 'Music & Podcasts', Music)}

          {/* Professional Links Section */}
          {renderLinksSection(professionalLinks, 'Professional', Briefcase)}

          {/* Contact Section */}
          {renderLinksSection(contactLinks, 'Contact', Phone)}

          {/* Services Section */}
          {renderServices()}

          {/* Products Section */}
          {renderProducts()}

          {/* Testimonials Section */}
          {renderTestimonials()}

          {/* Gallery Section */}
          {renderGallery()}

          {/* Blog Posts Section */}
          {renderBlogPosts()}

          {/* Business Hours Section */}
          {renderBusinessHours()}

          {/* Other Links Section */}
          {renderLinksSection(otherLinks, 'Other Links', LinkIcon)}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-gray-500 dark:border-gray-700">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {profile.displayName}. All rights reserved.
          </p>
          <p className="mt-2 text-xs">
            Powered by{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              vLink
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RichProfileTemplate;
