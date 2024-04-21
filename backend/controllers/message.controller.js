import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message, messageType } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		if (messageType == 'Individual') {
			let conversation = await Conversation.findOne({
				participants: { $all: [senderId, receiverId] },
			});
	
			if (!conversation) {
				conversation = await Conversation.create({
					participants: [senderId, receiverId],
				});
			}
	
			const newMessage = new Message({
				senderId,
				receiverId,
				message,
			});
	
			if (newMessage) {
				conversation.messages.push(newMessage._id);
			}

	
			// this will run in parallel
			await Promise.all([conversation.save(), newMessage.save()]);
	
			// SOCKET IO FUNCTIONALITY WILL GO HERE
			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				// io.to(<socket_id>).emit() used to send events to specific client
				io.to(receiverSocketId).emit("newMessage", newMessage);
			}

			res.status(201).json(newMessage);
		}
		else if (messageType == 'Group') {
			let conversation = await Conversation.findOne({
				groupId: receiverId,
			});
	
			if (!conversation) {
				conversation = await Conversation.create({
					groupId: receiverId,
				});
			}
	
			const newMessage = new Message({
				senderId,
				groupId: receiverId,
				message,
			});
	
			if (newMessage) {
				conversation.messages.push(newMessage._id);
			}
	
	
			// this will run in parallel
			await Promise.all([conversation.save(), newMessage.save()]);

			const group = await Group.findOne({
				   _id: receiverId
			  });
	
			group.participants.forEach((id)=>{
              
				if (!id.equals(senderId)) {
					
			        // SOCKET IO FUNCTIONALITY WILL GO HERE
			        const receiverSocketId = getReceiverSocketId(id);
			        if (receiverSocketId) {
						
			        // io.to(<socket_id>).emit() used to send events to specific client
			        	io.to(receiverSocketId).emit("newMessage", newMessage);
			        }

				}
			})

			res.status(201).json(newMessage);
		}
		

		
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId, messageType } = req.params;
		const senderId = req.user._id;

		if (messageType === 'Individual') {
			const conversation = await Conversation.findOne({
				participants: { $all: [senderId, userToChatId] },
			}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
	
			if (!conversation) return res.status(200).json({messages:[],groupUsers : []});
	
			const messages = conversation.messages;
	
			res.status(200).json({messages,groupUsers : []});
		}
		else if (messageType === 'Group') {
			const conversation = await Conversation.findOne({
				groupId: userToChatId
			}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
	
			if (!conversation) return res.status(200).json({messages:[],groupUsers : []});
	
			const messages = conversation.messages;

			var group = null;

			
			group = await Group.findOne({
				_id: userToChatId
			}).populate('participants');

			const groupUsers = group.participants;
		
			res.status(200).json({messages,groupUsers});
		}
		else{
			res.status(400).json({error:'missing message type'});
		}

	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
