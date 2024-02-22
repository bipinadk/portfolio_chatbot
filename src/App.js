import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);

  const sendMessage = async () => {

    if (userMessage.trim() === '') {
      return;
    }
    
    setUserMessage('');
    try {
      // getting the response
      // const response = await fetch('http://localhost:5000/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     chat_history: messages,
      //     question: userMessage,
      //   }),
      // });

      // Simulate server response by generating a random reply from a predefined set of strings///////////////////
      const replies = ["Hello", "random string1", "random string2", "string 3"];
      const randomIndex = Math.floor(Math.random() * replies.length);
      const randomReply = replies[randomIndex];
      ///////////////////////////////////////

      //parsing the response and adding the newMessages and newReply to revMessages array
      // if (response.ok) {
      //   const data = await response.json();
      //   const newMessage = { from: 'user', text: userMessage };
      //   setMessages((prevMessages) => [...prevMessages, newMessage]);// this spreads the prevMessages and adds newMessage 
      //   const newReply = { from: 'bot', text: data.answer, sources: data.sources };
      //   setMessages((prevMessages) => [...prevMessages, newReply]);
       
      // } else {
      //   console.error('Failed to get response from server:', response.statusText);
      // }

      //new message demo//////////////////////
      const newMessage = { from: 'user', text: userMessage };
      // Update messages state with new user message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Construct new reply message with the random reply
      const newReply = { from: 'bot', text: randomReply, sources: ['random source'] };
      // Update messages state with new bot reply/////
      setMessages((prevMessages) => [...prevMessages, newReply]);
      ///////////////////////////////

    } catch (error) {
      console.error('Error sending message:', error);
    }

  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    };

    // Scroll after a delay of 0.5 seconds
    const scrollTimer = setTimeout(scrollToBottom, 0);

    return () => clearTimeout(scrollTimer);
  }, [messages]);

  return (
    <div className="App">
      <div className='Title-Container'>
        <div className="Title-Image"></div>
        <h1 className='Title'>
          HI! I am Bipin
        </h1>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div key={index} className={message.from === 'user' ? 'user-message' : 'bot-message'}>
            {message.text}
            {message.from === 'bot' && <div style={{margin: '10px'}}/>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="ChatInput">
        <input
          type="text"
          placeholder="Chat with my AI 😊. Ask something about me!"
          value={userMessage}
          onChange={handleInputChange}
        />
        <button type="submit" className='sendbtn'>Send</button>
      </form>
      {/* CV and Source buttons */}
      <div className="ButtonContainer">
        <a href="https://github.com/bipinadk/portfolio_chatbot" className="BottomLeftButton"><div className='img_git'></div>Source</a>
        <a href="cv.pdf" className="BottomRightButton"><div className='img_download'></div>My CV</a>
      </div>
    </div>
  );
}

export default App;
