import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";

const socket = io("http://localhost:8000");

const ChatRoom = () => {
    const { roomName } = useParams(); // Assume routes use /chat/:roomName
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const {account} = useContext(DataContext)

    useEffect(() => {
        // Join the chat room
        socket.emit("joinRoom", { room: roomName });

        // Fetch chat history
        const fetchMessages = async () => {
            const res = await fetch(`/api/chat/${roomName}`);
            const data = await res.json();
            setMessages(data);
        };

        fetchMessages();

        // Listen for new messages
        socket.on("message", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("message");
        };
    }, [roomName]);

    const sendMessage = () => {
        socket.emit("chatMessage", { room: roomName, username: account.username, message });
        setMessage("");
    };

    return (
        <div className='container mx-auto p-4'>
            <h2 className='text-2xl mb-4'>Room: {roomName}</h2>
            <div className='border p-4 h-96 overflow-y-auto'>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <p>
                            <strong>{msg.username}: </strong>
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
            <div className='flex mt-4'>
                <input
                    className='flex-1 border px-4 py-2'
                    placeholder='Enter message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className='bg-blue-600 text-white px-4 py-2'
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
