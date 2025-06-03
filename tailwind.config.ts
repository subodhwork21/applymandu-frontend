import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        nasalization: ["var(--font-nasalization)"],
        poppins: ["var(--font-poppins)"],
      },

      fontSize: {
        // Typography scale based on your design system
        'h1': ['96px', { lineHeight: '1.2' }],
        'h2': ['60px', { lineHeight: '1.3' }],
        'h3': ['48px', { lineHeight: '1.3' }],
        'h4': ['34px', { lineHeight: '1.4' }],
        'h5': ['24px', { lineHeight: '1.4' }],
        'h6': ['20px', { lineHeight: '1.5' }],
        'subtitle1': ['16px', { lineHeight: '1.5' }],
        'subtitle2': ['14px', { lineHeight: '1.5' }],
        'body1': ['16px', { lineHeight: '1.6' }],
        'body2': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.4' }],
        'overline': ['12px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        'text-12': ['12px', { lineHeight: '1.5' }],
        'text-16': ['16px', { lineHeight: '1.5' }],
        'text-20': ['20px', { lineHeight: '1.4' }],
        'text-24': ['24px', { lineHeight: '1.4' }],
        'text-28': ['28px', { lineHeight: '1.3' }],
        'text-32': ['32px', { lineHeight: '1.3' }],
        'text-36': ['36px', { lineHeight: '1.3' }],
        'text-40': ['40px', { lineHeight: '1.2' }],
        'text-44': ['44px', { lineHeight: '1.2' }],
        'text-48': ['48px', { lineHeight: '1.2' }],
        'text-52': ['52px', { lineHeight: '1.1' }],
        'text-56': ['56px', { lineHeight: '1.1' }],
        'text-60': ['60px', { lineHeight: '1.1' }],
      },

      colors: {
        manduPrimary: {
          10: '#0038931A',   // #003893 with 10% opacity
          20: '#00389333',   // #003893 with 20% opacity
          30: '#0038934D',   // #003893 with 30% opacity
          40: '#00389366',   // #003893 with 40% opacity
          50: '#00389380',   // #003893 with 50% opacity
          60: '#00389399',   // #003893 with 60% opacity
          70: '#003893B3',   // #003893 with 70% opacity
          80: '#003893CC',   // #003893 with 80% opacity
          90: '#003893E6',   // #003893 with 90% opacity
          100: '#003893',    // #003893 with 100% opacity (full color)
          DEFAULT: '#003893',
        },

        manduSecondary: {
          10: "#DC143C1A", // #DC143C with 10% opacity
          20: "#DC143C33", // #DC143C with 20% opacity
          30: "#DC143C4D", // #DC143C with 30% opacity
          40: "#DC143C66", // #DC143C with 40% opacity
          50: "#DC143C80", // #DC143C with 50% opacity
          60: "#DC143C99", // #DC143C with 60% opacity
          70: "#DC143CB3", // #DC143C with 70% opacity
          80: "#DC143CCC", // #DC143C with 80% opacity
          90: "#DC143CE6", // #DC143C with 90% opacity
          100: "#DC143C", // #DC143C with 100% opacity (full color)
          DEFAULT: "#DC143C",
        },

        manduNeutral: {
          10: "#40404019", // #404040 with 10% opacity
          20: "#40404033", // #404040 with 20% opacity
          30: "#4040404D", // #404040 with 30% opacity
          40: "#40404066", // #404040 with 40% opacity
          50: "#40404080", // #404040 with 50% opacity
          60: "#40404099", // #404040 with 60% opacity
          70: "#404040B3", // #404040 with 70% opacity
          80: "#404040CC", // #404040 with 80% opacity
          90: "#404040E6", // #404040 with 90% opacity
          100: "#404040", // #404040 with 100% opacity (full color)
          DEFAULT: "#404040",
        },
        manduSuccess: {
           10: '#E8F8F3',   // #E8F8F3 (10% intensity)
          20: '#D2F1E7',   // #D2F1E7 (20% intensity)
          30: '#BCEADB',   // #BCEADB (30% intensity)
          40: '#A6E3CF',   // #A6E3CF (40% intensity)
          50: '#90DCC4',   // #90DCC4 (50% intensity)
          60: '#7AD5B8',   // #7AD5B8 (60% intensity)
          70: '#64CEAC',   // #64CEAC (70% intensity)
          80: '#4EC7A0',   // #4EC7A0 (80% intensity)
          90: '#38C094',   // #38C094 (90% intensity)
          100: '#22BA89',  // #22BA89 (100% full intensity)
          DEFAULT: '#22BA89',
        },
        manduError: {
          10: '#FEEEEB',   // #FEEEEB (10% intensity)
          20: '#FDDDD7',   // #FDDDD7 (20% intensity)  
          30: '#FCCCC3',   // #FCCCC3 (30% intensity)
          40: '#FBBBAF',   // #FBBBAF (40% intensity)
          50: '#FAAA9B',   // #FAAA9B (50% intensity)
          60: '#F99A87',   // #F99A87 (60% intensity)
          70: '#F88973',   // #F88973 (70% intensity)
          80: '#F7785F',   // #F7785F (80% intensity)
          90: '#F6674B',   // #F6674B (90% intensity)
          100: '#F65737',  // #F65737 (100% full intensity)
          DEFAULT: '#F65737',
        },
        manduWarning: {
           10: '#FFFAEA',   // #FFFAEA (10% intensity)
          20: '#FFF5D6',   // #FFF5D6 (20% intensity)
          30: '#FFF0C2',   // #FFF0C2 (30% intensity)
          40: '#FFEBAD',   // #FFEBAD (40% intensity)
          50: '#FFE699',   // #FFE699 (50% intensity)
          60: '#FFE185',   // #FFE185 (60% intensity)
          70: '#FFDC70',   // #FFDC70 (70% intensity)
          80: '#FFD75C',   // #FFD75C (80% intensity)
          90: '#FFD248',   // #FFD248 (90% intensity)
          100: '#FFCE34',  // #FFCE34 (100% full intensity)
          DEFAULT: '#FFCE34',
        },
        manduWhite: {
          70: '#F6F6F6',     // #F6F6F6 (70% intensity)
          'alt-70': '#E9E9E9', // #E9E9E9 (alternative 70% intensity)
          80: '#F0F0F0',     // #F0F0F0 (80% intensity)
          90: '#F4F4F4',     // #F4F4F4 (90% intensity)
          100: '#FFFFFF',    // #FFFFFF (100% pure white)
          DEFAULT: '#FFFFFF',
        },
        manduCustom: {
            'status-pending': '#F2FA15',     // Status color - pending (yellow-green)
          'card-box-green': '#006B24',     // Card box color green
          'stroke': '#E1E8F0',             // Stroke color (light blue-gray)
          'black-text': '#131313',         // Black text
          'secondary-blue': '#001C4A',     // Secondary color blue (dark navy)
          'secondary-grey': '#D1D1D1',     // Secondary color grey
          'dark-grey': '#404040',          // Dark grey
          'blue-prime': '#2D3748',      
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
        patternPrimary: {
          DEFAULT: "#013893",
        },
        patternSecondary: {
          DEFAULT: "#001C4A",
        },
        grayColor: {
          DEFAULT: "#525252",
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
        darkGrey: {
          DEFAULT: "#020617",
        },
        grayBg: {
          DEFAULT: "#D9D9D9",
        },
        profileNameText: {
          DEFAULT: "#00090F",
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
        googleButton: {
          DEFAULT: "#F3F9FA",
        },
        googleButtonText: {
          DEFAULT: "#313957",
        },
        labels: {
          DEFAULT: "#1C1B1F",
        },
        statsValue: {
          DEFAULT: "#0A0A0A",
        },
        successProgress: {
          DEFAULT: "#0E6027",
        },
        responseProgress: {
          DEFAULT: "#0043CE",
        },
        interviewProgress: {
          DEFAULT: "#F1C21B",
        },
        borderLine: {
          DEFAULT: "#E5E5E5",
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
