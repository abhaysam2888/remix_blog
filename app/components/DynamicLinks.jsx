import * as React from 'react'
import { useMatches } from '@remix-run/react'

export const DynamicLinks = () => {
  const matches = useMatches()

  let links = []

  for (const match of matches) {
    if (typeof match.handle?.dynamicLinks === 'function') {
      const routeLinks = match.handle.dynamicLinks({
        data: match.data || {},
      })

      if (Array.isArray(routeLinks)) {
        links.push(...routeLinks)
      } else {
        console.error(
          `dynamicLinks for route ${match.id} must return an array.`
        )
      }
    }
  }

  return (
    <>
      {links.map((link, index) => (
        <link key={index} {...link} />
      ))}
    </>
  )
}
