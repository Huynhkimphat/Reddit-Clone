import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String
    $subreddit_id: ID
    $title: String
    $username: String
    $image: String
    $created_at: DateTime
  ) {
    insertPost(
      body: $body
      subreddit_id: $subreddit_id
      title: $title
      username: $username
      image: $image
      created_at: $created_at
    ) {
      body
      subreddit_id
      title
      username
      image
      created_at
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String, $created_at: DateTime) {
    insertSubreddit(topic: $topic, created_at: $created_at) {
      id
      topic
      created_at
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation(
    $post_id: ID!
    $username: String!
    $text: String!
    $created_at: DateTime!
  ) {
    insertComment(
      post_id: $post_id
      text: $text
      username: $username
      created_at: $created_at
    ) {
      created_at
      id
      post_id
      text
      username
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation(
    $username: String
    $post_id: ID
    $created_at: DateTime
    $upvote: Boolean
  ) {
    insertVote(
      username: $username
      post_id: $post_id
      created_at: $created_at
      upvote: $upvote
    ) {
      username
      post_id
      created_at
      upvote
    }
  }
`;
