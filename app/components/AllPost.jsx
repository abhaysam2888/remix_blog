import React from "react";
import { Link, useNavigate } from "@remix-run/react";
import Button from "./Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import parse from "html-react-parser";

export default function AllPost({ posts, totalPosts, offset, postsPerPage }) { 

  const navigate = useNavigate();
    
    // Calculate total pages and current page
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const currentPage = Math.floor(offset / postsPerPage) + 1;
  
    // Calculate next and previous offsets
    const nextOffset = offset + postsPerPage;
    const prevOffset = offset - postsPerPage;
  
    // Handle page navigation
    const handlePageChange = (newOffset) => {
      navigate(`?offset=${newOffset}`);
    };
  

  return (
    <div className="w-full h-full mt-16">
      <div className="mx-auto max-w-6xl p-5">
      {/* post type */}
        <div className="w-full py-5 px-5 border-b-[1px] mb-5 border-white/[0.6]">
          <h1 className="text-3xl text-white">
            Featured post
          </h1>
        </div>
        {/* post */}
        <div className="space-y-6">
        {
          posts && posts.map((item) => (
            
              <div key={item.$id}>

                <Link 
                to={`/post/${item.$id}`} 
                key={item.title}
                state={item.$id}>

                  <div className="flex justify-between max-md:border max-md:rounded-lg max-md:overflow-hidden items-center max-md:flex-col">
                    {/* images */}
                    <div className="max-md:w-full max-md:h-full max-md:flex max-md:justify-center">
                      <img src={item.imageUrl} alt={item.title} className="w-[390px] max-[846px]:w-[320px] max-md:w-full max-md:h-[320px] h-[220px] object-cover max-[375px]:h-[220px]" loading="lazy"/>
                    </div>
                    
                  <div className="max-w-2xl space-y-4 max-[1145px]:max-w-xl max-[1042px]:max-w-lg max-[961px]:max-w-sm max-md:max-w-full max-md:px-10 max-md:my-10 max-[481px]:px-4 max-[375px]:my-4">
                    {/* auther name */}
                  <div className="flex space-x-4">
                    <div className="space-x-2 flex items-center justify-center text-gray-300">
                      <span>
                      <FontAwesomeIcon icon={faUser} className="w-3"/>
                      </span>
                      <span>
                      {item.username || "username"}
                      </span>
                  </div>
                    <p className="text-gray-300">
                        {
                            `${new Date(item.$createdAt).getDate()}-${new Date(item.$createdAt).getMonth()+1}-${new Date(item.$createdAt).getFullYear()}`
                        }
                    </p>
                  </div>
                  {/* title */}
                  <div>
                      <span className="text-3xl whitespace-nowrap overflow-hidden text-ellipsis text-white line-clamp-1">{item.title || "Title Lorem ipsum, dolor sit amet consectetur adipisicing elit."}</span>
                  </div>
                  <div>
                    {/* content */}
                    <span className="line-clamp-3 text-white">
                      {parse(item.content) || "some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit deleniti illum eum accusantium! Sapiente ducimus facere minus iusto beatae dolorum accusantium voluptatibus. Fuga dolor deleniti inventore odit minima repudiandae beatae."}
                    </span>
                  </div>
                  <div>
                    {/* readmore btn */}
                    <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span>Read more</span>
                    <span>
                    <FontAwesomeIcon icon={faAngleRight} className="text-gray-700"/>
                    </span>
                    </Button>
                  </div>
                  </div>
                  </div>
                </Link>
            </div>
          ))
        }
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mb-5 mt-5 w-full">
      {/* Pagination controls */}
      <div className="flex justify-center items-center flex-col mb-5 mt-5 w-full">
            <div className="pagination flex space-x-2 items-center">
              {/* Previous button */}
            {prevOffset >= 0 && (
              <Button onClick={() => handlePageChange(prevOffset)}>Previous</Button>
            )}
            {/* Page information */}
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            {/* Next button */}
            {nextOffset < totalPosts && (
              <Button onClick={() => handlePageChange(nextOffset)}>Next</Button>
            )}
            </div>
          </div>
      </div>
    </div>
  );
}
