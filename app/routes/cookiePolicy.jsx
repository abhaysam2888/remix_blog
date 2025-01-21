import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

// Meta tags for the Cookie Policy route
export const meta = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Cookie Policy - rogBlog' },
    {
      name: 'description',
      content:
        'Learn about the cookies we use to enhance your experience on rogBlog.',
    },
    { name: 'robots', content: 'index,follow' },
    { name: 'canonical', content: 'https://www.rogblog.me/cookiePolicy' },
    { name: 'og:url', content: 'https://www.rogblog.me/cookiePolicy' },
    { name: 'og:type', content: 'website' },
    {
      name: 'og:title',
      content: 'Cookie Policy - rogBlog',
    },
    {
      name: 'og:description',
      content:
        'Learn about the cookies we use to enhance your experience on rogBlog.',
    },
  ]
}

// Loader function for SSR
export const loader = async () => {
  return json({
    siteName: 'rogBlog',
    cookieTypes: ['Functionality Cookies', 'Session Cookies'],
    purposes: [
      'Enable login sessions for registered users.',
      'Remember user preferences (coming soon).',
    ],
    thirdParty: ['Google Analytics (coming soon)'],
    audience: 'All countries',
  })
}

export default function CookiePolicy() {
  const data = useLoaderData()

  return (
    <main className="bg-gray-900 text-white p-6 max-w-4xl mx-auto mt-10 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">Cookie Policy</h1>
      <p className="mb-4 text-lg">
        This Cookie Policy explains how <strong>{data.siteName}</strong> uses
        cookies to enhance your experience and provide essential services.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Types of Cookies We Use
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          {data.cookieTypes.map((type, index) => (
            <li key={index} className="text-gray-400">
              {type}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Why We Use Cookies
        </h2>
        <p className="text-gray-400">
          We use cookies to provide the following functionalities:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          {data.purposes.map((purpose, index) => (
            <li key={index} className="text-gray-400">
              {purpose}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Third-Party Cookies
        </h2>
        <p className="text-gray-400">
          We currently plan to integrate the following third-party services to
          improve our platform:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          {data.thirdParty.map((service, index) => (
            <li key={index} className="text-gray-400">
              {service}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Audience</h2>
        <p className="text-gray-400">
          This Cookie Policy applies to all users, regardless of their country
          or region.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Control Over Cookies
        </h2>
        <p className="text-gray-400">
          At this time, we do not offer options to control or disable cookies.
          By using our website, you agree to our use of cookies as described in
          this policy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white mb-2">Contact Us</h2>
        <p className="text-gray-400">
          If you have any questions about our Cookie Policy, feel free to
          contact us at:{' '}
          <a
            href="mailto:abhaysam2888@gmail.com"
            className="text-blue-500 hover:underline"
          >
            abhaysam2888@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}
