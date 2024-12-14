import { useLoaderData } from "@remix-run/react";


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

export async function loader() {
  const testing = await fetch('https://fakestoreapi.com/products')
  
  if (!testing) return

  return testing.json()
}



export default function staticHt() {
  const data = useLoaderData();
  console.log(data[0]);

  if (data) {
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
    {data && data.map(({ id, category, description, price, rating }) => (
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
  
        
      </div>
    );
  }
  
  return (
    <div>
      <p>you are in ssr page</p>
    </div>
  )
  
}
