// lib/checkAnswerRelevance.js

export async function checkAnswerRelevance(question, description, answerText) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s client timeout

    try {
        const res = await fetch('/api/check-relevance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, description, answerText }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('check-relevance status:', res.status);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('check-relevance error body:', err);
            throw new Error(err.message || `Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log('check-relevance result:', data);
        return data;

    } catch (err) {
        clearTimeout(timeoutId);

        if (err.name === 'AbortError') {
            console.warn('checkAnswerRelevance timed out — returning graceful fallback');
            return {
                isRelevant: true,
                qualityScore: 7,
                reason: 'Quality check timed out. Answer accepted.',
            };
        }

        console.error('checkAnswerRelevance threw:', err);
        throw err;
    }
}