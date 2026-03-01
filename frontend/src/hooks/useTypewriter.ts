import { useState, useEffect } from 'react';

export const useTypewriter = (
    text: string,
    typingSpeed: number = 70,
    deletingSpeed: number = 40,
    delayBetweenCycles: number = 2500
) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (isTyping && !isDeleting) {
            if (displayText.length < text.length) {
                const nextChar = text.charAt(displayText.length);
                let currentDelay = typingSpeed + (Math.random() * 40 - 20);

                // Add natural pause for periods to make it realistic
                if (nextChar === '.') currentDelay += 500;

                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1));
                }, currentDelay);
            } else {
                // Finished typing, pause then start deleting
                setIsTyping(false);
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, delayBetweenCycles);
            }
        } else if (isDeleting) {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length - 1));
                }, deletingSpeed);
            } else {
                // Finished deleting, pause then start typing again
                setIsDeleting(false);
                setIsTyping(true);
                timeout = setTimeout(() => { }, 500);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, isTyping, isDeleting, text, typingSpeed, deletingSpeed, delayBetweenCycles]);

    return { displayText, isTyping: isTyping || isDeleting };
};
