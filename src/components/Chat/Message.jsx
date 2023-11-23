import React from 'react'
import './Message.css'

const Message = ({ user, connStatus, message, classs }) => {

    if (user) {
        return (
            <span className={`messageBox ${classs}`}>
                <span className='userName'>{`${user}: `}
                </span>{`${message}`}
            </span>
        )
    }
    else {
        return (
            <div className={`${connStatus ? '' : 'messageBox'} ${classs}`}>
                <span className='userNameYou'>{connStatus ? '' : 'You: '}
                </span>{`${message}`}
            </div>
        )
    }
}

export default Message