import { Bot, ShoppingBag, CreditCard, LifeBuoy } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface AgentIndicatorProps {
    activeAgent?: 'router' | 'support' | 'order' | 'billing';
}

export const AgentIndicator = ({ activeAgent = 'router' }: AgentIndicatorProps) => {
    if (!activeAgent) return null;

    const agents = {
        router: { label: 'Router', icon: <Bot className="h-4 w-4" />, color: 'bg-gray-100 text-gray-700' },
        support: { label: 'Support Agent', icon: <LifeBuoy className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
        order: { label: 'Order Specialist', icon: <ShoppingBag className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' },
        billing: { label: 'Billing Support', icon: <CreditCard className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
    };

    const current = agents[activeAgent] || agents.router;

    return (
        <Card className="mx-4 my-2 p-2 flex items-center justify-center gap-2 bg-opacity-50 border-dashed shadow-none">
            <div className={`p-1 rounded-full ${current.color}`}>
                {current.icon}
            </div>
            <span className="text-sm font-medium text-gray-600">
                Active: {current.label}
            </span>
        </Card>
    );
};
