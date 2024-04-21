import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    groupUsers: [],
	setGroupUsers: (groupUsers) => set({ groupUsers }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	conversations: [],
	setConversations: (conversations) => set({ conversations }),
}));

export default useConversation;
