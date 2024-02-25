async function getEmbedding(msg) {
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


    const requestData = {
      input: msg,
      model: 'text-embedding-ada-002',
    };
    console.log('Message sent for embedding',msg)
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
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
      return responseData['data'][0]['embedding'];
    } catch (error) {
      console.error('Error fetching data in embedding.js:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }
  
  export { getEmbedding };
  