import { useNavigate } from "react-router-dom";

const ChatRooms = () => {
    const navigate = useNavigate();

    // Predefined rooms
    const rooms = ["Web Development", "Blockchain", "AI/ML", "DevOps", "General Chat"];

    // Handle room selection
    const handleRoomSelect = (room) => {
        const roomSlug = room.replace(/\s+/g, "-").toLowerCase(); // Generate a slug for the room
        navigate(`/chat/${roomSlug}`); // Redirect to the selected chat room
    };

    return (
        <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>

        
        <div className='container mx-auto p-8'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Select a Chat Room</h1>
            <div className='flex flex-wrap justify-center gap-4'>
                {rooms.map((room, index) => (
                    <button
                        key={index}
                        onClick={() => handleRoomSelect(room)}
                        className='w-64 p-4 bg-gray-800 text-white rounded-lg text-center font-semibold hover:bg-gray-700 transition-all cursor-pointer'
                    >
                        {room}
                    </button>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ChatRooms;
