// app/routes/about.tsx

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const meta = ({ data }) => {
  const { name, creator, mission } = data || {}

  return [
    {
      title: `About Us - ${name || 'rogBlog'}`,
    },
    {
      name: 'description',
      content: `Learn more about ${name || 'rogBlog'}, the creator ${creator || 'Abhay Kumar'}, and our mission: ${mission || 'Explore the unexplored'}. Discover why we created a platform for creators to express themselves and grow together.`,
    },
    {
      name: 'og:title',
      content: `About Us - ${name || 'rogBlog'}`,
    },
    {
      name: 'og:description',
      content: `${name || 'rogBlog'} is a modern blogging platform created by ${creator || 'Abhay Kumar'}, driven by the mission to help creators explore their passion and share their stories. Join us!`,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {canonical: "https://www.rogblog.me/aboutUs"},
    {"og:url": "https://www.rogblog.me/aboutUs"},
    {"og:type": "website"},
  ]
}

// Loader function to fetch data (if any dynamic content is needed later)
export const loader = async () => {
  return json({
    name: 'rogBlog',
    creator: 'Abhay Kumar',
    mission: 'Explore the unexplored',
    features: [
      'User-friendly interface',
      'Responsive design',
      'Modern blogging platform',
      'Share Your Passion and Knowledge',
      'Build a Personal Brand',
      'Connect with a Like-Minded Community',
      'Explore Unlimited Possibilities',
      'Monetize Your Content (coming soon)',
    ],
  })
}

export default function About() {
  const data = useLoaderData()

  return (
    <main className="mx-auto max-w-4xl p-6 text-white mt-10">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">About Us</h1>
        <p className="mt-4 text-lg">
          Welcome to <span className="font-semibold">{data.name}</span> – where
          your stories, ideas, and creativity come alive! 🎉
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Who We Are</h2>
        <p className="leading-relaxed">
          I’m <span className="font-bold">{data.creator}</span>, the creator of{' '}
          <span className="font-semibold">{data.name} </span>
          and currently pursuing my bachelor’s degree. Inspired by the dream of
          building something meaningful (and yes, earning a little along the
          way! 💰), I set out to develop a space where anyone can express
          themselves freely and connect with a world of readers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Why {data.name}?
        </h2>
        <p className="leading-relaxed mb-4">
          We’re more than just a blogging platform – we’re a canvas for your
          imagination. <span className="font-semibold">{data.name}</span>{' '}
          offers:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          {data.features.map((feature, index) => (
            <li key={index} className="text-gray-500">
              {feature}
            </li>
          ))}
        </ul>
        <p className="leading-relaxed mt-4">
          Our mission is simple: <em>{data.mission}</em>. By sharing stories and
          ideas, we grow together as creators and as a community.
        </p>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold text-gray-400 mb-4">Join Us!</h2>
        <p className="leading-relaxed">
          Whether you’re here to write, read, or discover,{' '}
          <span className="font-semibold">{data.name}</span> is your space to
          explore and connect. Start your journey today – because your voice
          matters.
        </p>
      </section>
    </main>
  )
}
