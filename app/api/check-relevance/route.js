import { NextResponse } from "next/server";

// ── Constants ──────────────────────────────────────────────────────────────
const MINIMUM_QUALITY_SCORE = 6;
const MIN_WORD_COUNT = 15;
const MAX_INPUT_LENGTH = 5000;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_TIMEOUT_MS = 15000;

const CONSTRUCTIVE_GUIDANCE =
    "Please provide a detailed, constructive answer with proper explanation and context. Casual or one-line responses are not accepted.";

// ── Patterns ───────────────────────────────────────────────────────────────
const HARMFUL_PATTERNS = [
    /\b(cut(ting)?\s(myself|yourself|herself|himself))\b/i,
    /\b(self[.\-]?harm(ing)?)\b/i,
    /\b(suicide|suicidal)\b/i,
    /\b(kill\s(myself|yourself|herself|himself))\b/i,
    /\b(end\s(my|your|her|his)\slife)\b/i,
    /\b(want\sto\sdie|wanna\sdie)\b/i,
    /\b(hurt(ing)?\s(myself|yourself))\b/i,
    /\b(hang(ing)?\s(myself|yourself))\b/i,
    /\b(slit(ting)?\s(my|your|her|his)\swrists?)\b/i,
    /\b(kys|kms)\b/i,
    /\b(you\s(should|deserve\sto)\sdie)\b/i,
    /\b(better\soff\s(dead|without\sme))\b/i,
];

const CASUAL_PATTERNS = [
    /^(i\s)?don'?t\sknow\.?$/i,
    /^(just\s)?google\sit\.?$/i,
    /^idk\.?$/i,
    /^no\sidea\.?$/i,
    /^figure\sit\sout(\syourself)?\.?$/i,
    /^not\ssure\.?$/i,
    /^ask\ssomeone\selse\.?$/i,
    /^n\/a\.?$/i,
    /^(yes|no|maybe|sure|ok|okay|fine|nope|yep|yeah)\.?$/i,
    /^(lol|lmao|haha|hmm|meh|idk|smh)\.?$/i,
];

const SPAM_PATTERNS = [
    /(.)\1{7,}/,
    /^[^a-zA-Z]*$/,
    /(\b\w+\b)(\s+\1){4,}/i,
];

// ── Detection Functions ────────────────────────────────────────────────────

/**
 * Detects circular/tautological answers that just restate the question.
 * e.g. Q: "What is an OS?" A: "Operating system is a system which is a system"
 * 
 * Uses TWO signals together to avoid false positives on legitimate answers
 * that naturally share vocabulary with the question:
 *  1. Word overlap ratio > 0.8 (answer mostly reuses question words)
 *  2. Very low unique word ratio in the answer itself (< 0.5) — meaning it's
 *     not just topically related but genuinely repetitive/circular
 */
function isCircularAnswer(questionText, answerText) {
    // Extract meaningful words (length > 3) from the question
    const qWords = new Set(
        questionText.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    const aWords = answerText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (aWords.length === 0 || qWords.size === 0) return false;

    // Signal 1: How many answer words are just recycled question words?
    const overlapCount = aWords.filter(w => qWords.has(w)).length;
    const overlapRatio = overlapCount / aWords.length;

    // Signal 2: How repetitive is the answer within itself?
    const uniqueAWords = new Set(aWords);
    const uniquenessRatio = uniqueAWords.size / aWords.length;

    // Circular = mostly question words AND internally repetitive
    return overlapRatio > 0.8 && uniquenessRatio < 0.5;
}

/**
 * Detects answers where a single word dominates excessively.
 * e.g. "system system system system system system system system"
 * Catches distributed repetition that SPAM_PATTERNS misses (non-consecutive).
 */
function hasExcessiveRepetition(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (words.length < 5) return false;

    const freq = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    const maxFreq = Math.max(...Object.values(freq));

    // Any single word appears more than 40% of the time → spam
    return maxFreq / words.length > 0.4;
}

/**
 * Detects answers with too few unique words or mostly non-alphabetic tokens.
 */
function isGibberish(text) {
    if (!text) return false;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length < 4) return false;
    const unique = new Set(words.map((w) => w.toLowerCase()));
    if (unique.size / words.length < 0.4) return true;
    const realWords = words.filter((w) => /^[a-zA-Z]{3,}$/.test(w));
    if (realWords.length / words.length < 0.5) return true;
    return false;
}

