// openaiApi.js

async function fetchOpenAIRequest(chatmessages) {
    // Function to get the value of an environment variable
    const getEnvValue = (name) => {
      // Check if the environment variable exists in the context environment
      if (typeof process.env !== 'undefined' ) {
        console.log('context undefined using process.env', process.env[name]);
        var context = {env: 'gg'}
        return process.env[name];
      } else {
        // Otherwise, fallback to the process environment
        console.log('context defined, using context.env',context.env[name]);
        return context.env[name];
      }
    };
    const OPENAI_API_KEY = getEnvValue('REACT_APP_API_KEY');
    const convertedMessages = chatmessages.map(message => ({
      role: message.role,
      content: message.content
    }));
    /////////Adding the prompt template////////////////
    convertedMessages.unshift({ role: "system", content: "You are an personal AI assistant of Bipin Adihkari website. Your main job is to solve user's questions that they might have about Bipin. Here is some information that might help. From Nepal, Lives in Sophia Antipolis, France. Final year Master's In Data Science Student at Eurecom, France. Currently intern at OpenAirInterface  " });

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: convertedMessages
    };
    console.log('Converted Messages',convertedMessages)
    console.log(OPENAI_API_KEY);

    try {
      const response = await fetch('https://gateway.ai.cloudflare.com/v1/731de533be6a839e17f5f08ce4b3a874/portfolio/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      return responseData.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }
  
  export { fetchOpenAIRequest };
  