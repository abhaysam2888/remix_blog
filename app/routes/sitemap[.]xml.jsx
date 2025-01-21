import service from '../appwrite/config'

async function getDynamicRoutes() {
  // Replace with actual database/API call for dynamic routes
  const posts = await service.getAllPosts()
  

  return posts.documents.map((item) => {
    const updatedAt = new Date(item.$updatedAt);
    const formattedDate = `${updatedAt.getFullYear()}-${String(updatedAt.getMonth() + 1).padStart(2, '0')}-${String(updatedAt.getDate()).padStart(2, '0')}`;
    return {
      path: `/post/${item.$id}`,
      lastModified: formattedDate,
    }
  })
}

export const loader = async () => {
  const dynamicRoutes = await getDynamicRoutes()

  const baseUrl = 'https://www.rogblog.me'

  // Static routes
  const staticRoutes = [
    { path: '/', lastModified: '2025-01-01' },
    { path: '/aboutUs', lastModified: '2025-01-02' },
    { path: '/contactUs', lastModified: '2025-01-03' },
    { path: '/privacyPolicy', lastModified: '2025-01-03' },
    { path: '/termsOfServices', lastModified: '2025-01-03' },
    { path: '/cookiePolicy', lastModified: '2025-01-03' },
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
        <lastmod>${route.lastModified}</lastmod>
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
