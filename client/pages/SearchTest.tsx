import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchTest() {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!zipCode.trim()) {
      alert("Please enter a ZIP code");
      return;
    }

    console.log("Search initiated for ZIP:", zipCode);
    setIsSearching(true);

    // Navigate with URL parameters
    const params = new URLSearchParams();
    params.set("zipCode", zipCode.trim());
    params.set("radius", "50");

    const url = `/all-locations?${params.toString()}`;
    console.log("Navigating to:", url);

    setTimeout(() => {
      navigate(url);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search Test</h1>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ZIP Code</label>
            <Input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code (e.g., 44111)"
              maxLength={5}
            />
          </div>
          <Button type="submit" disabled={isSearching} className="w-full">
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-medium mb-2">Debug Info:</h2>
          <p>Current ZIP: {zipCode}</p>
          <p>Is Searching: {isSearching.toString()}</p>
        </div>
      </div>
    </div>
  );
}
