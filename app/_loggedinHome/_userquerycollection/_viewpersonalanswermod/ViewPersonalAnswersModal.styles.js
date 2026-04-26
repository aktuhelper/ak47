export const modalStyles = `
    @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .answer-card {
        animation: slideUp 0.25s ease-out both;
    }
    .answer-card:nth-child(1) { animation-delay: 0.05s; }
    .answer-card:nth-child(2) { animation-delay: 0.1s; }
    .answer-card:nth-child(3) { animation-delay: 0.15s; }
    .answer-card:nth-child(4) { animation-delay: 0.2s; }
    .answer-card:nth-child(5) { animation-delay: 0.25s; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(113,113,122,0.3); border-radius: 999px; }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(113,113,122,0.5); }
`;