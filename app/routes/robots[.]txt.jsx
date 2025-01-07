export const loader = () => {
  const baseUrl = 'https://www.rogblog.me'
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
