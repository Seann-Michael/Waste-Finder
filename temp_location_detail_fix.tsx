const loadLocationData = async () => {
  setIsLoading(true);
  try {
    // Fetch location data from server
    const response = await fetch(`/api/locations/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    const fetchedLocation = data.data;

    if (!fetchedLocation) {
      throw new Error("Location not found");
    }

    // Mock reviews data (this would typically come from a separate API endpoint)
    const mockReviews: Review[] = [
      {
        id: "1",
        locationId: fetchedLocation.id,
        rating: 5,
        content:
          "Excellent facility with friendly staff. Very organized and clean. Pricing is fair and competitive.",
        authorName: "Mike T.",
        isApproved: true,
        isModerated: true,
        createdAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "2",
        locationId: fetchedLocation.id,
        rating: 4,
        content:
          "Good location for construction debris disposal. Quick service, though parking can be limited during peak hours.",
        authorName: "Sarah L.",
        isApproved: true,
        isModerated: true,
        createdAt: "2024-01-08T00:00:00Z",
      },
      {
        id: "3",
        locationId: fetchedLocation.id,
        rating: 5,
        content:
          "Love that they have a comprehensive recycling center. Staff helped me properly dispose of old electronics and appliances.",
        authorName: "Jennifer R.",
        isApproved: true,
        isModerated: true,
        createdAt: "2023-12-28T00:00:00Z",
      },
    ];

    setLocation(fetchedLocation);
    setReviews(mockReviews);
  } catch (error) {
    console.error("Error loading location:", error);
  } finally {
    setIsLoading(false);
  }
};
