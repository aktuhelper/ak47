// lib/checkAnswerRelevance.js

export async function checkAnswerRelevance(question, description, answerText) {
    try {
        const res = await fetch('/api/check-relevance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, description, answerText }),
        });

        console.log('check-relevance status:', res.status);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('check-relevance error body:', err);
            throw new Error(err.message || `Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log('check-relevance result:', data);
        return data; // { isRelevant: bool, reason: string }

    } catch (err) {
        console.error('checkAnswerRelevance threw:', err);
        throw err; // Re-throw so modal catch block handles it
    }
}