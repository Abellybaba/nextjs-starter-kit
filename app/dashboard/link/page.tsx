// filepath: /Users/abelokoh/Documents/GitHub/vlink/app/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Edit,
  Eye,
  GripVertical,
  Link as LinkIcon,
  MessageSquare,
  MousePointer,
  Package,
  Palette,
  Plus,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
} from "lucide-react";
import {
  UserProfile,
  LinkItem,
  GalleryImage,
  ProfileType,
  Service,
  Product,
  Testimonial,
  BlogPost,
  BusinessHours,
} from "@/utils/types";
import { platforms, linkTypes, templates } from "@/lib/constants";
import BusinessHoursTab from "../_components/business-hours-tab";
import { useProfiles } from "@/hooks/use-profiles";
import { MigrationButton } from "@/components/migration-button";

// --- Icon Map ---
const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } =
  platforms.reduce((acc, platform) => {
    acc[platform.name] = platform.icon;
    return acc;
  }, {} as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> });
iconMap["Generic Link"] = LinkIcon;

// --- Platform Groups ---
const socialPlatforms =
  linkTypes.find((lt) => lt.title === "Social")?.links || [];
const musicPlatforms =
  linkTypes.find((lt) => lt.title === "Music & Podcasts")?.links || [];
const videoPlatforms =
  linkTypes.find((lt) => lt.title === "Video")?.links || [];
const professionalPlatforms =
  linkTypes.find((lt) => lt.title === "Professional")?.links || [];
const blogPlatforms = linkTypes.find((lt) => lt.title === "Blog")?.links || [];
const contactPlatforms =
  linkTypes.find((lt) => lt.title === "Contact")?.links || [];
const appPlatforms =
  linkTypes.find((lt) => lt.title === "App Stores")?.links || [];

// --- Helper Functions ---
const getYouTubeThumbnail = (url: string) => {
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      videoId = urlObj.searchParams.get("v");
    }
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  } catch {
    return null;
  }
};

// --- Default Data ---
const defaultBusinessHours: BusinessHours = {
  monday: { isOpen: true, start: "09:00", end: "17:00" },
  tuesday: { isOpen: true, start: "09:00", end: "17:00" },
  wednesday: { isOpen: true, start: "09:00", end: "17:00" },
  thursday: { isOpen: true, start: "09:00", end: "17:00" },
  friday: { isOpen: true, start: "09:00", end: "17:00" },
  saturday: { isOpen: false, start: "", end: "" },
  sunday: { isOpen: false, start: "", end: "" },
};

// --- MOCK DATA (In a real app, this would come from an API) ---
// --- Child Components ---

function StatsCards({
  totalViews,
  totalClicks,
}: {
  totalViews: number;
  totalClicks: number;
}) {
  const clickThroughRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalViews.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalClicks.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Click-Through Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clickThroughRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Define platform type
interface Platform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder?: string;
  urlPrefix?: string;
  iconType?: string;
}

