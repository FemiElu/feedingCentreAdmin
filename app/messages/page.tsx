"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Table } from "@/components/Table";
import { useToast } from "@/components/Toast";
import { useCenters } from "@/lib/queries/membersQueries";
import { useSendMessage, useMessages, Message } from "@/lib/queries/messagesQueries";
import {
    SERVICE_UNITS,
    GENDER_OPTIONS,
} from "@/lib/constants";
import { clsx } from "clsx";

type RecipientGroup =
    | "all"
    | "birthday"
    | "new_members"
    | "unit"
    | "center"
    | "gender"
    | "security";

interface AudienceFilters {
    center_id?: string;
    service_unit?: string;
    gender?: string;
    period?: "today" | "week" | "month";
}

export default function MessagesPage() {
    const { toast } = useToast();
    const { data: centers = [] } = useCenters();
    const { data: history = [], isLoading: loadingHistory } = useMessages();
    const sendMessage = useSendMessage();

    const [activeTab, setActiveTab] = useState<RecipientGroup>("all");
    const [showHistory, setShowHistory] = useState(false);
    const [filters, setFilters] = useState<AudienceFilters>({});
    const [channels, setChannels] = useState<{
        email: boolean;
        whatsapp: boolean;
        sms: boolean;
    }>({
        email: true,
        whatsapp: false,
        sms: false,
    });
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const recipientGroups: { id: RecipientGroup; label: string; icon: string }[] = [
        { id: "all", label: "Broadcast", icon: "📢" },
        { id: "birthday", label: "Birthday", icon: "🎂" },
        { id: "new_members", label: "First Timers", icon: "✨" },
        { id: "unit", label: "Service Units", icon: "👥" },
        { id: "center", label: "By Centers", icon: "🏢" },
        { id: "gender", label: "Gender", icon: "🚻" },
        { id: "security", label: "Security Detail", icon: "🛡️" },
    ];

    const handleSend = async () => {
        if (!content) {
            toast({
                title: "Validation Error",
                message: "Please enter a message content.",
                type: "error",
            });
            return;
        }

        const selectedChannels = Object.entries(channels)
            .filter(([_, enabled]) => enabled)
            .map(([channel]) => channel as "email" | "whatsapp" | "sms");

        if (selectedChannels.length === 0) {
            toast({
                title: "Validation Error",
                message: "Please select at least one channel.",
                type: "error",
            });
            return;
        }

        try {
            await sendMessage.mutateAsync({
                recipient_group: activeTab,
                recipient_filters: filters,
                channels: selectedChannels,
                subject: channels.email ? subject : undefined,
                content,
            });

            toast({
                title: "Message Sent",
                message: "Your message is being processed and sent to the selected audience.",
                type: "success",
            });

            // Reset form
            setSubject("");
            setContent("");
        } catch (error) {
            toast({
                title: "Error",
                message: "Failed to send message. Please try again.",
                type: "error",
            });
        }
    };

    return (
        <AuthGuard>
            <Layout>
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Push Messaging</h1>
                            <p className="text-gray-600">Send tailored messages across multiple platforms</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={showHistory ? "primary" : "outline"}
                                size="sm"
                                onClick={() => setShowHistory(!showHistory)}
                            >
                                {showHistory ? "Compose Message" : "View History"}
                            </Button>
                            <Button variant="outline" size="sm">Drafts</Button>
                        </div>
                    </div>

                    {showHistory ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Message History</h2>
                            </div>
                            <Table
                                columns={[
                                    {
                                        key: "created_at",
                                        label: "Date",
                                        render: (val) => new Date(val).toLocaleDateString(),
                                    },
                                    {
                                        key: "recipient_group",
                                        label: "Audience",
                                        render: (val) => recipientGroups.find(g => g.id === val)?.label || val,
                                    },
                                    {
                                        key: "content",
                                        label: "Message Snippet",
                                        render: (val) => val.length > 50 ? val.substring(0, 50) + "..." : val,
                                    },
                                    {
                                        key: "channels",
                                        label: "Channels",
                                        render: (channels: string[]) => (
                                            <div className="flex gap-1">
                                                {channels.map(c => (
                                                    <span key={c} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full uppercase font-bold">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    },
                                    {
                                        key: "status",
                                        label: "Status",
                                        render: (val) => (
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                val === "sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                            )}>
                                                {val}
                                            </span>
                                        )
                                    }
                                ]}
                                data={history}
                                loading={loadingHistory}
                                emptyMessage="No messages sent yet."
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Sidebar / Group Selection */}
                            <div className="lg:col-span-3 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                                    Select Audience
                                </h3>
                                <nav className="space-y-1">
                                    {recipientGroups.map((group) => (
                                        <button
                                            key={group.id}
                                            onClick={() => setActiveTab(group.id)}
                                            className={clsx(
                                                "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                                activeTab === group.id
                                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <span className="mr-3 text-lg">{group.icon}</span>
                                            {group.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-9 space-y-6">
                                {/* Audience Configuration */}
                                <Card className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Target: {recipientGroups.find(g => g.id === activeTab)?.label}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeTab === "birthday" && (
                                            <Select
                                                label="Birthday Period"
                                                options={[
                                                    { value: "today", label: "Today" },
                                                    { value: "week", label: "This Week" },
                                                    { value: "month", label: "This Month" },
                                                ]}
                                                value={filters.period || "month"}
                                                onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
                                            />
                                        )}
                                        {activeTab === "new_members" && (
                                            <Select
                                                label="Added Since"
                                                options={[
                                                    { value: "today", label: "Today" },
                                                    { value: "week", label: "Last 7 Days" },
                                                    { value: "month", label: "Last 30 Days" },
                                                ]}
                                                value={filters.period || "week"}
                                                onChange={(e) => setFilters({ ...filters, period: e.target.value as any })}
                                            />
                                        )}
                                        {(activeTab === "center" || activeTab === "security") && (
                                            <Select
                                                label={activeTab === "security" ? "Select Center (Security Team)" : "Select Center"}
                                                options={centers.map(c => ({ value: c.id, label: c.name }))}
                                                value={filters.center_id || ""}
                                                onChange={(e) => setFilters({ ...filters, center_id: e.target.value, service_unit: activeTab === "security" ? "Security" : filters.service_unit })}
                                                placeholder="Choose a center"
                                            />
                                        )}
                                        {activeTab === "unit" && (
                                            <Select
                                                label="Select Service Unit"
                                                options={SERVICE_UNITS.map(u => ({ value: u, label: u }))}
                                                value={filters.service_unit || ""}
                                                onChange={(e) => setFilters({ ...filters, service_unit: e.target.value })}
                                                placeholder="Choose a unit"
                                            />
                                        )}
                                        {activeTab === "gender" && (
                                            <Select
                                                label="Select Gender"
                                                options={GENDER_OPTIONS}
                                                value={filters.gender || ""}
                                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                                placeholder="Choose gender"
                                            />
                                        )}
                                        {activeTab === "all" && (
                                            <div className="md:col-span-2">
                                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                                                    <span className="text-blue-500 mr-3 text-xl">ℹ️</span>
                                                    <div>
                                                        <p className="text-sm text-blue-800 font-medium">Broadcast Mode</p>
                                                        <p className="text-sm text-blue-700">This message will be sent to all active members across all centers.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Message Composer */}
                                <Card className="overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900">Message Content</h2>
                                        <div className="flex gap-4">
                                            {["email", "whatsapp", "sms"].map((channel) => (
                                                <label key={channel} className="flex items-center space-x-2 cursor-pointer group">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={channels[channel as keyof typeof channels]}
                                                            onChange={(e) => setChannels({ ...channels, [channel]: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all"></div>
                                                        <svg className="absolute top-1 left-1 w-3 h-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase">
                                                        {channel}
                                                    </span>
                                                    {(channel === "whatsapp" || channel === "sms") && (
                                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">PROTOTYPE</span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {channels.email && (
                                            <Input
                                                label="Email Subject"
                                                placeholder="Enter subject line..."
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            />
                                        )}

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Message</label>
                                            <textarea
                                                rows={8}
                                                className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all p-4 text-gray-900 placeholder-gray-400"
                                                placeholder="Type your message here..."
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500 flex justify-between">
                                                <span>Tip: Mention [Name] to personalize the message</span>
                                                <span>{content.length} characters</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Estimated reach: <span className="font-bold text-gray-900">~1,250 members</span>
                                        </p>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="px-8 shadow-xl shadow-primary-200"
                                            onClick={handleSend}
                                            loading={sendMessage.isLoading}
                                        >
                                            Send Message Now
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </Layout>
        </AuthGuard>
    );
}