// ── In-memory LRU cache (performance: avoid duplicate Gemini calls) ─────────
const CACHE_MAX_SIZE = 200;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

class LRUCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.map = new Map();
    }

    _makeKey(question, answer) {
        const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
        return `${norm(question)}||${norm(answer)}`;
    }

    get(question, answer) {
        const key = this._makeKey(question, answer);
        const entry = this.map.get(key);
        if (!entry) return null;
        if (Date.now() - entry.ts > CACHE_TTL_MS) {
            this.map.delete(key);
            return null;
        }
        this.map.delete(key);
        this.map.set(key, entry);
        return entry.value;
    }

    set(question, answer, value) {
        const key = this._makeKey(question, answer);
        if (this.map.has(key)) this.map.delete(key);
        if (this.map.size >= this.maxSize) {
            this.map.delete(this.map.keys().next().value);
        }
        this.map.set(key, { value, ts: Date.now() });
    }
}

const relevanceCache = new LRUCache(CACHE_MAX_SIZE);

// ── Helpers ────────────────────────────────────────────────────────────────
function containsHarmfulContent(text) {
    if (!text || typeof text !== "string") return false;
    return HARMFUL_PATTERNS.some((p) => p.test(text));
}

function isCasualAnswer(text) {
    if (!text || typeof text !== "string") return false;
    return CASUAL_PATTERNS.some((p) => p.test(text.trim()));
}

function isSpam(text) {
    if (!text || typeof text !== "string") return false;
    return SPAM_PATTERNS.some((p) => p.test(text));
}

function getWordCount(text) {
    return text?.trim().split(/\s+/).filter(Boolean).length ?? 0;
}

function sanitizeInput(text) {
    if (!text || typeof text !== "string") return "";
    return text.trim().slice(0, MAX_INPUT_LENGTH);
}

function getQualityGuidance(score) {
    if (score <= 3)
        return "Your answer needs major improvement. Add proper explanation, reasoning, and examples.";
    if (score <= 5)
        return "Your answer is too vague or incomplete. Expand with context, steps, or real examples.";
    if (score === 6)
        return "Your answer just missed the threshold. Add a bit more depth or a concrete example to pass.";
    return "Your answer needs slight improvement for clarity or completeness.";
}

