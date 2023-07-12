import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Article from "./Article";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}

interface ArticleData {
  category: string;
  headline: string;
  teaser: string;
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: any | undefined;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  useEffect(() => {
    const fetchData = async () => {
      if (!vote) {
        console.error("Vote contract is not loaded yet");
        return;
      }

      const proposals = await vote.getAll();

      const fetchedArticles: ArticleData[] = await Promise.all(
        proposals.map(async (proposal: any) => {
          if (proposal.description.startsWith("https://arweave.net/")) {
            const transactionId = proposal.description.split("/").pop();

            // GraphQL query
            const query = `
            query getByIds {
              transactions(ids:["${transactionId}"]) {
                edges {
                  node {
                    id
                    tags {
                      name
                      value
                    }
                  }
                }
              }
            }`;

            // Make a POST request to the GraphQL endpoint
            const response = await fetch("https://arweave.net/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: query,
              }),
            });

            const result = await response.json();

            // Get the metadata from the tags
            if (result.data.transactions.edges[0]) {
              const tags = result.data.transactions.edges[0].node.tags;
              const category = tags.find(
                (tag: any) => tag.name === "Category"
              )?.value;
              const headline = tags.find(
                (tag: any) => tag.name === "Headline"
              )?.value;
              const teaser = tags.find(
                (tag: any) => tag.name === "Teaser"
              )?.value;
              const body = tags.find((tag: any) => tag.name === "Body")?.value;

              return {
                category,
                headline,
                teaser,
                imageUrl: proposal.description,
                proposer: proposal.proposer, // assuming "proposer" is the correct property name
                timestamp: proposal.timestamp,
                body, // assuming "timestamp" is the correct property name
              };
            } else {
              console.error("No transaction data returned from Arweave");
              return null;
            }
          } else {
            return null;
          }
        })
      );

      const validArticles = fetchedArticles.filter(
        (article) => article !== null
      );

      setArticles(validArticles);
    };

    fetchData();
  }, [vote]);

  return (
    <div>
      {articles.map((article, index) => (
        <Article
          key={index}
          category={article.category}
          headline={article.headline}
          teaser={article.teaser}
          imageUrl={article.imageUrl}
          proposer={article.proposer}
          timestamp={article.timestamp}
          body={article.body}
        />
      ))}
    </div>
  );
};

export default ArticleList;
