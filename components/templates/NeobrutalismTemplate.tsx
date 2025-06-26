import React from "react";
import { motion } from "framer-motion";
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
  Link as LinkIcon,
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
} from "lucide-react";

// Assuming these types are defined centrally, but defining here for completeness.
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: string;
  featured?: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  avatar: string;
  username: string;
  verified: boolean;
  links: LinkItem[];
}

// Replicating iconMap logic from dashboard for template usage
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
  file: FileText, // Using FileText for generic file
  "share-2": Share2,
  ticket: Ticket,
  "calendar-days": CalendarDays,
};

interface NeobrutalismTemplateProps {
  profile: UserProfile;
}

const NeobrutalismTemplate: React.FC<NeobrutalismTemplateProps> = ({
  profile,
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return <LinkIcon className="w-6 h-6" />;
    const Icon = templateIconMap[iconName];
    return Icon ? (
      <Icon className="w-6 h-6" />
    ) : (
      <LinkIcon className="w-6 h-6" />
    );
  };

  return (
    <div className="bg-[#FDF5E6] font-mono text-black w-full min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative inline-block"
          >
            <Avatar className="w-28 h-28 border-4 border-black shadow-[8px_8px_0px_#000000]">
              <AvatarImage src={profile.avatar} alt={profile.displayName} />
              <AvatarFallback className="text-4xl bg-yellow-400 border-4 border-black">
                {profile.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {profile.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 border-2 border-black"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mt-6"
          >
            {profile.displayName}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg mt-2"
          >
            {profile.bio}
          </motion.p>
        </header>

        {/* Links */}
        <main className="space-y-5">
          {profile.links
            ?.filter((link) => link.isActive)
            .map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + index * 0.08,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.03, boxShadow: "10px 10px 0px #000000" }}
                whileTap={{ scale: 0.97, boxShadow: "4px 4px 0px #000000" }}
                className="flex items-center w-full p-4 bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_#000000] transition-shadow duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 mr-4">
                  {getIcon(link.icon)}
                </div>
                <span className="flex-1 text-lg font-semibold truncate">
                  {link.title}
                </span>
                <div className="w-8 h-8 flex-shrink-0" />
              </motion.a>
            ))}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16">
          <p className="text-sm">
            Powered by{" "}
            <a
              href="https://vlink.to"
              className="font-bold underline hover:text-blue-500"
            >
              vLink
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default NeobrutalismTemplate;
