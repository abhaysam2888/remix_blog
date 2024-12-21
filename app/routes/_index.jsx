import { Query } from "appwrite";
import service from "../appwrite/config";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useLoaderData, json } from "@remix-run/react";
import AllPost from "../components/AllPost";

export const meta = ({data}) => {
   const postCount = data?.totalPosts || 0;
  
  return [
    { title: `Featured Posts - ${postCount} Articles Available` },
    { name: "description", content: `Check out our ${postCount} latest posts and articles.` },
    { name: "og:title", content: `Featured Posts - ${postCount} Articles Available` },
    { name: "og:description", content: "Browse our latest blog posts and stay updated with new content." },
    { name: "og:image", content: "/default-image.jpg" },  // Update with a dynamic image if available
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

// Fetch posts with the loader
export let loader = async ({ request }) => {
  const url = new URL(request.url);

  // Parse offset and limit from the URL
  const offset = parseInt(url.searchParams.get("offset") || "0", 10); // Default to 0
  const postsPerPage = 5; // Number of posts per page

  // Fetch the posts
  const posts = await service.getPosts(Query.limit(postsPerPage), Query.offset(offset));
  
  const totalPosts = posts.total;
  const postsWithImages = await Promise.all(
    posts.documents.map(async (post) => {
      const filePreviewUrl = service.getFilePreviews(post.image);
      return {
        ...post,
        imageUrl: filePreviewUrl, // Add image URL to the post data
      };
    })
  );

  return json({
    posts: postsWithImages,
    totalPosts,
    offset,
    postsPerPage,
  });
};


export default function Index() {
  const { posts, totalPosts, offset, postsPerPage } = useLoaderData();

  return (
    <>
    <div className='hidden max-sm:block'>
      <Header/>
    </div>
    <div className='sticky mt-5 top-5 z-50 max-sm:hidden'>
      <Navbar/>
    </div>
    <AllPost offset={offset} posts={posts} postsPerPage={postsPerPage} totalPosts={totalPosts}/>
    </>
  );
}
