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
  title: string;
  description: string;
  metadata: {
    image: string;
  };
  contractAddress: string;
  tokenId: string;
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
                <img
                  src={nft.rawMetadata?.image}
                  alt={"not found"}
                  className="object-cover w-full h-128 rounded-t-md"
                />
                <Heading fontSize={"sm"} className="text-sm font-semibold">
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
  );
}

export default NFTList;
