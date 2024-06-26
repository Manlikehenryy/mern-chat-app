import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import toast from 'react-hot-toast'
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
            toast.success(newMessage.message.substring(0, 30))

			//if message came from the current open conversation
			if (selectedConversation._id === newMessage.senderId || selectedConversation._id === newMessage?.groupId) {
				setMessages([...messages, newMessage]);
			}
						
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
