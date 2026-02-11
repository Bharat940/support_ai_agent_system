import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading && !disabled) {
            onSend(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [message]);

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="relative flex items-end gap-2 max-w-4xl mx-auto rounded-xl border border-gray-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={isLoading || disabled}
                    className="flex-1 max-h-[150px] min-h-[24px] resize-none border-0 bg-transparent p-2 placeholder:text-gray-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed"
                    rows={1}
                />
                <Button
                    type="submit"
                    disabled={!message.trim() || isLoading || disabled}
                    size="icon"
                    className="h-9 w-9 mb-0.5 rounded-lg shrink-0"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </form>
    );
};
