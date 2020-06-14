import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message.jsx';

import './Messages.scss';

// const name = "Jimmy"
// let messages = [
//   {text: "lol", user: "Jimmy"},
//   {text: "jk", user: "Trung"}
// ]
const Messages = ({messages, name}) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </ScrollToBottom>
);

export default Messages;