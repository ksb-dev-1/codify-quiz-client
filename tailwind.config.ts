import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#001E2B",
        hover: "#555",
      },
      backgroundColor: {
        primary: "#001E2B",
        hover: "#555",
      },
      borderColor: {
        DEFAULT: "#cbd5e1", // Default border color
      },
      borderRadius: {
        custom: "0px",
      },
      boxShadow: {
        // custom: "0 6px 12px rgba(30, 10, 58, 0.08)",
        // custom: "0 0px 15px rgba(0, 0, 0, 0.2)",
        custom:
          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
      },
    },
  },
  plugins: [],
};
export default config;
