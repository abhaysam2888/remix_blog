import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useForm, ValidationError } from '@formspree/react'

export const meta = () => {
  return [
    {
      title: 'Contact Us - rogBlog',
    },
    {
      name: 'description',
      content:
        'Get in touch with us at rogBlog. For inquiries, feedback, or support, contact us via email or fill out the form below.',
    },
    {
      name: 'og:title',
      content: 'Contact Us - rogBlog',
    },
    {
      name: 'og:description',
      content:
        'Contact rogBlog for support, inquiries, or feedback. Reach out via our form or email us directly at abhaysam2888@gmail.com.',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    { name: 'canonical', content: 'https://www.rogblog.me/contactUs' },
    { name: 'og:url', content: 'https://www.rogblog.me/contactUs' },
    { name: 'og:type', content: 'website' },
  ]
}

// Loader function to pass contact details dynamically (if needed later)
export const loader = async () => {
  return json({
    email: 'abhaysam2888@gmail.com',
    address: 'Hazaribagh, Korrah Chowk',
    customerSupportHours: '10 AM to 8 PM',
    linkedinUrl: 'https://www.linkedin.com/in/abhay-verma-821699274/',
  })
}

export default function Contact() {
  const data = useLoaderData()
  const [state, handleSubmit] = useForm('mjkkpyne')

  if (state.succeeded) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Thanks for reaching out! We will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div className="text-white min-h-screen flex flex-col">
      <main className="mx-auto max-w-4xl p-6 mt-10 flex-grow">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600">Contact Us</h1>
          <p className="mt-4 text-lg">
            We’re here to assist you. Get in touch with us today!
          </p>
        </section>

        {/* Contact Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                required
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="mt-1 p-2 w-full rounded bg-gray-800 text-white"
                rows="4"
                required
              ></textarea>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>
            <button
              type="submit"
              disabled={state.submitting}
              className="bg-blue-600 py-2 px-6 rounded text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Our Information
          </h2>
          <p className="text-gray-400">
            Email:{' '}
            <a href={`mailto:${data.email}`} className="hover:underline">
              {data.email}
            </a>
          </p>
          <p className="text-gray-400">Address: {data.address}</p>
          <p className="text-gray-400">
            Customer Support: {data.customerSupportHours}
          </p>
          <p className="text-gray-400">
            Connect with us on{' '}
            <a
              href={data.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
