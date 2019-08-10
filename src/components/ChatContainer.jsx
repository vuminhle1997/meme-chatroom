import React from 'react';
import SideBar from './SideBar'
import { MESSAGE_SENT, TYPING, MESSAGE_RECEIVED, COMMUNITY_CHAT,
     PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER } from '../Events'
import MessageInput from './MessageInput';
import Messages from './Messages';
import ChatHeading from './ChatHeading';
import { values, difference, differenceBy } from 'lodash';
export default class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            users: [],
            activeChat: null,
            ACCESS_TOKEN: '',
            spotifyIsVerified: false,
            showSpotifyForm: false
        };
    }

    /**
     * Initialize the component!
     */
    componentDidMount = () => {
        const { socket } = this.props;
        this.initSocket(socket);
        setTimeout(() => {
            var url = new URL(window.location.href);
            var ACCESS_TOKEN = url.searchParams.get('code');
            console.log(ACCESS_TOKEN);
            if (ACCESS_TOKEN) this.setState({ACCESS_TOKEN: ACCESS_TOKEN, spotifyIsVerified: true})
        }, 100)
    }

    /**
     * Disconnects from socket!
     */
    componentWillUnmount() {
        const { socket } = this.props;
        socket.off(PRIVATE_MESSAGE)	
        socket.off(USER_CONNECTED)
        socket.off(USER_DISCONNECTED)
        socket.off(NEW_CHAT_USER)
    }

    /**
     * The method will do some tasks, based on the socket events!
     * @param {*} socket 
     */
    initSocket(socket) {
        socket.emit(COMMUNITY_CHAT, this.resetChat);
        socket.on(PRIVATE_MESSAGE, this.addChat);
        socket.on('connect', () => {
           socket.emit(COMMUNITY_CHAT, this.resetChat); 
        })
        socket.on(USER_CONNECTED, (users) => {
            this.setState({ users: values(users)})
        })
        socket.on(USER_DISCONNECTED, (users) => {
            const removedUsers = differenceBy( this.state.users, values(users), 'id');
            this.removeUsersFromChat(removedUsers);
            this.setState({ users: values(users)})
        })
        socket.on(NEW_CHAT_USER, this.addUserToChat);
    }

    /**
     * Sends a private message to a specific user!
     */
    sendOpenPrivateMessage = (receiver) => {
        const { socket, user } = this.props;
        const { activeChat } = this.state;
        socket.emit(PRIVATE_MESSAGE, {receiver, sender: user.name, activeChat});
    }

    /**
     * Add an user to a chatroom!
     */
    addUserToChat = ({chatId, newUser }) => {
        const { chats } = this.state;
        const newChats = chats.map((chat) => {
            if (chat.id === chatId) {
                return Object.assign({}, chat, { users: [ ...chat.users, newUser ]})
            }
            return chat;
        })
        this.setState({ chats: newChats})
    }

    /**
     * When an user disconnects from the chat client, he/she will be trown out from the invited
     * chat room
     */
    removeUsersFromChat = (removedUsers) => {
        const { chats } = this.state;
        const newChats = chats.map((chat) => {
            let newUsers = difference( chat.users, removedUsers.map(user => user.name));
            return Object.assign({}, chat, {users: newUsers});
        })
        this.setState({ chats: newChats})
    }

    /**
     * Resets the chats!
     * Gets called on initialization!
     */
    resetChat = (chat) => {
        return this.addChat(chat, true);
    }

    /**
     * Add whole content into chat!
     */
    addChat = (chat, reset) => {
        const { socket } = this.props;
        const { chats } = this.state;

        const newChats = reset ? [chat] : [...chats, chat];
        this.setState( { chats: newChats, activeChat: reset ? chat : this.state.activeChat } );

        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
		const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent,  this.updateTypingInChat(chat.id));
        socket.on(messageEvent, this.addMessageToChat(chat.id));
    }

    /**
     * Adds messages to a chat room!
     */
    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if (chat.id === chatId) {
                    chat.messages.push(message);
                }
                return chat;
            })

            this.setState( { chats: newChats } );
        }
    }

    /**
     * Shows in the chat room, who is typing!
     */
    updateTypingInChat = (chatId) => {
        return ({isTyping, user}) => {
            if (user !== this.props.user.name) {
                const { chats } = this.state;

                let newChats = chats.map((chat) => {
                    if (chat.id === chatId) {
                        if (isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user);
                        } else if (!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter( u => u !== user);
                        }
                    }
                    return chat;
                })
                this.setState( { chats: newChats });
            }
        }
    }

    /**
     * Show the active chats with all the users, you want to chat!
     */
    setActiveChat = (activeChat) => {
        this.setState({activeChat});
    }

    /**
     * Sends message to server!
     * Emits this message to the server!
     */
    sendMessage = (chatId, message) => {
        const { socket } = this.props;
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    /**
     * Emit to socket, which user is typing!
     */
    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit(TYPING, {chatId, isTyping});
    }

    verifySpotify = () => {
        const { spotifyIsVerified } = this.state;
        // TODO: verifies spotify,
        // if succeeded, user can show preview of tracks
        
        if (!spotifyIsVerified) {
            console.log("VERIFY SPOTIFY");
            window.location.replace("http://localhost:3231");
        } else {
            this.setState({ showSpotifyForm: true })
        }
    }

    render() {
        const { user, logout } = this.props;
        const { chats, activeChat, users } = this.state;
        return (
            <div className="container">
                <SideBar
                    logout={logout}
                    chats={chats}
                    user={user}
                    users={users}
                    activeChat={activeChat}
                    setActiveChat={this.setActiveChat}
                    onSendPrivateMessage={this.sendOpenPrivateMessage}
                />
                <div className="chat-room-container">
                    {
                        activeChat !== null ? 
                        <div className="chat-room">
                            <ChatHeading name={activeChat.name} verifySpotify={this.verifySpotify} />
                            <Messages 
                                messages={activeChat.messages}
                                user={user}
                                typingUsers={activeChat.typingUsers}
                            />
                            <MessageInput
                                sendMessage={
                                    (message) => {
                                        this.sendMessage(activeChat.id, message);
                                    }
                                }
                                sendTyping={
                                    (isTyping) => {
                                        this.sendTyping(activeChat.id, isTyping);
                                    }
                                }
                            />
                        </div>
                        : 
                        <div className="chat-room choose">
                            <h3>Choose a chat!</h3>
                        </div>
                    }
                </div>
            </div>
        )
    }
}