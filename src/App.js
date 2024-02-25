import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { fetchOpenAIRequest } from './openai.js';
import { getEmbedding } from './embedding.js';
import { getSimilarity } from './pinecone.js';

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

  //This useEffect checks for updates in messages, if the last update user usermessage
  //it sends it for embedding, send for similarity search and finally sends it to the llm 😊
  useEffect(() => {
  /////Funtion to use fetchOpenAIRequest from openai.js file
    async function fetchData(similarity) {
      try {
        const responseData = await fetchOpenAIRequest(messages,similarity);
        console.log('Parsed response from OpenAI:', responseData);
        return responseData;
      } catch (error) {
        console.error('Error fetching data:', error);
        return error;
      }
    }
    const fetchDataAndUpdateMessages = async () => {
      try {
        //checking if last message was from user
        const isLastMessageFromUser = messages.length > 0 && messages[messages.length - 1].role === 'user';
        if (isLastMessageFromUser) {
          //genetrate embedding
          const embedding = await getEmbedding(messages[messages.length - 1].content);
          console.log('recieved embeddings',embedding);
          //get similarity from embedding
          const similarity = await getSimilarity(embedding);
          console.log('Retrieved similarity documents',similarity);
          //sending the text recieved to llm
          const reply = await fetchData(similarity);
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
  
    fetchDataAndUpdateMessages(); //Note we are calling the funtions defined about everytime message is updated
  }, [messages]);
  

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    };
    // Scroll after a delay of 0 seconds
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
