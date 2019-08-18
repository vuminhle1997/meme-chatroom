import React, { Component } from 'react';
import { Container, Button, Icon } from '@material-ui/core';

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
                            let spotifyName, imgURL, openURL, isSpotify = false;
                            /**
                             * Note:
                             * If it is a gif, send a GIF
                             * It it is a spotify item, initialzed all the corresponding variables to the item 
                             * and send this item content.
                             * Otherwise, just the message
                             */
                            if(sendMessage.includes('gif::', 0)) {
                                GIF = sendMessage.replace('gif::', '');
                                isGIF = true;
                            } else if (sendMessage.includes('spotify:')) {
                                spotifyName = sendMessage.substring(sendMessage.indexOf('?name=')+6, sendMessage.indexOf('&imgURL='));
                                imgURL = sendMessage.substring(sendMessage.indexOf('&imgURL=')+8, sendMessage.indexOf('&openURL='));
                                openURL = sendMessage.substring(sendMessage.indexOf('&openURL=')+9, sendMessage.length);
                                isSpotify = true;
                            }

                            /**
                             * Checks, whether to send a gif, spotify item or a normal message
                             */
                            const resultMessage = () => {
                                if (isGIF) return <img src={GIF} alt="A GIF"/>
                                if (isSpotify) return (
                                    <Container className="message-spotify">
                                        <img src={imgURL} alt={`artist ${spotifyName}`}/>
                                        <h2>{spotifyName}</h2>
                                        <Button variant="contained" color="secondary" onClick={() => {
                                            window.open(openURL, '_blank');
                                        }}>
                                            <Icon>
                                                link
                                            </Icon>
                                            Check that out!
                                        </Button>
                                    </Container>
                                )
                                return sendMessage;
                            } 
                            return (
                                <div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
                                    <div className="time">{mes.time}</div>
                                    <div className="data">
                                        <div className="message">
                                        {resultMessage()}
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