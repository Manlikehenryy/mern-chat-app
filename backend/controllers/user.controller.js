import User from "../models/user.model.js";
import Group from "../models/group.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		const groups = await Group.find({
			participants: {
			  $elemMatch: {
				$in: [loggedInUserId],
			  },
			},
		  }).sort({ createdAt: -1 });

		res.status(200).json([...groups,...filteredUsers]);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
