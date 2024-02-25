async function getSimilarity(embeddings) {
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
    const Pinecone_API = getEnvValue('REACT_APP_API_KEY_Pinecone');
    const Pinecone_Url = getEnvValue('REACT_APP_URL_Pinecone')+"/query";

    const requestData = {
      vector: embeddings,
      includeMetadata: true,
      topK: 3
    };
    try {
      const response = await fetch(Pinecone_Url, {
        method: 'POST',
        headers: {
          'Api-Key': Pinecone_API,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok in pinecone');
      }
  
      const responseData = await response.json();
      const textValues = responseData.matches.map(match => match.metadata.text);
      return textValues;
    } catch (error) {
      console.error('Error fetching data in pinecone.js:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }
  
  export { getSimilarity };
  