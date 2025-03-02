export const fetchPopularServices = async () => {
    try {
      const response = await fetch("/api/services/popular"); // Replace with actual API
      if (!response.ok) throw new Error("Failed to fetch services");
      return await response.json();
    } catch (error) {
      console.error("Error fetching popular services:", error);
      return [];
    }
  };
  