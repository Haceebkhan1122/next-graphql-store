"use client";

import { client } from "@/app/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

export default function ApolloProviderWrapper({ children }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}