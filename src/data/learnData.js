export const GLOSSARY = {
    market_cap: {
        title: "Market Cap",
        simple: "Total Value of the Network",
        desc: "Calculated by multiplying the current price by the total number of coins in circulation.",
        analogy: "Like the total value of a company's shares on the stock market."
    },
    volume_24h: {
        title: "24h Volume",
        simple: "Trading Activity",
        desc: "The total amount of money traded for this coin in the last 24 hours.",
        analogy: "High volume means it's easy to buy or sell without moving the price."
    },
    dominance: {
        title: "BTC Dominance",
        simple: "Bitcoin's Market Share",
        desc: "The percentage of the total crypto market cap that is just Bitcoin.",
        analogy: "If Dominance is 54%, Bitcoin is more than half the entire market."
    },
    fdv: {
        title: "Fully Diluted Value",
        simple: "Future Market Cap",
        desc: "The market cap if ALL total coins were released today.",
        analogy: "Shows potential inflation impact."
    },
    circulating_supply: {
        title: "Circulating Supply",
        simple: "Coins in Public Hands",
        desc: "The amount of coins that are circulating in the market and are in public hands."
    },
    all_time_high: {
        title: "All-Time High (ATH)",
        simple: "Peak Price",
        desc: "The highest price this coin has ever reached in its history."
    }
};

export const LESSONS = [
    {
        id: 1,
        title: "Crypto 101",
        duration: "2 min",
        content: "Think of Bitcoin as digital gold. It's money secured by math, not banks. Ethereum is like digital oil—it powers applications (dApps).",
        icon: "🪙"
    },
    {
        id: 2,
        title: "Reading Charts",
        duration: "3 min",
        content: "🟢 Green means the price went UP. 🔴 Red means it went DOWN. A 'Candlestick' usually serves as a summary of price action for a specific time (e.g., 1 day or 1 hour).",
        icon: "📊"
    },
    {
        id: 3,
        title: "Safe Investing",
        duration: "5 min",
        content: "Rule #1: Never invest more than you can lose. Rule #2: Use 2-Factor Authentication (2FA). Rule #3: 'Not your keys, not your coins'—consider a hardware wallet for large amounts.",
        icon: "🛡️"
    },
    {
        id: 4,
        title: "Smart Contracts",
        duration: "4 min",
        content: "Programs stored on a blockchain that run when predetermined conditions are met. They automate the execution of an agreement without intermediaries.",
        icon: "📜"
    }
];

export const BEGINNER_TERMS = [
    { term: "HODL", def: "Hold On for Dear Life (Don't sell in panic)" },
    { term: "Whale", def: "Someone who owns a massive amount of crypto" },
    { term: "FOMO", def: "Fear Of Missing Out (Buying because price is soaring)" },
    { term: "FUD", def: "Fear, Uncertainty, and Doubt (Negative news)" },
    { term: "Bull Market", def: "Prices are going UP 📈" },
    { term: "Bear Market", def: "Prices are going DOWN 📉" },
    { term: "DeFi", def: "Decentralized Finance (Banking without banks)" },
    { term: "NFT", def: "Non-Fungible Token (Digital ownership proof)" }
];
