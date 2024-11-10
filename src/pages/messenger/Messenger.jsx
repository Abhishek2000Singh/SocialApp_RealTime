import React, { useContext, useEffect, useRef, useState } from 'react'
import "./messenger.css"
import { Topbar } from '../../components/indexComp'
import Conversation from '../../components/conversation/Conversation'
import { Message, ChatOnline } from '../../components/indexComp'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'


export default function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    // const [socket, setSocket] = useState("");
    const socket = useRef(io("ws://localhost:8900"));
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    // useEffect(() => {
    //     setSocket(io("ws://localhost:8900"))
    // }, [])
    // console.log(socket);

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(user.following.filter((f) => users.some((u) => u.userId === f))
            
            );
        });
    }, [user])


    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                // console.log(res);
                setConversations(res.data)
            }
            catch (error) {
                console.log(error);
            };
        }
        getConversations();
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error);
            }
        };
        getMessages()
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        }

        const receiverId = currentChat.members.find((member) => member !== user._id);

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })

        try {
            const res = await axios.post("/messages/", message);
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth', block: 'nearest', inline: 'nearest'
        });
    }, [messages])

    return (
        <>
            <Topbar />
            <div className='messenger'>
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for friends" className='chatMenuInput' />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation key={c._id} conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        {messages.map((m) => (
                                            <div ref={scrollRef}>
                                                <Message key={m._id} message={m} own={m.sender === user._id} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            placeholder='write something...'
                                            className="chatMessageInput"
                                            id="messageInp"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>
                                        <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                                    </div>
                                </> : <span className='noConversationText'>Open a Conversation to Start a Chat</span>
                        }
                    </div>

                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>
        </>
    )
}
