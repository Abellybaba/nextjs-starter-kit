import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Database, Download } from "lucide-react";

interface MigrationButtonProps {
  onMigrationComplete?: () => void;
}

export function MigrationButton({ onMigrationComplete }: MigrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleMigration = async () => {
    try {
      setIsLoading(true);
      setMigrationStatus("idle");

      // Check if there's localStorage data to migrate
      const savedProfiles = localStorage.getItem("vlink-profiles");
      if (!savedProfiles) {
        setMigrationStatus("error");
        console.log("No localStorage data found to migrate");
        return;
      }

      const profiles = JSON.parse(savedProfiles);
      if (!Array.isArray(profiles) || profiles.length === 0) {
        setMigrationStatus("error");
        console.log("No valid profiles found in localStorage");
        return;
      }

      // Send migration request
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profiles }),
      });

      if (!response.ok) {
        throw new Error("Migration failed");
      }

      // Clear localStorage after successful migration
      localStorage.removeItem("vlink-profiles");
      localStorage.removeItem("vlink-active-profile-id");

      setMigrationStatus("success");
      onMigrationComplete?.();
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Migration
        </CardTitle>
        <CardDescription>
          Migrate your local profile data to the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {migrationStatus === "success" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ Migration completed successfully! Your data is now saved in the
            database.
          </div>
        )}

        {migrationStatus === "error" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ Migration failed. Please try again or contact support.
          </div>
        )}

        <Button
          onClick={handleMigration}
          disabled={isLoading || migrationStatus === "success"}
          className="w-full"
        >
          {isLoading ? (
            "Migrating..."
          ) : migrationStatus === "success" ? (
            "Migration Complete"
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Migrate Local Data
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will move all your profiles, links, and content from local
          storage to our secure database.
        </p>
      </CardContent>
    </Card>
  );
}
