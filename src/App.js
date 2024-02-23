import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { fetchOpenAIRequest } from './openai.js';


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

      //Creating new message before calling the fetch data function//////////////////////
      console.log('UserMessage:',userMessage);
      const newMessage = { role: 'user', content: userMessage };
      // Update messages state with new user message
      setMessages((prevMessages) => [...prevMessages, newMessage]);

    } catch (error) {
      console.error('Error adding userMessage:', error);
    }

  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  //useEffect to fetchData and update the messages with reply 😊

  useEffect(() => {
  /////Funtion to use fetchOpenAIRequest from openai.js file////////////////////////////////////////////////////////////////
    async function fetchData() {
      try {
        const responseData = await fetchOpenAIRequest(messages);
        console.log('Response from Cloudflare API:', responseData);
        return responseData;
        // Process the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error);
        return error;
      }
    }
    const fetchDataAndUpdateMessages = async () => {
      try {
        const isLastMessageFromUser = messages.length > 0 && messages[messages.length - 1].role === 'user';
        if (isLastMessageFromUser) {
          console.log('Last message by user and: Updated Message under useEffect',messages);
          const reply = await fetchData();
          const newReply = { role: 'assistant', content: reply};
          // Update messages state with new bot reply/////
          setMessages((prevMessages) => [...prevMessages, newReply]);
        }
        else{
          console.log('last message not sent by user')
        }
      }
      catch(error){
        console.log('Error in UseEffect fetch',error);
      }
    };
  
    fetchDataAndUpdateMessages(); // Call the async function
  }, [messages]);
  


  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    };
    // printing messages for testing/////
    console.log('useEffect messages for testing',messages);

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
          <div key={index} className={message.role === 'user' ? 'user-message' : 'bot-message'}>
            {message.content}
            {message.role === 'assistant' && <div style={{margin: '10px'}}/>}
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
