import { Box } from "@chakra-ui/react";
import React from "react";
import SearchAddress from "./SearchAddress";

export default function Sidebar() {
  return (
    <Box className="fixed top-0 z-40 flex justify-between md:w-[280px] gap-3 p-4 bg-white border md:static w-full h-full md:max-h-screen md:min-h-screen border-t-gray-300 md:border-l-gray-300 md:flex-col">
      <Box className="fixed z-50 flex items-center justify-center w-1/4 h-16 bg-white y-0">
        <SearchAddress />
      </Box>
      Recommendations
    </Box>
  );
}
