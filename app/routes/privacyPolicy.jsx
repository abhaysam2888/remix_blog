import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const meta = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Privacy Policy - rogBlog' },
    {
      name: 'description',
      content: 'Learn how rogBlog handles your data responsibly and securely.',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index,follow' },
    { name: 'og:title', content: 'Privacy Policy - rogBlog' },
    {
      name: 'og:description',
      content: 'Learn how rogBlog handles your data responsibly and securely.',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'canonical', content: 'https://www.rogblog.me/privacyPolicy' },
  ]
}

export const loader = async () => {
  return json({
    companyName: 'rogBlog',
    dataCollected: [
      'Name',
      'Email',
      'IP Address',
      'Cookies',
      'Blog-related Data',
    ],
    usage:
      'Currently, no data usage beyond session management. Future updates may include personalized features or communication.',
    thirdParties: ['Google Authentication for login'],
    cookies:
      'Cookies are used for session management and enhancing user experience.',
    userRights: 'Users can access, update, and delete their data at any time.',
    jurisdiction: 'India',
    security: [
      'Encryption of sensitive data',
      'Secure HTTPS connections',
      'Regular security audits',
    ],
  })
}

export default function PrivacyPolicy() {
  const data = useLoaderData()

  return (
    <main className="min-h-screen mt-5 text-gray-100">
      <section className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-500 mb-6">
          Privacy Policy
        </h1>
        <p className="mb-4">
          At <span className="font-semibold">{data.companyName}</span>, we
          prioritize your privacy and are committed to safeguarding your
          personal data. This Privacy Policy outlines how we collect, use, and
          protect your information.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            1. Data We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {data.dataCollected.map((item, index) => (
              <li key={index} className="text-gray-400">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            2. How We Use Your Data
          </h2>
          <p className="text-gray-400">{data.usage}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            3. Third-Party Services
          </h2>
          <p className="text-gray-400">
            We utilize third-party services such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            {data.thirdParties.map((item, index) => (
              <li key={index} className="text-gray-400">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            4. Cookies
          </h2>
          <p className="text-gray-400">{data.cookies}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            5. User Rights
          </h2>
          <p className="text-gray-400">{data.userRights}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            6. Security Measures
          </h2>
          <p className="text-gray-400">
            To protect your data, we implement the following measures:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            {data.security.map((measure, index) => (
              <li key={index} className="text-gray-400">
                {measure}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            7. Jurisdiction
          </h2>
          <p className="text-gray-400">
            This policy is governed by the laws of {data.jurisdiction}.
          </p>
        </section>

        <section className="text-center mt-12">
          <p className="text-gray-400">
            We may update this Privacy Policy from time to time. Please revisit
            this page for the latest information.
          </p>
        </section>
      </section>
    </main>
  )
}
