import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface Message {
    id: string;
    sender_id: string;
    recipient_group: string; // "all", "center", "unit", "birthday", "new_members", "gender", "custom"
    recipient_filters: Record<string, any>;
    channels: ("email" | "whatsapp" | "sms")[];
    subject?: string;
    content: string;
    status: "pending" | "sending" | "sent" | "failed" | "scheduled";
    created_at: string;
    scheduled_at?: string;
}

export interface SendMessageInput {
    recipient_group: string;
    recipient_filters: Record<string, any>;
    channels: ("email" | "whatsapp" | "sms")[];
    subject?: string;
    content: string;
    scheduled_at?: string;
}

export function useMessages() {
    return useQuery({
        queryKey: ["messages"],
        queryFn: async (): Promise<Message[]> => {
            if (!supabase) {
                return getMockMessages();
            }

            try {
                const { data, error } = await supabase
                    .from("messages")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error("Error fetching messages:", error);
                return getMockMessages();
            }
        },
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message: SendMessageInput): Promise<Message> => {
            if (!supabase) {
                const newMessage: Message = {
                    ...message,
                    id: Math.random().toString(36).substr(2, 9),
                    sender_id: "admin-1",
                    status: "sent",
                    created_at: new Date().toISOString(),
                };
                return newMessage;
            }

            try {
                const { data, error } = await supabase
                    .from("messages")
                    .insert([message])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error("Error sending message:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
    });
}

function getMockMessages(): Message[] {
    return [
        {
            id: "1",
            sender_id: "admin-1",
            recipient_group: "birthday",
            recipient_filters: { month: 12 },
            channels: ["email", "whatsapp"],
            subject: "Happy Birthday!",
            content: "Wishing you a wonderful birthday celebration!",
            status: "sent",
            created_at: "2025-12-28T10:00:00Z",
        },
        {
            id: "2",
            sender_id: "admin-1",
            recipient_group: "unit",
            recipient_filters: { service_unit: "Choir" },
            channels: ["whatsapp"],
            content: "Rehearsal reminder for Saturday at 4 PM.",
            status: "sent",
            created_at: "2025-12-27T15:30:00Z",
        },
    ];
}
