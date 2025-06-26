import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Globe,
  Youtube,
  Instagram,
  Twitter,
  Github,
  Mail,
  Calendar,
  Facebook,
  Linkedin,
  LinkIcon,
  Music,
  Rss,
  Briefcase,
  ClipboardList,
  Video,
  Clapperboard,
  Podcast,
  Radio,
  FileText,
  Paintbrush,
  Notebook,
  Apple,
  Download,
  FlaskConical,
  MapPin,
  Navigation,
  CreditCard,
  DollarSign,
  Bitcoin,
  Heart,
  Coffee,
  Share2,
  Ticket,
  CalendarDays,
  MessageSquare,
  Mic,
  Send,
  Pin,
  Focus,
  BookOpen,
  Twitch,
  CircleFadingPlus,
  Check,
  Smartphone,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  Star,
  Zap,
  Sparkles,
  Camera,
  Image,
  Grid3X3,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Enhanced interfaces for richer content
export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: string;
  featured?: boolean;
  type?: "link" | "gallery" | "video" | "music" | "contact";
  media?: MediaItem[];
  color?: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  avatar: string;
  username: string;
  verified: boolean;
  links: LinkItem[];
  coverImage?: string;
  theme?: "dark" | "light" | "gradient";
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
}

const templateIconMap: { [key: string]: React.ComponentType<any> } = {
  globe: Globe,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  mail: Mail,
  calendar: Calendar,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: CircleFadingPlus,
  pinterest: Pin,
  snapchat: Focus,
  reddit: BookOpen,
  twitch: Twitch,
  discord: MessageSquare,
  clubhouse: Mic,
  telegram: Send,
  whatsapp: MessageSquare,
  link: LinkIcon,
  spotify: Music,
  applemusic: Music,
  soundcloud: Music,
  deezer: Music,
  pandora: Music,
  audiomack: Music,
  medium: BookOpen,
  substack: BookOpen,
  wordpress: Rss,
  blogger: Rss,
  tumblr: Rss,
  "contact-form": ClipboardList,
  calendly: Calendar,
  "google-forms": ClipboardList,
  typeform: ClipboardList,
  jotform: ClipboardList,
  hubspot: Briefcase,
  vimeo: Video,
  reels: Clapperboard,
  podcast: Podcast,
  livestream: Radio,
  resume: FileText,
  behance: Paintbrush,
  dribbble: Paintbrush,
  notion: Notebook,
  appstore: Apple,
  playstore: Smartphone,
  apk: Download,
  testflight: FlaskConical,
  "map-pin": MapPin,
  navigation: Navigation,
  "credit-card": CreditCard,
  "dollar-sign": DollarSign,
  bitcoin: Bitcoin,
  heart: Heart,
  coffee: Coffee,
  file: FileText,
  "share-2": Share2,
  ticket: Ticket,
  "calendar-days": CalendarDays,
  gallery: Image,
  camera: Camera,
};

interface ModernTemplateProps {
  profile: UserProfile;
}

