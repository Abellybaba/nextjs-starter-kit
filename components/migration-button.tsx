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
  onMigrate: () => Promise<{ success: boolean; migratedCount: number }>;
}

export function MigrationButton({ onMigrate }: MigrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [migratedCount, setMigratedCount] = useState(0);

  const handleMigration = async () => {
    try {
      setIsLoading(true);
      setMigrationStatus("idle");

      const result = await onMigrate();

      if (result.success) {
        setMigrationStatus("success");
        setMigratedCount(result.migratedCount);
      } else {
        setMigrationStatus("error");
      }
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
            ✅ Migration completed successfully! {migratedCount} profile
            {migratedCount !== 1 ? "s" : ""} migrated to the database.
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
