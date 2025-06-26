import React from "react";
import { UserProfile, LinkItem } from "@/utils/types"; // Corrected import path
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
} from "lucide-react";

const iconMap: { [key: string]: React.ReactNode } = {
  link: <LinkIcon className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  map: <MapPin className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
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

  const renderLink = (link: LinkItem) => {
    const Icon =
      link.icon && iconMap[link.icon] ? (
        iconMap[link.icon]
      ) : (
        <LinkIcon className="h-5 w-5" />
      );

    if (link.url.includes("youtube.com") || link.url.includes("youtu.be")) {
      const videoIdMatch = link.url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (!videoId) return null;

      return (
        <div
          key={link.id}
          className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800"
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

    if (link.url.includes("maps.google.com")) {
      return (
        <div
          key={link.id}
          className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800"
        >
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={link.url.replace("/view", "/embed")}
              title={link.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <p className="p-4 font-semibold text-gray-800 dark:text-gray-200">
            {link.title}
          </p>
        </div>
      );
    }

    return (
      <a
        key={link.id}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 flex items-center rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="mr-4 text-gray-600 dark:text-gray-400">{Icon}</div>
        <div className="flex-grow">
          <p className="font-bold text-gray-800 dark:text-white">
            {link.title}
          </p>
        </div>
        <div className="text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <header className="relative mb-16 flex flex-col items-center">
          {profile.coverImage && (
            <div className="h-48 w-full overflow-hidden rounded-2xl shadow-lg">
              <img
                src={profile.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div
            className={`absolute ${
              profile.coverImage ? "top-24" : "top-0"
            } flex flex-col items-center`}
          >
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt={profile.displayName}
              className="h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-white dark:ring-gray-800"
            />
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {profile.displayName}
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              @{profile.username}
            </p>
          </div>
        </header>

        <main className="mt-24 pt-12">
          {profile.bio && (
            <p className="mb-12 text-center text-xl text-gray-600 dark:text-gray-300">
              {profile.bio}
            </p>
          )}
          <div>
            {profile.links.filter((link) => link.isActive).map(renderLink)}
          </div>
        </main>

        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-gray-500 dark:border-gray-700">
          <p>
            &copy; {new Date().getFullYear()} {profile.displayName}. All rights
            reserved.
          </p>
          <p className="mt-2 text-sm">
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
