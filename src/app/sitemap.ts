import type { MetadataRoute } from "next";
import { getRooms } from "@/features/rooms/api/getRooms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get the base URL from the metadata configuration
  const baseUrl = "https://capstoned.app";

  // Initialize sitemap with static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    // High Priority Public Routes (priority: 1.0-0.8)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Medium Priority Public Routes (priority: 0.7-0.5)
    {
      url: `${baseUrl}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },

    // Product Pages (priority: 0.7-0.8)
    {
      url: `${baseUrl}/content?tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/content?fitur`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/content?cara-kerja`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/content?bantuan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },

    // Content/Legal Pages (priority: 0.5-0.6)
    {
      url: `${baseUrl}/content?syarat-dan-ketentuan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/content?kebijakan-privasi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/content?kebijakan-cookie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/content?keamanan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/content?hubungi-kami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch dynamic room routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch all rooms without pagination to get complete list
    const roomsData = await getRooms({ pageSize: 1000 }); // Large pageSize to get all rooms

    // Generate sitemap entries for each room detail page
    dynamicRoutes = roomsData.rooms.map((room) => ({
      url: `${baseUrl}/v/${room.slug}`,
      lastModified: room.updatedAt ? new Date(room.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching rooms for sitemap:", error);
    // Continue with static routes only if room fetching fails
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
}
