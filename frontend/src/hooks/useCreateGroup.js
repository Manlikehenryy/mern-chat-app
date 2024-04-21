import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useCreateGroup = () => {
	const [loading, setLoading] = useState(false);
	const { setConversations , conversations} = useConversation();

	const CreateGroup = async (name,participants) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/groups`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, participants }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

            setConversations([data,...conversations]);

            toast.success('Group created successfully');
			
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { CreateGroup, loading };
};
export default useCreateGroup;