function LinksTab({
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorderLinks,
}: {
  links: LinkItem[];
  onAddLink: (link: Omit<LinkItem, "id" | "isActive">) => void;
  onUpdateLink: (id: string, updates: Partial<LinkItem>) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (reorderedLinks: LinkItem[]) => void;
}) {
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    icon: "Generic Link",
  });
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<Platform | null>(null);
  const [socialInputValue, setSocialInputValue] = useState("");
  const [isSocialModalOpen, setSocialModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("socials");

  const handleAddCustomLink = () => {
    if (newLink.title && newLink.url) {
      onAddLink({ ...newLink, featured: false, clicks: 0 });
      setNewLink({ title: "", url: "", icon: "Generic Link" });
    }
  };

  const handleAddSocialLink = () => {
    if (!selectedSocial || !socialInputValue) return;
    const url = selectedSocial.placeholder?.startsWith("http")
      ? socialInputValue
      : `${selectedSocial.placeholder || ""}${socialInputValue}`;

    const newLinkPayload: Omit<LinkItem, "id" | "isActive"> = {
      title: selectedSocial.name,
      url,
      icon: selectedSocial.name, // Use name as icon identifier
      featured: false,
      clicks: 0,
    };

    // If it's a video link, try to get a thumbnail
    if (
      selectedSocial.iconType === "youtube" ||
      selectedSocial.iconType === "vimeo"
    ) {
      const thumb = getYouTubeThumbnail(url);
      if (thumb) {
        newLinkPayload.thumbnailUrl = thumb;
      }
    }

    onAddLink(newLinkPayload);
    setSocialInputValue("");
    setSocialModalOpen(false);
  };

  const handleUpdateLink = () => {
    if (editingLink) {
      onUpdateLink(editingLink.id, {
        title: editingLink.title,
        url: editingLink.url,
      });
      setEditingLink(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) =>
    setDraggedItem(id);
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem) return;
    const reordered = [...links];
    const draggedContent = links.find((l) => l.id === draggedItem);
    if (!draggedContent) return;
    const fromIndex = links.findIndex((l) => l.id === draggedItem);
    const toIndex = links.findIndex((l) => l.id === targetId);
    reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, draggedContent);
    onReorderLinks(reordered);
    setDraggedItem(null);
  };

  const getIconComponent = (iconName?: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || LinkIcon;
    return <Icon className="w-5 h-5 text-muted-foreground" />;
  };

  const addedSocialIcons = links
    .map((link) => link.icon)
    .filter(Boolean) as string[];

  const renderPlatformGrid = (platforms: Platform[]) => {
    return (
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {platforms.map((platform) => {
          const isAdded = addedSocialIcons.includes(platform.name);
          const IconComponent = platform.icon;
          return (
            <button
              key={platform.name}
              disabled={isAdded}
              onClick={() => {
                if (isAdded) return;
                setSelectedSocial(platform);
                setSocialModalOpen(true);
              }}
              className={`relative flex flex-col items-center justify-center gap-2 p-3 border rounded-lg aspect-square transition-all ${
                isAdded
                  ? "bg-muted opacity-50 cursor-not-allowed"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {IconComponent ? (
                <IconComponent className="w-6 h-6" />
              ) : (
                <LinkIcon className="w-6 h-6" />
              )}
              <span className="text-xs text-center truncate">
                {platform.name}
              </span>
              {isAdded && (
                <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Dialog open={isSocialModalOpen} onOpenChange={setSocialModalOpen}>
        <Card>
          <Tabs
            defaultValue="socials"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <CardHeader>
              <CardTitle>Add New Link</CardTitle>
              <div className="w-full overflow-x-auto pb-2">
                <TabsList className="mt-2 inline-flex h-auto">
                  <TabsTrigger value="socials">Socials</TabsTrigger>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="professional">Portfolio</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="apps">Apps</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <TabsContent value="socials" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Quickly add links to your social media profiles.
              </CardDescription>
              {renderPlatformGrid(socialPlatforms)}
            </TabsContent>

            <TabsContent value="music" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Link your music from your favorite streaming platforms.
              </CardDescription>
              {renderPlatformGrid(musicPlatforms)}
            </TabsContent>

            <TabsContent value="video" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Showcase your video content and live streams.
              </CardDescription>
              {renderPlatformGrid(videoPlatforms)}
            </TabsContent>

            <TabsContent value="professional" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Display your professional work and portfolio.
              </CardDescription>
              {renderPlatformGrid(professionalPlatforms)}
            </TabsContent>

            <TabsContent value="blog" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Share your personal blog, website, or publications.
              </CardDescription>
              {renderPlatformGrid(blogPlatforms)}
            </TabsContent>

            <TabsContent value="contact" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Make it easy for your audience to get in touch.
              </CardDescription>
              {renderPlatformGrid(contactPlatforms)}
            </TabsContent>

            <TabsContent value="apps" className="px-6 pb-6">
              <CardDescription className="mb-4">
                Provide links to download your applications.
              </CardDescription>
              {renderPlatformGrid(appPlatforms)}
            </TabsContent>

            <TabsContent value="custom" className="px-6 pb-6 space-y-4">
              <CardDescription>
                For any other websites or pages you want to share.
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
                <select
                  value={newLink.icon}
                  onChange={(e) =>
                    setNewLink({ ...newLink, icon: e.target.value })
                  }
                  className="w-full p-2 border rounded-md bg-background text-sm"
                >
                  {Object.keys(iconMap).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddCustomLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Link
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
        <DialogContent>
          {selectedSocial && (
            <>
              <DialogHeader>
                <DialogTitle>Add {selectedSocial.name} Link</DialogTitle>
                <DialogDescription>
                  Enter your {selectedSocial.name} details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="social-input">
                  {selectedSocial.urlPrefix
                    ? "Username/Handle"
                    : "Full Profile URL"}
                </Label>
                <div className="flex items-center">
                  {selectedSocial.urlPrefix && (
                    <span className="text-muted-foreground text-sm px-3 py-2 bg-muted rounded-l-md border border-r-0">
                      {selectedSocial.placeholder}
                    </span>
                  )}
                  <Input
                    id="social-input"
                    placeholder={
                      selectedSocial.placeholder?.includes("username")
                        ? "username"
                        : "your-id"
                    }
                    value={socialInputValue}
                    onChange={(e) => setSocialInputValue(e.target.value)}
                    className={selectedSocial.urlPrefix ? "rounded-l-none" : ""}
                  />
                </div>
                <Button onClick={handleAddSocialLink} className="w-full">
                  Add Link
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>
            Drag to reorder, toggle to show/hide, or feature a link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, link.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, link.id)}
              className={`flex items-center space-x-4 p-3 rounded-lg border cursor-move ${
                !link.isActive ? "opacity-50" : ""
              } ${draggedItem === link.id ? "shadow-lg" : ""}`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
              {link.thumbnailUrl ? (
                <Image
                  src={link.thumbnailUrl}
                  alt={link.title}
                  width={64}
                  height={40}
                  className="w-16 h-10 object-cover rounded-md bg-gray-200"
                />
              ) : (
                getIconComponent(link.icon)
              )}
              <div className="flex-1">
                <h3 className="font-medium">{link.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {link.url}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  checked={link.isActive}
                  onCheckedChange={(c) =>
                    onUpdateLink(link.id, { isActive: c })
                  }
                />
                <Dialog onOpenChange={(open) => !open && setEditingLink(null)}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingLink(link)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        value={editingLink?.title ?? ""}
                        onChange={(e) =>
                          editingLink &&
                          setEditingLink({
                            ...editingLink,
                            title: e.target.value,
                          })
                        }
                      />
                      <Input
                        value={editingLink?.url ?? ""}
                        onChange={(e) =>
                          editingLink &&
                          setEditingLink({
                            ...editingLink,
                            url: e.target.value,
                          })
                        }
                      />
                      <Button onClick={handleUpdateLink}>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeleteLink(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTab({
  profile,
  onUpdateProfile,
}: {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your public profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">
              {profile.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => onUpdateProfile({ displayName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => onUpdateProfile({ username: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => onUpdateProfile({ bio: e.target.value })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

const AppearanceTab = ({
  profile,
  onUpdateProfile,
}: {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}) => {
  const handleTemplateChange = (templateName: string) => {
    onUpdateProfile({ template: templateName });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose a template to define the look and feel of your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select a Template</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.name}
                className="cursor-pointer group"
                onClick={() => handleTemplateChange(template.name)}
              >
                <div
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    profile.template === template.name
                      ? "border-primary shadow-2xl"
                      : "border-muted group-hover:border-accent-foreground"
                  }`}
                >
                  {/* <Image
                    src={template.image}
                    alt={template.name}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  /> */}
                  {profile.template === template.name && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <h4 className="font-semibold text-lg">{template.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GalleryTab = ({
  gallery,
  onUpdateGallery,
}: {
  gallery: GalleryImage[];
  onUpdateGallery: (gallery: GalleryImage[]) => void;
}) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        url: newImageUrl,
        altText: "User gallery image",
      };
      onUpdateGallery([...gallery, newImage]);
      setNewImageUrl("");
    }
  };

  const handleDeleteImage = (id: string) => {
    onUpdateGallery(gallery.filter((img) => img.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Gallery</CardTitle>
        <CardDescription>
          Add or remove images from your public gallery. Use image URLs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <Button onClick={handleAddImage}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image) => (
            <div key={image.id} className="relative group">
              <Image
                src={image.url}
                alt={image.altText || "Gallery image"}
                width={300}
                height={128}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-0 right-0 p-1">
                <Button
                  size="icon"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// --- NEW VCARD TABS ---

const ServicesTab = ({
  services,
  onUpdate,
}: {
  services: Service[];
  onUpdate: (services: Service[]) => void;
}) => {
  // Basic state and handlers for a controlled form
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleAddService = () => {
    if (!newService.title) return;
    const serviceToAdd: Service = { ...newService, id: Date.now().toString() };
    onUpdate([...services, serviceToAdd]);
    setNewService({ title: "", description: "", price: "" });
  };

  const handleDelete = (id: string) => {
    onUpdate(services.filter((s: Service) => s.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Services</CardTitle>
        <CardDescription>
          Add, edit, or remove the services you offer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Add New Service</h4>
          <Input
            placeholder="Service Title (e.g., Web Design)"
            value={newService.title}
            onChange={(e) =>
              setNewService({ ...newService, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Brief description..."
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
          />
          <Input
            placeholder="Price (e.g., $50/hr, Contact for quote)"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
          />
          <Button onClick={handleAddService}>
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </div>
        <div className="space-y-4">
          {services.map((service: Service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
            >
              <div>
                <p className="font-semibold">{service.title}</p>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                <p className="text-sm font-bold">{service.price}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProductsTab = ({
  products,
  onUpdate,
}: {
  products: Product[];
  onUpdate: (products: Product[]) => void;
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    linkUrl: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return; // Basic validation
    const productToAdd: Product = {
      ...newProduct,
      id: Date.now().toString(),
      price: parseFloat(newProduct.price) || 0, // Convert price to number
    };
    onUpdate([...products, productToAdd]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      linkUrl: "",
    }); // Reset form
  };

  const handleDelete = (id: string) => {
    onUpdate(products.filter((p) => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Products</CardTitle>
        <CardDescription>
          Showcase products you sell or recommend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Form to add new product */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Add New Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price (e.g., 29.99)"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <Textarea
            placeholder="Brief product description..."
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <Input
            placeholder="Image URL (optional)"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
          <Input
            placeholder="Link to product page (optional)"
            value={newProduct.linkUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, linkUrl: e.target.value })
            }
          />
          <Button onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* List of existing products */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md bg-gray-200"
                />
              )}
              <div className="flex-1">
                <h5 className="font-semibold">{product.name}</h5>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                {product.price && (
                  <p className="text-sm font-bold mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                )}
                {product.linkUrl && (
                  <a
                    href={product.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Product
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsTab = ({
  testimonials,
  onUpdate,
}: {
  testimonials: Testimonial[];
  onUpdate: (testimonials: Testimonial[]) => void;
}) => {
  const [newTestimonial, setNewTestimonial] = useState({
    quote: "",
    author: "",
    company: "",
  });

  const handleAddTestimonial = () => {
    if (!newTestimonial.quote || !newTestimonial.author) return; // Basic validation
    const testimonialToAdd: Testimonial = {
      ...newTestimonial,
      id: Date.now().toString(),
    };
    onUpdate([...testimonials, testimonialToAdd]);
    setNewTestimonial({ quote: "", author: "", company: "" }); // Reset form
  };

  const handleDelete = (id: string) => {
    onUpdate(testimonials.filter((t) => t.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Testimonials</CardTitle>
        <CardDescription>
          Display quotes from happy clients or customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Form to add new testimonial */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Add New Testimonial</h4>
          <Textarea
            placeholder='"The best service I have ever received!"'
            value={newTestimonial.quote}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, quote: e.target.value })
            }
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Author's Name (e.g., Jane Doe)"
              value={newTestimonial.author}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  author: e.target.value,
                })
              }
            />
            <Input
              placeholder="Company (e.g., Acme Inc.)"
              value={newTestimonial.company}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  company: e.target.value,
                })
              }
            />
          </div>
          <Button onClick={handleAddTestimonial}>
            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
          </Button>
        </div>

        {/* List of existing testimonials */}
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50"
            >
              <div className="flex-1">
                <blockquote className="italic text-base border-l-4 pl-4">
                  {testimonial.quote}
                </blockquote>
                <p className="text-right font-semibold mt-2">
                  &mdash; {testimonial.author}
                </p>
                {testimonial.company && (
                  <p className="text-right text-sm text-muted-foreground">
                    {testimonial.company}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(testimonial.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BlogTab = ({
  blogPosts,
  onUpdate,
}: {
  blogPosts: BlogPost[];
  onUpdate: (blogPosts: BlogPost[]) => void;
}) => {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) return; // Basic validation
    const postToAdd: BlogPost = {
      ...newPost,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    };
    onUpdate([...blogPosts, postToAdd]);
    setNewPost({ title: "", content: "", imageUrl: "" }); // Reset form
  };

  const handleDelete = (id: string) => {
    onUpdate(blogPosts.filter((p) => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Blog Posts</CardTitle>
        <CardDescription>
          Write and publish articles directly to your vCard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Form to add new post */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Create New Post</h4>
          <Input
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            placeholder="Write your content here..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            rows={5}
          />
          <Input
            placeholder="Image URL (optional)"
            value={newPost.imageUrl}
            onChange={(e) =>
              setNewPost({ ...newPost, imageUrl: e.target.value })
            }
          />
          <Button onClick={handleAddPost}>
            <Plus className="w-4 h-4 mr-2" /> Publish Post
          </Button>
        </div>

        {/* List of existing posts */}
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50"
            >
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-md bg-gray-200"
                />
              )}
              <div className="flex-1">
                <h5 className="font-semibold">{post.title}</h5>
                <p className="text-sm text-muted-foreground truncate-2-lines">
                  {post.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Analytics
        </CardTitle>
        <CardDescription>Performance and audience insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 rounded-lg border bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Analytics charts coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const LivePreview = ({ profile }: { profile: UserProfile }) => {
  const TemplateComponent = templates.find(
    (t) => t.name === profile.template
  )?.component;

  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <p>Template not found. Please select a template.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-center min-w-[370px]">
        <div className="relative border-gray-800 dark:border-gray-600 bg-gray-800 border-[12px] rounded-[2.5rem] h-[700px] w-[350px] shadow-2xl">
          <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[15px] top-[124px] rounded-l-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[15px] top-[178px] rounded-l-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[15px] top-[142px] rounded-r-lg"></div>
          <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-slate-900">
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
              <TemplateComponent profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function LinkPage() {
  const {
    profiles,
    activeProfileId,
    loading,
    error,
    setActiveProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    updateGallery,
    updateServices,
    updateProducts,
    updateTestimonials,
    updateBlogPosts,
    refreshProfiles,
  } = useProfiles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfileUsername, setNewProfileUsername] = useState("");
  const [newProfileType, setNewProfileType] = useState<ProfileType | null>(
    null
  );

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const handleCreateNewProfile = async () => {
    if (newProfileUsername.trim() && newProfileType) {
      try {
        const newProfile: Partial<UserProfile> = {
          type: newProfileType,
          username: newProfileUsername,
          displayName: newProfileUsername,
          bio: `A new ${
            newProfileType === "VLINK" ? "vLink" : "vCard"
          } profile!`,
          avatar: `https://avatar.vercel.sh/${newProfileUsername}.png`,
          verified: false,
          theme: "default",
          template: newProfileType === "VLINK" ? "rich-profile" : "vcard7",
          views: 0,
          businessHours:
            newProfileType === "VCARD" ? defaultBusinessHours : undefined,
        };

        await createProfile(newProfile);
        setNewProfileUsername("");
        setNewProfileType(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to create profile:", error);
      }
    }
  };

  const handleAddLink = async (
    link: Omit<LinkItem, "id" | "clicks" | "isActive">
  ) => {
    if (!activeProfile) return;

    try {
      await addLink(activeProfile.id, {
        title: link.title,
        url: link.url,
        icon: link.icon,
        thumbnailUrl: link.thumbnailUrl,
        featured: link.featured || false,
      });
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  const handleUpdateLink = async (id: string, updates: Partial<LinkItem>) => {
    if (!activeProfile) return;

    try {
      await updateLink(activeProfile.id, id, updates);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!activeProfile) return;

    try {
      await deleteLink(activeProfile.id, id);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleReorderLinks = async (reorderedLinks: LinkItem[]) => {
    if (!activeProfile) return;

    try {
      const linkOrder = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }));
      await reorderLinks(activeProfile.id, linkOrder);
    } catch (error) {
      console.error("Failed to reorder links:", error);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!activeProfile) return;

    try {
      await updateProfile(activeProfile.id, updates);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this profile? This action cannot be undone."
      )
    ) {
      try {
        await deleteProfile(profileId);
        // If we deleted the active profile, find another one to set as active
        if (profileId === activeProfileId) {
          const remainingProfile = profiles.find((p) => p.id !== profileId);
          if (remainingProfile) {
            setActiveProfileId(remainingProfile.id);
          }
        }
      } catch (error) {
        console.error("Failed to delete profile:", error);
      }
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col items-start justify-start p-6 w-full">
        <div className="flex items-center justify-center min-h-[60vh] w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground">
              Loading your profiles from the database...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-start justify-start p-6 w-full">
        <div className="flex items-center justify-center min-h-[60vh] w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-destructive">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!activeProfile && !loading && profiles.length === 0) {
    return (
      <section className="flex flex-col items-start justify-start p-6 w-full">
        <div className="flex items-center justify-center min-h-[60vh] w-full">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-2xl font-semibold">Welcome to Link Manager</h2>
            <p className="text-muted-foreground">
              Create a profile to get started, or migrate your existing data
              from local storage.
            </p>

            {/* Check if user has localStorage data to migrate */}
            {typeof window !== "undefined" &&
              localStorage.getItem("vlink-profiles") && (
                <MigrationButton onMigrationComplete={refreshProfiles} />
              )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Create Your First Profile</Button>
              </DialogTrigger>
              <DialogContent>
                {!newProfileType ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>What would you like to create?</DialogTitle>
                      <DialogDescription>
                        Choose a simple link page or a full-featured digital
                        business card.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                      <div
                        className="p-6 border rounded-lg flex flex-col items-center text-center gap-4 hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => setNewProfileType("VLINK")}
                      >
                        <LinkIcon className="w-10 h-10" />
                        <h3 className="font-semibold">vLink</h3>
                        <p className="text-sm text-muted-foreground">
                          A simple, stylish page to host all your important
                          links.
                        </p>
                      </div>
                      <div
                        className="p-6 border rounded-lg flex flex-col items-center text-center gap-4 hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => setNewProfileType("VCARD")}
                      >
                        <Users className="w-10 h-10" />
                        <h3 className="font-semibold">vCard</h3>
                        <p className="text-sm text-muted-foreground">
                          A professional mini-website with services, products,
                          and more.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        Create a new{" "}
                        {newProfileType === "VLINK" ? "vLink" : "vCard"}
                      </DialogTitle>
                      <DialogDescription>
                        Enter a username for your new profile. This will be part
                        of its public URL.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={newProfileUsername}
                        onChange={(e) => setNewProfileUsername(e.target.value)}
                        placeholder="e.g., yourname"
                      />
                      <Button
                        onClick={handleCreateNewProfile}
                        className="w-full"
                      >
                        Create Profile
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    );
  }

  // Ensure we have an active profile before rendering the main dashboard
  if (!activeProfile) {
    return (
      <section className="flex flex-col items-start justify-start p-6 w-full">
        <div className="flex items-center justify-center min-h-[60vh] w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">No Profile Selected</h2>
            <p className="text-muted-foreground">
              Please select a profile or create a new one.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const totalClicks = (activeProfile?.links || []).reduce(
    (acc, link) => acc + (link.clicks || 0),
    0
  );

  return (
    <section className="flex flex-col items-start justify-start p-6 w-full">
      {/* Header Section */}
      <div className="w-full mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Link Manager
            </h1>
            <p className="text-muted-foreground">
              Manage your links and create your personalized link-in-bio page.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={activeProfile?.avatar} />
                    <AvatarFallback>
                      {activeProfile?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{activeProfile?.displayName || "Select Profile"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Profiles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-center">
                      <DropdownMenuItem
                        onSelect={() => setActiveProfileId(profile.id)}
                        className="flex items-center justify-between flex-1"
                      >
                        <span>{profile.displayName}</span>
                        {profile.id === activeProfileId && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                      {profiles.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 mr-1 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfile(profile.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Profile
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    {!newProfileType ? (
                      <>
                        <DialogHeader>
                          <DialogTitle>
                            What would you like to create?
                          </DialogTitle>
                          <DialogDescription>
                            Choose a simple link page or a full-featured digital
                            business card.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                          <div
                            className="p-6 border rounded-lg flex flex-col items-center text-center gap-4 hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => setNewProfileType("VLINK")}
                          >
                            <LinkIcon className="w-10 h-10" />
                            <h3 className="font-semibold">vLink</h3>
                            <p className="text-sm text-muted-foreground">
                              A simple, stylish page to host all your important
                              links.
                            </p>
                          </div>
                          <div
                            className="p-6 border rounded-lg flex flex-col items-center text-center gap-4 hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => setNewProfileType("VCARD")}
                          >
                            <Users className="w-10 h-10" />
                            <h3 className="font-semibold">vCard</h3>
                            <p className="text-sm text-muted-foreground">
                              A professional mini-website with services,
                              products, and more.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>
                            Create a new{" "}
                            {newProfileType === "VLINK" ? "vLink" : "vCard"}
                          </DialogTitle>
                          <DialogDescription>
                            Enter a username for your new profile. This will be
                            part of its public URL.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={newProfileUsername}
                            onChange={(e) =>
                              setNewProfileUsername(e.target.value)
                            }
                            placeholder="e.g., yourname"
                          />
                          <Button
                            onClick={handleCreateNewProfile}
                            className="w-full"
                          >
                            Create Profile
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild variant="outline">
              <Link href={`/${activeProfile?.username}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Live
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="@container/main flex flex-1 flex-col gap-2 w-full">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <StatsCards
                totalViews={activeProfile.views}
                totalClicks={totalClicks}
              />
              <Tabs defaultValue="links" className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="inline-flex h-auto">
                    <TabsTrigger value="links">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Links
                    </TabsTrigger>
                    <TabsTrigger value="profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="gallery">
                      <Camera className="mr-2 h-4 w-4" />
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </TabsTrigger>

                    {/* --- DYNAMIC VCARD TABS --- */}
                    {activeProfile.type === "VCARD" && (
                      <>
                        <TabsTrigger value="services">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Services
                        </TabsTrigger>
                        <TabsTrigger value="products">
                          <Package className="mr-2 h-4 w-4" />
                          Products
                        </TabsTrigger>
                        <TabsTrigger value="testimonials">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Testimonials
                        </TabsTrigger>
                        <TabsTrigger value="blog">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Blog
                        </TabsTrigger>
                        <TabsTrigger value="hours">
                          <Clock className="mr-2 h-4 w-4" />
                          Hours
                        </TabsTrigger>
                      </>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="links" className="pt-6">
                  <LinksTab
                    links={activeProfile.links || []}
                    onAddLink={handleAddLink}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                    onReorderLinks={handleReorderLinks}
                  />
                </TabsContent>

                <TabsContent value="profile" className="pt-6">
                  <ProfileTab
                    profile={activeProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </TabsContent>

                <TabsContent value="appearance" className="pt-6">
                  <AppearanceTab
                    profile={activeProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </TabsContent>

                <TabsContent value="gallery" className="pt-6">
                  <GalleryTab
                    gallery={activeProfile.gallery || []}
                    onUpdateGallery={async (newGallery) => {
                      await updateGallery(activeProfile.id, newGallery);
                    }}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="pt-6">
                  <AnalyticsTab />
                </TabsContent>

                {/* --- DYNAMIC VCARD TABS CONTENT --- */}
                {activeProfile.type === "VCARD" && (
                  <>
                    <TabsContent value="services" className="pt-6">
                      <ServicesTab
                        services={activeProfile.services || []}
                        onUpdate={async (newServices) => {
                          await updateServices(activeProfile.id, newServices);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="products" className="pt-6">
                      <ProductsTab
                        products={activeProfile.products || []}
                        onUpdate={async (newProducts) => {
                          await updateProducts(activeProfile.id, newProducts);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="testimonials" className="pt-6">
                      <TestimonialsTab
                        testimonials={activeProfile.testimonials || []}
                        onUpdate={async (newTestimonials) => {
                          await updateTestimonials(
                            activeProfile.id,
                            newTestimonials
                          );
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="blog" className="pt-6">
                      <BlogTab
                        blogPosts={activeProfile.blogPosts || []}
                        onUpdate={async (newBlogPosts) => {
                          await updateBlogPosts(activeProfile.id, newBlogPosts);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="hours" className="pt-6">
                      <BusinessHoursTab
                        initialBusinessHours={
                          activeProfile.businessHours || defaultBusinessHours
                        }
                        onSave={async (newBusinessHours) => {
                          await handleUpdateProfile({
                            businessHours: newBusinessHours,
                          });
                        }}
                      />
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <LivePreview profile={activeProfile} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
