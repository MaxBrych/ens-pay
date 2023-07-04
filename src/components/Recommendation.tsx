import { Box } from "@chakra-ui/react";
import React from "react";
import SearchAddress from "./SearchAddress";

export default function Recommendation() {
  return (
    <Box className="w-full min-h-screen border max-w-1/4 border-l-gray-300">
      <Box className="fixed z-50 flex items-center justify-center w-1/4 h-16 bg-white y-0">
        <SearchAddress />
      </Box>
      Recommendations
    </Box>
  );
}
