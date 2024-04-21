import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { FaUserCircle } from "react-icons/fa";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation, groupUsers } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";

	//groupUsers contains participants array i.e user object in the participants array
	const existingIndex = groupUsers.findIndex(item => item._id ===  message.senderId);

	//-----------------------------------------------------------if message was sent to a group-------------------------------else get the receiver's profile pic----------//
	const profilePic = existingIndex != -1 ? (fromMe ? authUser.profilePic : groupUsers[existingIndex]?.profilePic || null) : (selectedConversation.profilePic || null);
	const senderName = existingIndex != -1 ? (fromMe ?  'You' : groupUsers[existingIndex]?.fullName || 'Unknown') : (selectedConversation.fullName || 'Unknown');
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";


	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					{profilePic ? <img alt='Tailwind CSS chat bubble component' src={profilePic} /> : <FaUserCircle className="w-10 h-10 text-white"/>}
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 relative pt-4`}>
				<span className="absolute text-xs top-1 left-4 text-9px">{senderName}</span>
				{message.message}
				</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>{formattedTime}</div>
		</div>
	);
};
export default Message;
