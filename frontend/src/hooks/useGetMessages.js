import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation, setGroupUsers } = useConversation();

	var messageType = null;
	if(selectedConversation.fullName){
		messageType = 'Individual';
	}
	else{
		messageType = 'Group';
	}

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}/${messageType}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				setMessages(data.messages);
				setGroupUsers(data.groupUsers)
				
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
