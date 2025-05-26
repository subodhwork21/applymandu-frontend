import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
       fontFamily: {
        nasalization: ['var(--font-nasalization)'],
        poppins: ['var(--font-poppins)'],
      },
      colors: {
        manduPrimary: {
          DEFAULT: "#001C4A",
        },
        
        manduSecondary: {
          DEFAULT: "#DC143C",
      
        },
        manduTertiary: {
          DEFAULT: "#F2F2F2",
        },
        manduBorder: {
          DEFAULT: "#404040",
        },
        grayText: {
          DEFAULT: "#D1D1D1",
        },
        patternText: {
          DEFAULT: "#003893",
        },
        patternPrimary:{
          DEFAULT: "#013893",
        },
        patternSecondary:{
          DEFAULT: "#001C4A",
        },
        grayColor: {
          DEFAULT: "#525252"
        },
        pureGray: {
          DEFAULT: "#333333",
        },
        bluePrime: {
          DEFAULT: "#2D3748",
        },
        grayTag: {
          DEFAULT: "#F1F1F1",
        },
        profileNameText: {
          DEFAULT: "#00090F"
        },
        dashboardTitle: {
          DEFAULT: "#001C4A",
        },
        dashboardTitleLight: {
          DEFAULT: "#64748B",
        },
        activityText: {
          DEFAULT: "#262626",
        },
        activityTextLight: {
          DEFAULT: "#737373",
        },
        iconHeart: {
          DEFAULT: "#F94545",
        },  
        iconCalendar: {
            DEFAULT: "#D6D4FD",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;