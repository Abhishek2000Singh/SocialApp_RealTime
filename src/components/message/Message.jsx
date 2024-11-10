import "./message.css"
import React from 'react'
import { format } from 'timeago.js'

export default function Message({ message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg"
                    src="/assets/person/4.jpeg" alt="" />
                <p className="messageText">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}
