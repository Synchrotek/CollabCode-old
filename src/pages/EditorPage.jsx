import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../config/socket';
import ACTIONS from '../../Actions';
import { useLocation, useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IconContext } from 'react-icons';
import TodoApp from '../components/TodoApp'
import { AiOutlineClose } from "react-icons/ai";
import './EditorPage.css'

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    useEffect(() => {
        const init = async () => {
            const handleErrors = (err) => {
                console.log('Socket error: ', err);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }

            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined the room.`)
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    socketId,
                    code: codeRef.current
                });
            })

            // Listening for disconnected event
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients(prev => {
                    return prev.filter(client => client.socketId !== socketId)
                })
            })
            socketRef.current.on('selfDisconnected', () => {
                localStorage.removeItem("userInfo");
                alert('See u later');
            })
        }
        init();

        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, [])

    const copyRoomIdHandler = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied');
        } catch (error) {
            toast.error('Could not copy the Room ID');
            console.log(error);
        }
    }

    const leaveRoomHandler = () => {
        reactNavigator('/');
    }

    if (!location.state) {
        <Navigate to='/' />
    }

    return (
        <div className='mainWrap'>
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className='logoImg' src="/LeetCode.png" alt="" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {clients.map(client => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>


                <IconContext.Provider value={{ color: '#fff' }}>
                    <button className='btn leaveBtn'
                        onClick={showSidebar}>TO DO</button>
                    <div className="navbar">
                        <div className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                            <div className='nav-menu-items'>
                                <div className="navbar-toggle">
                                    <Link className='menu-bar-close'>
                                        <AiOutlineClose onClick={showSidebar} />
                                    </Link>
                                </div>
                                <TodoApp />
                            </div>
                        </div>
                    </div>
                </IconContext.Provider>


                <button className='btn coyBtn'
                    onClick={copyRoomIdHandler}
                >Copy Room ID</button>
                <button className='btn leaveBtn'
                    onClick={leaveRoomHandler}
                >Leave</button>
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={code => codeRef.current = code}
                />
            </div>

        </div>
    )
}

export default EditorPage