// ── Gemini response parser ─────────────────────────────────────────────────
function parseGeminiResponse(raw) {
    const trimmed = raw.trim();
    const looksIncomplete =
        !trimmed.includes("}") ||
        /\{\s*"s"\s*:\s*$/.test(trimmed) ||
        /\{\s*"s"\s*:\s*\d+\s*,?\s*$/.test(trimmed);

    if (looksIncomplete) {
        console.warn("Gemini returned truncated JSON:", JSON.stringify(raw));
        return null;
    }

    const stripped = raw.replace(/```(?:json)?\s*/gi, "").trim();
    const input = stripped.length > 0 ? stripped : raw;

    // Strategy 1: extract and parse compact JSON {"s": 7, "r": true}
    try {
        const jsonMatch = input.match(/\{[^{}]*\}/);
        if (jsonMatch) {
            const cleaned = jsonMatch[0]
                .replace(/[\r\n\t]+/g, " ")
                .replace(/"r"\s*:\s*"true"/g, '"r": true')
                .replace(/"r"\s*:\s*"false"/g, '"r": false')
                .replace(/"s"\s*:\s*"(\d+)"/g, '"s": $1')
                .replace(/(\{|,)\s*([a-zA-Z_]\w*)\s*:/g, '$1"$2":')
                .trim();
            const result = JSON.parse(cleaned);
            if (typeof result.s === "number") {
                return { isRelevant: result.r === true, qualityScore: result.s };
            }
        }
    } catch (e) {
        console.warn("Gemini parse strategy 1 failed:", e.message);
    }

    // Strategy 2: pull fields directly from text
    try {
        const scoreMatch = input.match(/"s"\s*:\s*(\d+)/) ?? input.match(/\b(10|[1-9])\b/);
        const relevantMatch =
            input.match(/"r"\s*:\s*(true|false)/i) ?? input.match(/\b(true|false)\b/i);
        if (scoreMatch) {
            return {
                isRelevant: relevantMatch?.[1]?.toLowerCase() === "true",
                qualityScore: parseInt(scoreMatch[1], 10),
            };
        }
    } catch (e) {
        console.warn("Gemini parse strategy 2 failed:", e.message);
    }

    return null;
}

// ── Gemini API call ────────────────────────────────────────────────────────
async function callGemini(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
                }),
            }
        );

        clearTimeout(timeoutId);

        if (res.ok) return { ok: true, res };

        const errBody = await res.json().catch(() => ({}));
        console.error("Gemini API error:", res.status, JSON.stringify(errBody));
        return { ok: false, status: res.status, errBody };
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
            console.error("Gemini request timed out");
            return { ok: false, status: 408, errBody: { message: "Request timed out" } };
        }
        throw err;
    }
}

// ── Main Route ─────────────────────────────────────────────────────────────
export async function POST(req) {
    try {
        const body = await req.json().catch(() => null);

        // 1. Malformed body guard
        if (!body || typeof body !== "object") {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const { question, description, answerText } = body;

        // 2. Required fields + type validation
        if (
            !question || typeof question !== "string" ||
            !answerText || typeof answerText !== "string"
        ) {
            return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 });
        }

        // 3. Sanitize all inputs
        const cleanQuestion = sanitizeInput(question);
        const cleanDescription = sanitizeInput(description);
        const cleanAnswer = sanitizeInput(answerText);
        const wordCount = getWordCount(cleanAnswer);

        // 4. Minimum length gate
        if (wordCount < MIN_WORD_COUNT) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 2,
                qualityBlock: true,
                reason: "Answer is too short to be meaningful.",
                guidance: `Your answer has only ${wordCount} word(s). Please write at least ${MIN_WORD_COUNT} words with a proper explanation.`,
            });
        }

        // 5. Casual / lazy answer gate
        if (isCasualAnswer(cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 1,
                qualityBlock: true,
                reason: "Casual or one-word answers are not accepted.",
                guidance: CONSTRUCTIVE_GUIDANCE,
            });
        }

        // 6. Spam gate
        if (isSpam(cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 1,
                qualityBlock: true,
                reason: "Answer appears to be spam or gibberish.",
                guidance: "Please write a real, meaningful response.",
            });
        }

        // 6b. Excessive repetition gate — catches distributed word spam
        // that SPAM_PATTERNS misses (non-consecutive repeats)
        if (hasExcessiveRepetition(cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 1,
                qualityBlock: true,
                reason: "Answer contains excessive word repetition.",
                guidance: "Please write a genuine answer without repeating the same words over and over.",
            });
        }

        // 6c. Gibberish gate
        if (isGibberish(cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 2,
                qualityBlock: true,
                reason: "Answer appears to be gibberish or random text.",
                guidance: "Please write a genuine, meaningful answer that addresses the question.",
            });
        }

        // 6d. Circular / tautological answer gate
        // Catches answers like "OS is a system which is a system that is a system"
        // Must run AFTER gibberish check (gibberish has priority for cleaner messaging)
        if (isCircularAnswer(cleanQuestion, cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 2,
                qualityBlock: true,
                reason: "Your answer just restates the question without actually explaining anything.",
                guidance: "Please provide a real explanation. Define what it is, how it works, or give a concrete example — don't just repeat the question's words back.",
            });
        }

        // 7. Harmful content gate (all three fields)
        const flaggedFields = [];
        if (containsHarmfulContent(cleanQuestion)) flaggedFields.push("question");
        if (containsHarmfulContent(cleanDescription)) flaggedFields.push("description");
        if (containsHarmfulContent(cleanAnswer)) flaggedFields.push("answer");

        if (flaggedFields.length > 0) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 0,
                flagged: true,
                flaggedFields,
                safetyBlock: true,
                reason: "Harmful or unsafe content detected.",
                guidance:
                    "Please keep your response safe, respectful, and constructive. If you are struggling, reach out to a trusted person.",
            });
        }

        // 8. Cache check — skip Gemini entirely if seen before
        const cached = relevanceCache.get(cleanQuestion, cleanAnswer);
        if (cached) {
            console.info("Cache hit — skipping Gemini call");
            return NextResponse.json({ ...cached, cached: true });
        }

        // 9. Gemini API key check
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ message: "API key not configured" }, { status: 500 });
        }

        // 10. Build prompt — hardened to explicitly penalise circular/tautological answers
        const prompt = `You are a strict answer quality and factual accuracy checker.

Reply with ONLY: {"s":<score>,"r":<true|false>}
No spaces, no markdown, no explanation. Example: {"s":7,"r":true}

Scoring rules (be very strict):
- s = integer 1-10
- r = true ONLY if s >= 7, else false

Score 1-3 if ANY of these are true:
  - Answer just repeats or paraphrases the question without explaining anything new
  - Circular definitions: "X is X" or "X is a thing that does X"
  - Answer is factually WRONG or MISLEADING about the topic
  - Answer describes a completely different concept than what was asked
  - Answer uses correct-sounding technical words but applies them to the wrong domain
  - Answer contains no real information beyond what was already in the question

Score 4-6 if:
  - Answer is vague, partial, or lacks sufficient depth
  - Answer is mostly correct but missing key facts
  - Answer touches the topic but doesn't actually explain it well

Score 7-10 if ALL of these are true:
  - Answer is factually accurate and correct
  - Answer genuinely explains, defines, or provides information beyond the question
  - Includes how something works, why it exists, concrete examples, or meaningful context

Q: "${cleanQuestion}"
D: "${cleanDescription || "N/A"}"
A: "${cleanAnswer}"`;

        // 11. Call Gemini
        const { ok, res, status, errBody } = await callGemini(prompt);

        if (!ok) {
            // Graceful fallback — don't penalise user for Gemini being unavailable
            if (status === 429 || status === 503 || status === 408) {
                console.warn(`Gemini unavailable (${status}). Graceful fallback applied.`);
                return NextResponse.json({
                    isRelevant: true,
                    qualityScore: 7,
                    reason: "Quality check temporarily unavailable. Answer accepted.",
                });
            }
            return NextResponse.json(
                { message: "Gemini request failed", detail: errBody },
                { status: 502 }
            );
        }

        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!raw) {
            console.error("Empty Gemini response:", JSON.stringify(data));
            return NextResponse.json({ message: "Empty response from Gemini" }, { status: 502 });
        }

        // 12. Parse Gemini response
        const parsed = parseGeminiResponse(raw);

        if (!parsed) {
            console.error("All parse strategies failed. Raw:", raw);
            return NextResponse.json({
                isRelevant: true,
                qualityScore: 7,
                reason: "Quality check temporarily unavailable. Answer accepted.",
            });
        }

        const score = typeof parsed.qualityScore === "number" ? parsed.qualityScore : 0;

        // 13. Quality threshold check
        if (score <= MINIMUM_QUALITY_SCORE) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: score,
                qualityBlock: true,
                reason: "Answer did not meet quality standards.",
                guidance: getQualityGuidance(score),
            });
        }

        // 14. Post-check: override if Gemini missed harmful content
        if (parsed.isRelevant && containsHarmfulContent(cleanAnswer)) {
            return NextResponse.json({
                isRelevant: false,
                qualityScore: 0,
                flagged: true,
                safetyBlock: true,
                reason: "Unsafe content detected after AI review.",
                guidance: "Please keep your response safe and constructive.",
            });
        }

        // 15. All checks passed — cache and return
        const finalResult = {
            isRelevant: parsed.isRelevant,
            qualityScore: score,
            reason: "Answer looks good and relevant.",
        };

        relevanceCache.set(cleanQuestion, cleanAnswer, finalResult);

        return NextResponse.json(finalResult);

    } catch (err) {
        console.error("check-relevance route error:", err.message);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}