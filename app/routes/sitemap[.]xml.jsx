import React from 'react'
import service from '../appwrite/config'

async function getDynamicRoutes() {
  // Replace with actual database/API call for dynamic routes
  const posts = await service.getAllPosts()

  return posts.documents.map((item) => {
    return {
      path: `/post/${item.$id}`,
      lastModified: `${new Date(item.$updatedAt).getDate()}-${new Date(item.$createdAt).getMonth() + 1}-${new Date(item.$createdAt).getFullYear()}`,
    }
  })
}

export const loader = async () => {
  const dynamicRoutes = await getDynamicRoutes()

  const baseUrl = 'http://localhost:5173' // Replace with your actual domain

  // Static routes
  const staticRoutes = [
    { path: '/', lastModified: '2025-01-01' },
    { path: '/aboutUs', lastModified: '2025-01-02' },
    { path: '/contactUs', lastModified: '2025-01-03' },
    { path: '/privacyPolicy', lastModified: '2025-01-03' },
    { path: '/termsOfServices', lastModified: '2025-01-03' },
    { path: '/cookiePolicy', lastModified: '2025-01-03' },
    { path: '/UserProfile', lastModified: '2025-01-03' },
  ]

  // Combine static and dynamic routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes]

  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes
      .map(
        (route) => `
      <url>
        <loc>${baseUrl}${route.path}</loc>
        <lastmod>${new Date(route.lastModified).toISOString()}</lastmod>
      </url>
    `
      )
      .join('')}
  </urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
