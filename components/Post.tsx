import React from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";

type Props = {
  post: Post;
};

function Post({ post }: Props) {
  console.log(post)
  return (
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm  hover:border hover:border-gray-600">
      {/* Vote */}
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon className="voteButtons hover:text-red-400" />
        <p className="text-xs font-bold text-black">0</p>
        <ArrowDownIcon className="voteButtons hover:text-blue-400" />
      </div>

      <div className="p-3 pb-1">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Avatar seed={post.subreddit?.topic} />
          <p className="text-xs text-gray-400">
            <span className="font-bold text-black hover:text-blue-400 hover:underline">
              r/{post.subreddit?.topic}
            </span>{" "}
            • Posted by u/
            {post.username} <TimeAgo date={post.created_at} />
          </p>
        </div>
        {/* Body */}
        <div className="py-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2 font-sm font-light">{post.body}</p>
        </div>
        {/* Image */}
        {/* Footer */}
      </div>
    </div>
  );
}

export default Post;