// Sample data for demonstration
const sampleProfile: UserProfile = {
  id: "1",
  displayName: "Alex Rivera",
  bio: "Creative Director & Digital Artist",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  username: "alexrivera",
  verified: true,
  coverImage:
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=400&fit=crop",
  theme: "gradient",
  stats: {
    followers: 12500,
    following: 890,
    posts: 247,
  },
  links: [
    {
      id: "1",
      title: "Featured Work",
      url: "#",
      isActive: true,
      icon: "star",
      featured: true,
      type: "gallery",
      color: "#FF6B6B",
      description: "My latest creative projects",
      media: [
        {
          id: "1",
          type: "image",
          url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
          title: "Neon Dreams",
          description: "Digital art exploration",
        },
        {
          id: "2",
          type: "image",
          url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop",
          title: "Urban Landscape",
          description: "Photography series",
        },
        {
          id: "3",
          type: "image",
          url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=300&fit=crop",
          title: "Abstract Forms",
          description: "3D modeling project",
        },
      ],
    },
    {
      id: "2",
      title: "Latest Video",
      url: "https://youtube.com",
      isActive: true,
      icon: "youtube",
      type: "video",
      color: "#FF0000",
      description: "Behind the scenes of my creative process",
    },
    {
      id: "3",
      title: "Instagram",
      url: "https://instagram.com",
      isActive: true,
      icon: "instagram",
      color: "#E4405F",
      description: "Daily inspiration and updates",
    },
    {
      id: "4",
      title: "Spotify Playlist",
      url: "https://spotify.com",
      isActive: true,
      icon: "spotify",
      type: "music",
      color: "#1DB954",
      description: "Music that fuels my creativity",
    },
    {
      id: "5",
      title: "Contact Me",
      url: "mailto:hello@alexrivera.com",
      isActive: true,
      icon: "mail",
      type: "contact",
      color: "#4F46E5",
      description: "Let's work together",
    },
    {
      id: "6",
      title: "Portfolio Website",
      url: "https://alexrivera.com",
      isActive: true,
      icon: "globe",
      color: "#10B981",
      description: "Full portfolio and case studies",
    },
  ],
};

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  profile = sampleProfile,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <LinkIcon className="w-5 h-5" />;
    const Icon = templateIconMap[iconName];
    return Icon ? (
      <Icon className="w-5 h-5" />
    ) : (
      <LinkIcon className="w-5 h-5" />
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const openGallery = (media: MediaItem[], index: number) => {
    setSelectedMedia(media[index]);
    setMediaIndex(index);
  };

  const closeGallery = () => {
    setSelectedMedia(null);
  };

  const navigateGallery = (direction: "prev" | "next", media: MediaItem[]) => {
    let newIndex = mediaIndex;
    if (direction === "prev") {
      newIndex = mediaIndex > 0 ? mediaIndex - 1 : media.length - 1;
    } else {
      newIndex = mediaIndex < media.length - 1 ? mediaIndex + 1 : 0;
    }
    setMediaIndex(newIndex);
    setSelectedMedia(media[newIndex]);
  };

  const renderLinkContent = (link: LinkItem) => {
    switch (link.type) {
      case "gallery":
        return (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {link.media?.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-200"
                whileHover={{ scale: 1.05 }}
                onClick={() => openGallery(link.media!, index)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        );
      case "video":
        return (
          <div className="mt-3 bg-black rounded-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        );
      case "music":
        return (
          <div className="mt-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">Creative Vibes</p>
                <p className="text-xs opacity-75">24 tracks • 1h 32m</p>
              </div>
            </div>
            <Volume2 className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto p-6">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Cover Image */}
          {profile.coverImage && (
            <div className="relative -mx-6 -mt-6 mb-6 h-32 overflow-hidden">
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
            className="relative inline-block"
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
              <AvatarImage src={profile.avatar} alt={profile.displayName} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {profile.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {profile.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 border-2 border-white"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Name and Bio */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold mt-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            {profile.displayName}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-300 mt-2 text-sm"
          >
            {profile.bio}
          </motion.p>

          {/* Stats */}
          {profile.stats && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center space-x-6 mt-4 text-sm"
            >
              <div className="text-center">
                <p className="font-bold text-white">
                  {formatNumber(profile.stats.followers)}
                </p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">
                  {formatNumber(profile.stats.following)}
                </p>
                <p className="text-gray-400">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">
                  {formatNumber(profile.stats.posts)}
                </p>
                <p className="text-gray-400">Posts</p>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Links Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          {profile.links
            ?.filter((link) => link.isActive)
            .map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.7 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                className={`group relative ${
                  link.featured ? "order-first" : ""
                }`}
              >
                {link.featured && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  </div>
                )}

                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full p-4 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                    link.featured
                      ? "bg-white/20 border-2 border-white/30 shadow-2xl"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                  style={{
                    boxShadow: link.featured
                      ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                      : "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: link.color || "#6366f1" }}
                      >
                        {getIcon(link.icon)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-gray-300 text-sm mt-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {link.featured && (
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {renderLinkContent(link)}
                </motion.a>
              </motion.div>
            ))}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-12 pb-6"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Powered by</span>
            <a
              href="https://vlink.to"
              className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all"
            >
              vLink
            </a>
          </div>
        </motion.footer>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {selectedMedia.title && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold">
                    {selectedMedia.title}
                  </h3>
                  {selectedMedia.description && (
                    <p className="text-gray-300 text-sm mt-1">
                      {selectedMedia.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernTemplate;
