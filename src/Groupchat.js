import React from "react";

class Groupchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageText: null,
      groupMessage: [],
      user: {},
      isAuthenticated: true,
    };

    this.randomStringGenerator = () => {
      const randomStrings = [
        "Hello!",
        "How can I help you?",
        "Nice to meet you!",
        "What's up?",
        "I'm a friendly bot!",
      ];
      const randomIndex = Math.floor(Math.random() * randomStrings.length);
      return randomStrings[randomIndex];
    };
  }

  sendMessage = () => {
    const randomResponse = this.randomStringGenerator();
    const newMessage = {
      id: Date.now(),
      sender: { uid: this.state.user.username },
      data: { text: this.state.messageText },
    };

    const aiReply = {
      id: Date.now() + 1,
      sender: { uid: "AI" },
      data: { text: randomResponse },
    };

    this.setState((prevState) => ({
      groupMessage: [...prevState.groupMessage, newMessage, aiReply],
      messageText: null,
    }));
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendMessage();
    event.target.reset();
  };

  handleChange = (event) => {
    this.setState({ messageText: event.target.value });
  };

  getUser = () => {
    // Simulating user authentication
    const mockUser = { uid: "000", username: "JohnDoe" };
    this.setState({ user: mockUser });
  };

  componentDidMount() {
    this.getUser();
    // No message listener for the demo, as it requires a real-time chat service
  }

  render() {
    const { isAuthenticated } = this.state;
    return (
      <div className="chatWindow">
        <ul className="chat" id="chatList">
          {this.state.groupMessage.map((data) => (
            <div key={data.id}>
              {this.state.user.username === data.sender.uid ? (
                <li className="self">
                  <div className="msg">
                    <p>{data.sender.uid}</p>
                    <div className="message"> {data.data.text}</div>
                  </div>
                </li>
              ) : (
                <li className="other">
                  <div className="msg">
                    <p>{data.sender.uid}</p>
                    <div className="message"> {data.data.text} </div>
                  </div>
                </li>
              )}
            </div>
          ))}
        </ul>
        <div className="fixed-bottom chatInputWrapper">
          <form onSubmit={this.handleSubmit}>
            <input
              className="textarea input"
              type="text"
              placeholder="Enter your message..."
              onChange={this.handleChange}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Groupchat;
