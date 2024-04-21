import Group from "../models/group.model.js";

export const createGroup = async (req, res) => {
	try {
		const { name, participants } = req.body;
		const userId = req.user._id;

		if (participants && name) {
			participants.push(userId);

			const newGroup = await Group.create({
				name,
				participants,
				admin: userId
			});

			await newGroup.save();

		    return res.status(201).json(newGroup);
		}
		
		res.status(400).json({ error: "Invalid data" });
		
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


