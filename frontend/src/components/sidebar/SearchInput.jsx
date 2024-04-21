import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import useCreateGroup from "../../hooks/useCreateGroup";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const [groupName, setGroupName] = useState("");
	const [participants, setParticipants] = useState([]);
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();
	const {loading, CreateGroup} = useCreateGroup();

	const filteredConversations = conversations.filter(conversation => conversation?.fullName);
    const [checkBoxes, setCheckBoxes] = useState(
		filteredConversations.map(() => false)
    );


	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		const conversation = conversations.find((c) => c.fullName ? c.fullName.toLowerCase().includes(search.toLowerCase()) : c.name.toLowerCase().includes(search.toLowerCase()));

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
		} else toast.error("No such user found!");
	};

	
    const addParticipants = (id, index) => {
        const updatedCheckBoxes = [...checkBoxes];
        updatedCheckBoxes[index] = !updatedCheckBoxes[index];
        setCheckBoxes(updatedCheckBoxes);

		const existingIndex = participants.findIndex((userId)=> userId === id)

		if (existingIndex == -1) {
		  setParticipants([...participants,id])
		}
		else{
		  const updatedParticipants = participants.filter((userId)=> userId !== id)
		  setParticipants(updatedParticipants);
		}
    };

	const clearForm = () =>{
		setCheckBoxes(filteredConversations.map(() => false));
		setGroupName("");
		setParticipants([]);
	}

	const createGroup = async () =>{
		
		if (participants.length < 2) {
			toast.error('Select at least two participants');
			
			return;
		}
		else if(!groupName){
			toast.error('Enter group name');
			
			return;
		}

	
			await CreateGroup(groupName, participants);
			setCheckBoxes(filteredConversations.map(() => false));
			
	}

	return (
		<>
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search…'
				className='input input-bordered rounded-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
			<button onClick={()=>document.getElementById('my_modal_5').showModal()}>
				<MdGroupAdd className='w-6 h-6  text-white'/>
			</button>
		</form>

        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create a new group</h3>
            {/* <p className="py-4">Press ESC key or click the button below to close</p> */}
            <div className="modal-action flex-col">
				<div>
						<label className='label'>
							<span className='text-base label-text'>Group Name</span>
						</label>
						<input
							type='text'
							placeholder='Enter Group Name'
							className='w-full input input-bordered h-10'
							value={groupName}
							required
							onChange={(e) => setGroupName(e.target.value)}
						/>
					</div>

					<div>
						<h3 className="font-bold my-2">Add Participants</h3>
					{filteredConversations.map((conversation,i)=> 
					    conversation.fullName && 
					(<li className="list-none" key={conversation._id}><input type="checkbox" checked={checkBoxes[i]} onChange={()=> addParticipants(conversation._id,i)} name="" id="" /> {conversation.fullName}</li>)
				    )}
					</div>
	
					
              <form  method="dialog">
			   <div className="float-right">
			   <button className="btn my-4 mx-3 bg-gray-500 text-white" onClick={()=>createGroup()}>
						{loading ? <span className='loading loading-spinner'></span> : "Submit"}</button>
				
                <button className="btn bg-red-500 text-white" onClick={()=>clearForm()}>Close</button>
			   </div>
			
              </form>

            </div>
          </div>
        </dialog>
		</>
	);
};
export default SearchInput;

