import { Bot } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";

export const TypingIndicator = () => {
    return (
        <div className="flex w-full gap-3 p-4">
            <Avatar
                className='bg-white border border-gray-100 shadow-sm'
                fallback={<Bot className="h-5 w-5 text-purple-600" />}
            />
            <div className="flex items-center bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};
