module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    // arbitrary value 쓰는 경우
    "backdrop-blur-[1px]",
    "backdrop-blur-[2px]",
    "backdrop-blur-[3px]",
  ],
};
