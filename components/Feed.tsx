import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_POST } from "../graphql/queries";
import Post from "./Post";

function Feed() {
  const { data, error } = useQuery(GET_ALL_POST);


  const posts: Post[] = data?.postList;


  return <div>
    {posts?.map(post=>(
        <Post key={post.id} post={post}/>
    ))}
  </div>;
}

export default Feed;