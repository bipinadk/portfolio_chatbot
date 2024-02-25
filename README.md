# portfolio_chatbot
A personalized LLM chatbot for a portfolio like website. This website is completely client side, so no need to worry about server costs. Just worry about api costs I guess. I use openai, and pinecone api's to acheive this client side and host it in cloudflare pages. Here is how it works:


- Any queries (questions) made by the user will be passed into OpenAI embedding models to get embeddings\
- The embeddings are then passed into pinecone for cosine similarity search among the vector database of your documents (personal information that you want the llm to know like information on CV, etc)
- The most similar documents are then sent to OpenAI's gpt LLM to generate answers.
- Answers are passed to the user.

![ui screenshot](<Screenshot 2024-02-25 010527.png>)

![screenshot of a joke](<Screenshot 2024-02-25 010551.png>)

### Here are the features of this project.
1. Client side, no server needed.
2. Chat history comprehension for each session. (Meaning it doesn't just forget what you asked it earlier)
3. Easy vectordb creation. There is a python notebook that goes through you creating a pinecone index, and populating it with your data.
4. Comments in code to help you along the way


## Septup Your Own
Step by Step guide how to get it working for you:
1. Signup for OpenAI api and Pinecone API
2. Follow the steps in PineconeSetup.ipynb to create a pinecone db. (You can use google colab for this)
3. Fork the code to make changes.
4. Now to the code, you need to make the following adjustments
    - change the system prompt in openai.js line 22. (This will tell the llm, whose assistant it is).
    - change the OpenAPI endpoint in openai.js line 32. (I am using cloudflare's AI gateway, but you can use OPENAI endpoins directly. It's should be "https://api.openai.com/v1/chat/completions")
5. Update the environment variables in your deployment environment like github pages or cloudflare pages. Keep the name of variables same for simplicity. Here are the list of variables you need to include.
    - REACT_APP_API_KEY='your openai apikey'
    - REACT_APP_API_KEY_Pinecone='your pinecone apikey'
    - REACT_APP_URL_Pinecone='Url to the index you created. This can be found on your pinecone dashboard'
6. Make necessary changes to the UI elements in app.js return section. (This will dictate what will be shown in the UI)
7. Change the CV and image (name lowreg.png) in the public folder.
8. Deploy the website (in cloudflare pages, this happens automatically if you have set your forked github repo as the source. And you pushed the changes.)

Important!!! Careful not to leak any environment variables in the code. You need to put it in your static page host (github pages or cloudflare pages).

##### No need to credit me! Happy coding! Don't forget to give me a github star on github.com/bipinadk/portfolio_chatbot/. 😊😁