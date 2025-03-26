import { profanityList } from "./profanityList.js";

export function censorBadWords(text) {
    const regex = new RegExp(`\\b(${profanityList.join("|")})\\b`, "gi");
    return text.replace(regex, (match) => "*".repeat(match.length));
}

// Example usage:
// console.log(censorBadWords("This is a damn example."));
// Output: "This is a **** example."
