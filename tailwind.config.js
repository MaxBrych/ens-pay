/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-bg":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1122534199363113090/Desktop_-_12.png')",
        "hero-bg-desktop":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1122603145969807491/bg-desktop.png')",
        "hero-bg-mobile":
          "url('https://cdn.discordapp.com/attachments/911669935363752026/1123847046210781284/mobile_bg02.png')",

        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
