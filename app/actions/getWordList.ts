'use server'

import { TimerDuration } from "../utils/time";
const WORDS = {
    "rawWordList": [
        "about", "another", "concept", "after", "again", "air", "all", "also", "balance", "always", 
        "and", "animal", "answers", "around", "ask", "away", "back", "because", "be", "between", 
        "before", "bridge", "been", "began", "better", "capture", "calling", "came", "can", "change", 
        "children", "contain", "city", "come", "could", "day", "decides", "did", "different", "do", 
        "does", "down", "each", "end", "even", "every", "feature", "few", "find", "first", "further", 
        "found", "gallery", "from", "get", "give", "go", "good", "great", "group", "had", "has", "include", 
        "have", "he", "help", "her", "here", "him", "history", "his", "home", "house", "how", "idea", 
        "if", "important", "in", "into", "is", "it", "its", "just", "keep", "kitchen", "kind", "know", 
        "landing", "land", "large", "last", "later", "learn", "library", "leave", "left", "let", "life", 
        "light", "limited", "like", "line", "list", "little", "long", "look", "made", "make", "man", 
        "many", "may", "mean", "men", "might", "more", "network", "most", "much", "must", "my", "name", 
        "natural", "need", "new", "next", "no", "not", "numbers", "now", "number", "of", "off", "often", 
        "old", "operate", "on", "one", "only", "options", "or", "other", "our", "out", "over", "package", 
        "own", "page", "part", "people", "perform", "place", "play", "platform", "put", "read", "receive", 
        "right", "run", "said", "same", "saw", "saying", "screen", "see", "she", "should", "show", "similar", 
        "small", "so", "software", "some", "something", "sound", "special", "still", "study", "subject", 
        "such", "support", "take", "telling", "tell", "than", "that", "the", "their", "them", "then", "there", 
        "these", "they", "thing", "think", "this", "those", "thought", "three", "through", "time", "together", 
        "to", "too", "took", "traffic", "two", "under", "until", "update", "up", "us", "use", "version", 
        "very", "want", "was", "way", "we", "well", "went", "were", "what", "when", "whether", "where", 
        "which", "while", "who", "windows", "why", "will", "within", "with", "word", "work", "workshop", 
        "world", "would", "writing", "write", "year", "you", "younger", "young", "your", "abandon", "absolute", 
        "accident", "adventure", "analysis", "approval", "attractive", "beautiful", "beverage", "boundary", 
        "briefly", "calculate", "caution", "celebrate", "charity", "climate", "complete", "confuse", "contrast", 
        "courage", "creative", "dangerous", "default", "decision", "definitely", "detailed", "dynamic", "element", 
        "enthusiasm", "exception", "exercise", "fantastic", "fascinating", "frequent", "gravity", "happiness", 
        "hearing", "historic", "identity", "imagine", "invisible", "journey", "library", "magnitude", "manager", 
        "mystery", "obstacle", "operation", "outcome", "overcome", "recovery", "reliable", "solution", "student", 
        "surgery", "tolerance", "triangle", "ultimate", "understand", "universe", "variety", "vividly", "withdrawal", "workplace", "yellow", "zealous"
    ]
}

const getRandomWords = (wordList: string[], count: number) => {
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default async function getWordList({
    time,
}: {
    time: TimerDuration;
}) {
    try {
        let wordList: string[] = WORDS.rawWordList;

        let wordCount = 0;

        switch (time) {
            case 15:
                wordCount = 35;
                break;
            case 30:
                wordCount = 100;
                break;
            case 60:
                wordCount = 200;
                break;
            default:
                wordCount = 35;
                break;
        }

        return getRandomWords(wordList, wordCount);
    } catch (error) {
        console.error("Error fetching word list:", error);
        return [];
    }
}
