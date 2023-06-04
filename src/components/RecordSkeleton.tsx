import { Box, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";

function ENSRecordSkeleton(children: any, isLoaded: any) {
  return <Skeleton isLoaded={isLoaded}>{children}</Skeleton>;
}

export default function ProfilePage() {
  const router = useRouter();
  const { address } = router.query;
  const { data, isLoading } = useGetENSRecord(address);

  return (
    <Box>
      <ENSRecordSkeleton isLoaded={!isLoading}>
        <h1>{data?.name}</h1>
      </ENSRecordSkeleton>
      <ENSRecordSkeleton isLoaded={!isLoading}>
        <h2>{data?.description}</h2>
      </ENSRecordSkeleton>
      <ENSRecordSkeleton isLoaded={!isLoading}>
        <img src={data?.avatar} />
      </ENSRecordSkeleton>
      {/* Add more fields as needed... */}
    </Box>
  );
}
function useGetENSRecord(address: string | string[] | undefined): {
  data: any;
  isLoading: any;
} {
  throw new Error("Function not implemented.");
}
