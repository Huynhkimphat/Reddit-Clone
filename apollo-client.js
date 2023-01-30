import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://altagracia.stepzen.net/api/unrealized-zebra/__graphql",
    headers:{
        Authorization: `APIKey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
    },
    cache: new InMemoryCache(),
});

export default client;