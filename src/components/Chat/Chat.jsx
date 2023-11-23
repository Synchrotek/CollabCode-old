import React, { useEffect, useState } from 'react'
import socketIO from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import ReactScrollToBottom from 'react-scroll-to-bottom';
import './Chat.css';
import Message from './Message';

const ENDPOINT = import.meta.env.VITE_ENDPOINT;
// const ENDPOINT = "http://localhost:4500/";
let socket;

const Chat = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const user = userInfo.name;

    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);

    const send = () => {
        const message = document.getElementById('chatInput').value;
        socket.emit('message', { message, id });
        document.getElementById('chatInput').value = "";
    }

    // console.log(messages);
    useEffect(() => {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });
        socket.on('connect', () => {
            console.log("Connected to the server");
            setId(socket.id);
        });
        socket.emit('joined', { user });
        socket.on('welcome', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        })
        return () => {
            // socket.emit('disconnect');
            socket.close();
        }
    }, []);

    useEffect(() => {
        socket.on('userJoined', (data) => {
            const connStatus = (`${data.user} -${data.message}`);
            setMessages([...messages, { connStatus, id: data.id }]);
        })
        socket.on('leave', (data) => {
            const connStatus = (`${data.user} -${data.message}`);
            setMessages([...messages, { connStatus, id: data.id }]);
        })
        return () => {
            // socket.emit('disconnect');
            socket.off();
        }
    }, [user, messages]);

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages([...messages, data]);
        })

        return () => {
            socket.off();
        }
    }, [messages])

    if (!user) { navigate("/"); }
    return (
        <div className='chatPage'>
            <div className="chatContainer">
                <div className="header">
                    <h2>MsgEnger</h2>
                    <a href="/">
                        <i className="fa-solid fa-xmark"></i>
                    </a>
                </div>

                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, index) => {
                        if (item.hasOwnProperty('connStatus')) {
                            return (
                                <Message
                                    key={`connStatus-${index}`}
                                    connStatus={'connStatus'}
                                    message={item.connStatus}
                                    classs={'center'} />
                            )
                        } else {
                            return (
                                <Message
                                    key={`connStatus-${index}`}
                                    user={item.id === id ? '' : item.user}
                                    message={item.message}
                                    classs={item.id === id ? 'right' : 'left'} />
                            )
                        }
                    })}
                </ReactScrollToBottom>

                <div className="inputBox">
                    <textarea id='chatInput'
                        onKeyDownCapture={e => (e.key === 'Enter' && e.shiftKey) ? send() : null}
                    ></textarea>
                    <button onClick={send} className='sendBtn'>
                        <i className="fa-solid fa-location-arrow sendBtnI"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat