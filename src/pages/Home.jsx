import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import './Home.css'
import { useNavigate } from 'react-router-dom'

// Functional component `````````````````````````````````````````````````````````
const Home = () => {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room Id')
  };
  const joinRoomHandler = () => {
    if (!roomId || !username) {
      toast.error('Room ID & Username is required');
      return;
    }
    // redirect to editor page
    navigate(`/editor/${roomId}`, {
      state: { username, },
    });
  }


  return (
    <div className='homePageWrapper'>
      <div className="formWraper">
        <img className='homePageLogo' src="/LeetCode.png" alt="Leetcode Logo" />
        <h4 className='mainLabel'>Paste Room Invitation ID</h4>
        <div className="inputGroup">
          <input type="text" className='inputBox' placeholder='ROOM ID'
            value={roomId} onChange={e => setRoomId(e.target.value)}
            onKeyUp={e => e.code === 'Enter' ? joinRoomHandler() : null}
          />
          <input type="text" className='inputBox' placeholder='USERNAME'
            value={username} onChange={e => setUsername(e.target.value)}
            onKeyUp={e => e.code === 'Enter' ? joinRoomHandler() : null}
          />
        </div>
        <button className='btn joinBtn'
          onClick={joinRoomHandler}
        >Join</button>
        <div className='createInfo'>
          If you don't have an invite then create &nbsp;
          <a onClick={createNewRoom} className='createNewBtn'>new room</a>
        </div>
      </div>
      <footer>
        <h4>Built with 💛 by <a href='http://github.com'>ByteAstro</a></h4>
      </footer>
    </div>
  )
}

export default Home