// src/chat/Sidebar.tsx
import { Button } from "../components/ui/Button";
import { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface SidebarProps {
    conversations: { id: string; title?: string; createdAt: string }[];
    onNewChat: () => void;
    onDeleteChat?: (id: string, e: React.MouseEvent) => void;
    isLoading?: boolean;
}

export const Sidebar = ({
    conversations,
    onNewChat,
    onDeleteChat,
    isLoading
}: SidebarProps) => {
    const navigate = useNavigate();
    const { conversationId } = useParams();

    return (
        <div className="h-full flex flex-col w-64 border-r border-gray-200 bg-gray-50">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="text-blue-600">AI</span> Support
                </CardTitle>
            </CardHeader>

            <div className="px-4 pb-4">
                <Button
                    onClick={onNewChat}
                    className="w-full justify-start gap-2 shadow-sm"
                    variant="primary"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>

            <CardContent className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {isLoading ? (
                    <div className="text-sm text-gray-500 text-center py-4">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">
                        No conversations yet.
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => navigate(`/c/${conv.id}`)}
                            className={`group flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-colors ${conversationId === conv.id
                                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                                : "text-gray-700 hover:bg-gray-200/50"
                                }`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {conv.title || `Chat ${conv.id.substring(0, 4)}...`}
                                </span>
                            </div>
                            {onDeleteChat && (
                                <button
                                    onClick={(e) => onDeleteChat(conv.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity"
                                    title="Delete chat"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </CardContent>

            <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-400">
                AI Customer Support System
            </div>
        </div>
    );
};