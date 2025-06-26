import React from "react";
import { UserProfile } from "@/utils/types";

interface DeluxeTemplateProps {
  profile: UserProfile;
}

const DeluxeTemplate: React.FC<DeluxeTemplateProps> = ({ profile }) => {
  return (
    <div className="p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">{profile.displayName}</h1>
      <p>{profile.bio}</p>
      {/* Add more template structure here */}
    </div>
  );
};

export default DeluxeTemplate;
