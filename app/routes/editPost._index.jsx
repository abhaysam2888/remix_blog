// Meta function for SEO tags
export const meta = () => {
  return [
    { title: 'EditPost - Static Content' },
    {
      name: 'description',
      content: 'This is a static EditPost page displaying prewritten content.',
    },
  ]
}

export default function EditPost() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="max-w-2xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Static EditPost</h1>
        <p className="text-lg">
          Welcome to the EditPost page! This is a static page that displays
          prewritten text without any dynamic content or data fetching.
        </p>
      </div>
    </div>
  )
}
