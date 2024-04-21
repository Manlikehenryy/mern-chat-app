import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	
	var isOnline = false;
	if (conversation.fullName) {
		isOnline = onlineUsers.includes(conversation._id);
	}


	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
			`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full'>
						{conversation.profilePic ? <img src={conversation.profilePic} alt='user avatar' />
						: <MdGroups className="w-10 h-10 text-white"/>}
						
			           
					
					</div>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation.fullName?conversation.fullName:conversation.name}</p>
						{/* <span className='text-xl'>{emoji}</span> */}
					</div>
				</div>
			</div>

			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;

