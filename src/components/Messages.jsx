import React, { Component } from 'react';

export default class Messages extends Component {
    constructor(props) {
        super(props);
        this.scrollDown = this.scrollDown.bind(this);
    }

    scrollDown() {
        const { container } = this.refs;
        container.scrollTop = container.scrollHeight;
    }

    componentDidMount() {
        this.scrollDown();
    }

    componentDidUpdate(prevProps, prevState){
        this.scrollDown();
    }
    render() {
        const { messages, user, typingUsers } = this.props;
        return(
            <div ref="container" className="thread-container">
                <div className="thread">
                    {
                        messages.map((mes) => {
                            const sendMessage = mes.message;
                            let GIF, isGIF = false;
                            if(sendMessage.includes('gif::', 0)) {
                                GIF = sendMessage.replace('gif::', '');
                                isGIF = true;
                            }
                            return (
                                <div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
                                    <div className="time">{mes.time}</div>
                                    <div className="data">
                                        <div className="message">
                                        {
                                            isGIF ? <img src={GIF} alt="A GIF"/>
                                            : sendMessage
                                        }
                                        </div>
                                        <div className="name">{mes.sender}</div>
                                    </div>
                                </div> 
                            );
                        })
                    }
                    {
                        typingUsers.map((name) => {
                            return(
                                <div key={name} className="typing-users">
                                    {`${name} is typing . . .`}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}