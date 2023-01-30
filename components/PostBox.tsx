import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import { LinkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import client from "../apollo-client";
import { GET_SUBREDDIT_BY_TOPIC } from "../graphql/queries";
import toast from "react-hot-toast";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
};

function PostBox() {
  const { data: session } = useSession();
  const [imageOpenBox, setImageOpenBox] = useState<boolean>(false);

  const [addPost] = useMutation(ADD_POST);

  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formdata) => {
    console.log(formdata);

    const notification = toast.loading("Creating new post...");

    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formdata.subreddit,
        },
      });

      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        // create subreddit
        console.log("Subreddit is new! -> creating a NEW subreddit");

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formdata.subreddit,
            created_at: new Date(),
          },
        });

        console.log("Creating Post...", formdata);
        const image = formdata.postImage || "";

        const {
          data: { insetPost: newPost },
        } = await addPost({
          variables: {
            body: formdata.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formdata.postTitle,
            username: session?.user?.name,
            created_at: new Date(),
          },
        });
        console.log("New Post Added", newPost);
      } else {
        // use subreddit
        console.log("Using existing subreddit!");
        console.log(getSubredditListByTopic);

        const image = formdata.postImage || "";
        console.log("Creating Post...", formdata);
        const {
          data: { insetPost: newPost },
        } = await addPost({
          variables: {
            body: formdata.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formdata.postTitle,
            username: session?.user?.name,
            created_at: new Date(),
          },
        });
        console.log("New Post Added", newPost);
      }

      // After the post has been added

      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");
      toast.success("New Post Created!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops somethings went wrong", {
        id: notification,
      });
    }
  });
  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar />

        <input
          {...register("postTitle", { required: true })}
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          type="text"
          placeholder={
            session ? "Create a post by entering a title" : "Sign in to post"
          }
        />
        <PhotoIcon
          onClick={() => setImageOpenBox(!imageOpenBox)}
          className={`h-6 text-gray-300 cursor-pointer ${
            imageOpenBox && "text-blue-300"
          }`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body: </p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (Optional)"
            />
          </div>

          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Subreddit: </p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register("subreddit", { required: true })}
              type="text"
              placeholder="i.e. reactjs"
            />
          </div>

          {imageOpenBox && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL: </p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Optional"
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors?.postTitle?.type === "required" && (
                <p>A post title is required</p>
              )}
              {errors?.subreddit?.type === "required" && (
                <p>A post subreddit is required</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
