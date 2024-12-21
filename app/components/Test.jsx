import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import service from "../appwrite/config";
import { Query } from "appwrite";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

// Loader function for SSR data fetching
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 5;

  try {
    const posts = await service.getPosts(Query.limit(limit || 500));
    if(!posts){
        throw new Response("Failed to fetch posts", { status: 500 });
    }
    
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Response("Failed to fetch posts", { status: 500 });
  }
};

// Component
export default function Test() {
  const  posts  = useLoaderData();
  const [limit, setLimit] = useState(5);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 4);
    // Dynamically update query params to refetch data
    window.location.search = `?limit=${limit + 4}`;
  };

  return (
    <div className="w-full h-full mt-16">
      <div className="mx-auto max-w-6xl p-5">
        {/* Post Type */}
        <div className="w-full py-5 px-5 border-b-[1px] mb-5 border-white/[0.6]">
          <h1 className="text-3xl">Featured post</h1>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((item) => (
            <div key={item.$id}>
              <Link to={`/post/${item.title}`}>
                <div className="flex justify-between max-md:border max-md:rounded-lg max-md:overflow-hidden items-center max-md:flex-col">
                  <div className="max-md:w-full max-md:h-full max-md:flex max-md:justify-center">
                    <img
                      src={service.getFilePreviews(item.image)}
                      alt={item.title}
                      className="w-[390px] max-[846px]:w-[320px] max-md:w-full max-md:h-[320px] h-[220px] object-cover max-[375px]:h-[220px]"
                      loading="lazy"
                    />
                  </div>

                  <div className="max-w-2xl space-y-4 max-[1145px]:max-w-xl max-[1042px]:max-w-lg max-[961px]:max-w-sm max-md:max-w-full max-md:px-10 max-md:my-10 max-[481px]:px-4 max-[375px]:my-4">
                    <div className="flex space-x-4">
                      <div className="space-x-2 flex items-center justify-center text-gray-300">
                        <span>
                          <FontAwesomeIcon icon={faUser} className="w-3" />
                        </span>
                        <span>{item.username || "username"}</span>
                      </div>
                      <p className="text-gray-300">
                        {`${new Date(item.$createdAt).getDate()}-${new Date(
                          item.$createdAt
                        ).getMonth() + 1}-${new Date(item.$createdAt).getFullYear()}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-3xl whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1">
                        {item.title || "Title Lorem ipsum, dolor sit amet consectetur adipisicing elit."}
                      </span>
                    </div>
                    <div>
                      <span className="line-clamp-3">
                        {parse(item.content) ||
                          "Some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, repellendus."}
                      </span>
                    </div>
                    <div>
                      <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                        <span>Read more</span>
                        <span>
                          <FontAwesomeIcon icon={faAngleRight} className="text-gray-700" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="flex justify-center items-center flex-col mb-5 mt-5 w-full">
        <button
          className={`px-3 py-1 max-w-32 bg-gray-600 rounded-full ${hasMore ? "block" : "hidden"}`}
          onClick={handleLoadMore}
        >
          Load More
        </button>
        <p className={`${hasMore ? "hidden" : "block"} text-2xl`}>No more Articles</p>
      </div>
    </div>
  );
}
