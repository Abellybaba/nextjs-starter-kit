import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { migrateLocalStorageToDatabase } from "@/lib/migrate-data";

export async function POST(request: NextRequest) {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });

    if (!result?.session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profiles: localStorageProfiles } = body;

    if (!localStorageProfiles || !Array.isArray(localStorageProfiles)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const result_migration = await migrateLocalStorageToDatabase(
      result.session.userId,
      localStorageProfiles
    );

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${result_migration.migratedProfiles} profiles`,
      migratedProfiles: result_migration.migratedProfiles,
    });
  } catch (error) {
    console.error("Migration API error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
