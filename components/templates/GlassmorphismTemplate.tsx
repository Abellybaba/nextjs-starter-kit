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
  Link as LinkIcon,
  Music,
  Rss,
  Briefcase,
  Video,
  Check,
  Smartphone,
} from "lucide-react";

// Define types for the component props
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: string;
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

// Icon mapping for the template
const templateIconMap: { [key: string]: React.ComponentType<any> } = {
  globe: Globe,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  mail: Mail,
  link: LinkIcon,
  spotify: Music,
  applemusic: Music,
  soundcloud: Music,
  medium: Rss,
  substack: Rss,
  linkedin: Briefcase,
  vimeo: Video,
  appstore: Smartphone,
  playstore: Smartphone,
};

interface GlassmorphismTemplateProps {
  profile: UserProfile;
}

const GlassmorphismTemplate: React.FC<GlassmorphismTemplateProps> = ({
  profile,
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return <LinkIcon className="w-5 h-5" />;
    const Icon = templateIconMap[iconName];
    return Icon ? (
      <Icon className="w-5 h-5" />
    ) : (
      <LinkIcon className="w-5 h-5" />
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative w-full min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-md mx-auto"
      >
        {/* Header */}
        <motion.header
          variants={itemVariants}
          className="text-center mb-10 flex flex-col items-center"
        >
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white/50 shadow-lg">
              <AvatarImage src={profile.avatar} alt={profile.displayName} />
              <AvatarFallback className="text-3xl bg-white/20">
                {profile.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {profile.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white/80">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-5 text-shadow-md">
            {profile.displayName}
          </h1>
          <p className="text-md mt-2 text-white/80 text-shadow">
            @{profile.username}
          </p>
          <p className="text-md mt-3 text-center max-w-xs text-white/90 text-shadow">
            {profile.bio}
          </p>
        </motion.header>

        {/* Links */}
        <main className="space-y-4">
          {profile.links
            ?.filter((link) => link.isActive)
            .map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/20"
              >
                <div className="flex-shrink-0 w-6 h-6 mr-4 text-white/90">
                  {getIcon(link.icon)}
                </div>
                <span className="flex-1 text-md font-medium truncate">
                  {link.title}
                </span>
              </motion.a>
            ))}
        </main>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="text-center mt-12">
          <p className="text-xs text-white/60">
            Powered by{" "}
            <a
              href="https://vlink.to"
              className="font-semibold hover:text-white"
            >
              vLink
            </a>
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default GlassmorphismTemplate;
