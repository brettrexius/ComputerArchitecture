import React, { useState, useEffect } from "react";
import './ChatBox.scss';
import InfoBar  from './InfoBar/InfoBar.jsx';
import Messages from './Messages/Messages.jsx';
import Input    from './Input/Input.jsx';



const ChatBox = ({currentUser, message, setMessage, messages, sendMessage, setMessages, groups, selectedGroup}) => {
  // const [name, setName]         = useState('Jimmy');
  // const [message, setMessage]   = useState('');
  // const [messages, setMessages] = useState([
  //   {text: "lol", user: "Jimmy"},
  //   {text: "jk", user: "Trung"}
  // ]);

  // useEffect(()=>{
  //   socket.on('message', (message) => {
  //     console.log("in Effect!");
  //     setMessages([...messages, message ]);
  //   });
  // }, [messages])
  
  // const sendMessage = (e) =>{ 
  //   e.preventDefault();
  //   if(message.length !== 0){
  //     console.log("in Effect!");
  //     let nmsg = {text: message, user: currentUser};
  //     socket.emit('sendMessage', nmsg , ()=>setMessage(''));
  //   }
  // }

  return (
    <div className="chat-box">
      <InfoBar/>
      <Messages messages={messages} name={currentUser}/>
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      {/* <InfoBar />
      <Messages messages={messages} name={currentUser}/>
      <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/> */}
    </div>
  );
}

export default ChatBox;
