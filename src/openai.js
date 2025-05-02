// openaiApi.js

async function fetchOpenAIRequest(chatmessages,additionalContext) {
    // Function to get the value of an environment variable
    const getEnvValue = (name) => {
      // Check if the environment variable exists in the process environment
      if (typeof process.env !== 'undefined' ) {
        var context = {env: 'gg'}
        return process.env[name];
      } else {
        // Otherwise, fallback to the context environment
        console.log('process.env is undefined, meaning environment is different, using context.env');
        return context.env[name];
      }
    };
    const OPENAI_API_KEY = getEnvValue('REACT_APP_API_KEY');
    const LLM_gatewayURL = getEnvValue('REACT_APP_GATEWAY_URL');
    const LLM_model = getEnvValue('REACT_APP_MODEL');
    const convertedMessages = chatmessages.map(message => ({
      role: message.role,
      content: message.content
    }));
    /////////Adding the prompt template and additional context retrived from the similarity search////////////////
    convertedMessages.unshift({ role: "system", content: "You are a helpful personal AI assistant of Bipin Adihkari's portfolio website. Your main job is to solve user's questions that they might have about Bipin. Answer questions honestly and with a bit of excitement. Also keep in mind that you are not able to performs tasks like reminding me, sending email etc, you can only give instructions." });
    convertedMessages[0].content += `\n\nThe following context might be useful in answering user questions. Ignore it if it is not useful.\n${additionalContext}`
    console.log('This converted message is sent to the OpenAI api',convertedMessages)

    const requestData = {
      model: LLM_model,
      messages: convertedMessages
    };

    try {
      const response = await fetch(LLM_gatewayURL, {
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
  