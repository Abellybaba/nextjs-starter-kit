"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { UserProfile } from "@/utils/types";
import { templates } from "@/lib/constants";

interface PublicProfilePageProps {
  params: {
    username: string;
  };
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile by username
        const response = await fetch(
          `/api/profiles?username=${encodeURIComponent(params.username)}`
        );

        if (response.status === 404) {
          notFound();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        // The API should return a single profile when searching by username
        const profileData = Array.isArray(data) ? data[0] : data;

        if (!profileData) {
          notFound();
          return;
        }

        setProfile(profileData);

        // Track page view
        try {
          await fetch(`/api/profiles/${profileData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ views: (profileData.views || 0) + 1 }),
          });
        } catch (viewError) {
          console.error("Failed to track view:", viewError);
          // Don't block the page load if view tracking fails
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (params.username) {
      fetchProfile();
    }
  }, [params.username]);

  const handleLinkClick = async (linkId: string) => {
    try {
      // Track link click
      await fetch(`/api/profiles/${profile?.id}/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clicks: 1 }), // Increment clicks
      });
    } catch (error) {
      console.error("Failed to track link click:", error);
      // Don't block navigation if tracking fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    notFound();
    return null;
  }

  // Find the template component
  const TemplateComponent = templates.find(
    (t) => t.name === profile.template
  )?.component;

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Template Not Found</h1>
          <p className="text-muted-foreground">
            The template for this profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // Create a profile object with click tracking
  const profileWithTracking = {
    ...profile,
    onLinkClick: handleLinkClick,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TemplateComponent profile={profileWithTracking} />
    </div>
  );
}
