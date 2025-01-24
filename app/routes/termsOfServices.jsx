import React from 'react'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

// Meta tags for the Terms of Service page
export const meta = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Terms of Service - Write Blogs With No Restrictions' },
    {
      name: 'description',
      content:
        'Read the Terms of Service for using our blogging platform for knowledge sharing and community engagement.',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'robots', content: 'index,follow' },
    {
      name: 'og:title',
      content: 'Terms of Service - Write Blogs With No Restrictions',
    },
    {
      name: 'og:description',
      content: 'Review the rules and policies for using our blogging platform.',
    },
    { name: 'canonical', content: 'https://www.rogblog.me/termsOfServices' },
  ]
}

export const links = () => {
  return [{ rel: 'canonical', href: 'https://www.rogblog.me/termsOfServices' }]
}


// Loader function to fetch dynamic data (if necessary)
export const loader = async () => {
  return json({
    serviceName: 'Write Blogs With No Restrictions',
    purpose: 'Blogging platform, knowledge sharing, community engagement',
    userEligibility: 'Any age',
    contentOwnership: 'Users have sole ownership of their content.',
    userResponsibilities: [
      'No spamming',
      'No posting illegal activities',
      'No copyright violations',
    ],
    usageRules: 'Spamming is strictly prohibited.',
    monetization: 'Monetization features are coming soon.',
    terminationPolicy:
      'Accounts will be terminated if users post nonsensical or copyrighted content.',
    governingLaw: 'India',
  })
}

export default function TermsOfService() {
  const data = useLoaderData()

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-500">
        Terms of Service
      </h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
        <p>
          <span className="font-semibold">{data.serviceName}</span>! By
          accessing or using our platform, you agree to comply with the
          following terms. Please read them carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Purpose</h2>
        <p>{data.purpose}.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">User Eligibility</h2>
        <p>This platform is open to users of all ages.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Content Ownership</h2>
        <p>
          Users retain sole ownership of all content they publish on{' '}
          <span className="font-semibold">{data.serviceName}</span>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
        <ul className="list-disc list-inside space-y-2">
          {data.userResponsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Platform Usage Rules</h2>
        <p>{data.usageRules}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Monetization</h2>
        <p>{data.monetization}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Termination Policy</h2>
        <p>{data.terminationPolicy}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
        <p>
          These terms are governed by the laws of {data.governingLaw}. Any
          disputes arising will be subject to the jurisdiction of the courts in
          India.
        </p>
      </section>

      <section className="text-center mt-8">
        <p className="text-gray-400">
          If you have questions about these terms, please contact us at{' '}
          <a href="mailto:abhaysam2888@gmail.com" className="text-blue-400">
            abhaysam2888@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}
