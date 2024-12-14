import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useState } from "react";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

async function getLists() {
  const testing = await fetch('https://fakestoreapi.com/products')
  
  if (!testing) return

  return testing.json()

}



export default function Index() {
  const [res, setRes] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getLists()
        setRes(data)
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(true)
      }
    }
    fetchData()
  },[])
  
  if (loading) {
    return (
      <p>Loading......</p>
    )
  }
  
  return (
    <div className="flex flex-wrap h-screen items-center justify-center space-x-5">
      <table>
      <thead>
      <tr>
    <th>ID</th>
    <th>category</th>
    <th>description</th>
    <th>price</th>
    <th>rating</th>
  </tr>
      </thead>
  <tbody>
  {res && res.map(({ id, category, description, price, rating }) => (
        <tr key={id}>
          <td className="px-4 py-2 border border-gray-300">{id}</td>
          <td className="px-4 py-2 border border-gray-300">{category}</td>
          <td className="px-4 py-2 border border-gray-300 line-clamp-1 w-64 leading-10">{description}</td>
          <td className="px-4 py-2 border border-gray-300">{price}</td>
          <td className="px-4 py-2 border border-gray-300">{rating.rate}</td>
        </tr>
      ))}
      </tbody>
</table>

      <Link to="/staticHt">server side rendring</Link>
    </div>
  );
}