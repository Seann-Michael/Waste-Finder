import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react";
import { seedTestData, testDataRetrieval } from "@/lib/seedData";
import { getLocationStats } from "@/lib/supabaseQueries";

export default function DataSeeding() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const result = await seedTestData();
      setSeedResult(result);

      if (result.success) {
        // Also get updated stats
        const newStats = await getLocationStats();
        setStats(newStats);
      }
    } catch (error) {
      setSeedResult({ success: false, error });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestData = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testDataRetrieval();
      setTestResult(result);

      // Also get stats
      const newStats = await getLocationStats();
      setStats(newStats);
    } catch (error) {
      setTestResult({ success: false, error });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Database Setup
        </h1>
        <p className="text-gray-600">
          Set up test data in your Supabase database to get started with real
          location data.
        </p>
      </div>

      {/* Current Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Current Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalLocations}
                </div>
                <div className="text-sm text-gray-600">Total Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.typeCount.landfill || 0}
                </div>
                <div className="text-sm text-gray-600">Landfills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.typeCount.transfer_station || 0}
                </div>
                <div className="text-sm text-gray-600">Transfer Stations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.typeCount.construction_landfill || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Construction Landfills
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Click "Test Data Connection" to see current stats
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Seed Data */}
        <Card>
          <CardHeader>
            <CardTitle>1. Seed Test Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Add 5 sample locations to your database for testing the
              application.
            </p>
            <Button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Data...
                </>
              ) : (
                "Seed Test Data"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Connection */}
        <Card>
          <CardHeader>
            <CardTitle>2. Test Data Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Verify that your Supabase connection is working and data can be
              retrieved.
            </p>
            <Button
              onClick={handleTestData}
              disabled={isTesting}
              variant="outline"
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                "Test Data Connection"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {seedResult && (
        <Alert
          className={`mb-4 ${seedResult.success ? "border-green-500" : "border-red-500"}`}
        >
          <div className="flex items-center gap-2">
            {seedResult.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription>
              {seedResult.success ? (
                <>
                  ✅ Successfully seeded {seedResult.locations?.length || 0}{" "}
                  locations!
                  <br />
                  <strong>Next steps:</strong> Go to the homepage to see the
                  updated location counts, or test the search functionality.
                </>
              ) : (
                <>
                  ❌ Failed to seed data:{" "}
                  {seedResult.error?.message || "Unknown error"}
                  <br />
                  <strong>Solution:</strong> Check your Supabase connection and
                  table permissions.
                </>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {testResult && (
        <Alert
          className={`mb-4 ${testResult.success ? "border-green-500" : "border-red-500"}`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription>
              {testResult.success ? (
                <>
                  ✅ Database connection working! Found{" "}
                  {testResult.locations?.length || 0} locations.
                  {testResult.locations?.length > 0 && (
                    <div className="mt-2">
                      <strong>Locations found:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {testResult.locations.slice(0, 3).map((loc: any) => (
                          <li key={loc.id} className="text-sm">
                            {loc.name} ({loc.location_type}) in {loc.city},{" "}
                            {loc.state}
                          </li>
                        ))}
                        {testResult.locations.length > 3 && (
                          <li className="text-sm">
                            ...and {testResult.locations.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  ❌ Database connection failed:{" "}
                  {testResult.error?.message || "Unknown error"}
                  <br />
                  <strong>Check:</strong> Supabase URL, API keys, and table
                  permissions.
                </>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Database Setup (Alternative)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If the automatic seeding doesn't work, you can manually run SQL in
            your Supabase dashboard:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>
              Copy and paste the SQL from <code>supabase-seed-data.sql</code>
            </li>
            <li>Execute the script</li>
            <li>Come back here and click "Test Data Connection"</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
