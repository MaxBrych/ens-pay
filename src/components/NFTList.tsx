import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ETH_API_KEY || " ",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// Define a type for the NFTs.
type NFT = {
  tokenId: string;
  title: string;
  description: string;
  media?: Array<{
    gateway: string;
  }>;
};

interface NFTListProps {
  ownerAddress: string | null;
}

function NFTList({ ownerAddress }: NFTListProps) {
  // Use the NFT type when defining the state variable.
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [showAll, setShowAll] = useState(false);

  const viewAll = () => {
    setItemsToShow(nfts.length);
    setShowAll(true);
  };

  const showLess = () => {
    setItemsToShow(4);
    setShowAll(false);
  };

  useEffect(() => {
    const fetchNfts = async () => {
      if (ownerAddress) {
        const nfts = await alchemy.nft.getNftsForOwner(ownerAddress);
        setNfts(nfts.ownedNfts);
        setLoading(false);
      }
    };
    fetchNfts();
  }, [ownerAddress]);

  if (loading) {
    return <div className="w-full mt-2 text-xs text-center">Loading...</div>;
  }

  return (
    <Box p={4} pt={1}>
      <Heading
        fontSize={{ base: "md", md: "lg" }}
        mb={2}
        className="text-lg font-semibold"
      >
        {" "}
        NFTs{" "}
      </Heading>
      <SimpleGrid minChildWidth="120px" spacing="40px" gap={4}>
        {nfts.slice(0, itemsToShow).map(
          (nft, index) => (
            console.log(nft),
            (
              <Box height="80px" key={index}>
                <a
                  href={`https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {nft.media && nft.media[0] && (
                    <img
                      src={nft.media[0].gateway}
                      alt={"nft.title"}
                      className="mb-1 rounded-xl"
                    />
                  )}

                  <Heading
                    fontSize={{ base: "xs", md: "sm" }}
                    className="text-sm font-semibold"
                  >
                    {nft.title}
                  </Heading>
                </a>
              </Box>
            )
          )
        )}
        {showAll ? (
          <Button onClick={showLess}>Show Less</Button>
        ) : (
          itemsToShow < nfts.length && (
            <Button
              colorScheme="gray"
              textColor={"gray.700"}
              bg={"gray.100"}
              fontSize={"sm"}
              rounded={"full"}
              height={"36px"}
              onClick={viewAll}
            >
              View All
            </Button>
          )
        )}
      </SimpleGrid>
    </Box>
  );
}

export default NFTList;
