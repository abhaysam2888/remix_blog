export const loader = () => {
  const baseUrl = 'http://localhost:5173' // Replace with your actual domain

  return new Response(
    `User-agent: *
  Allow: /
  Sitemap: ${baseUrl}/sitemap.xml
  `,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  )
}
