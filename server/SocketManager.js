const io = require('./app.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT, USER_DISCONNECTED,
	 	COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT,
	 	 TYPING, PRIVATE_MESSAGE, NEW_CHAT_USER }  = require('../src/Events')
const { createUser, createMessage, createChat } = require('../src/Factories')
let connectedUsers = { }

let communityChat = createChat({ isCommunity: true})

module.exports = function(socket){
					
	// console.log('\x1bc'); //clears console
	console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;

	//Verify Username
	socket.on(VERIFY_USER, (nickname, callback)=>{
        console.log("verify user")
		if(isUser(connectedUsers, nickname)){
            callback({ isUser:true, user:null })
            console.log("he is already there")
		}else{
            callback({ isUser:false, user:createUser({name:nickname, socketId: socket.id})});
		}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user)=>{
		user.socketId = socket.id;
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name);
		sendTypingFromUser = sendTypingToChat(user.name);
		
		io.emit(USER_CONNECTED, connectedUsers);
	})

	//User closes socket
	socket.on('disconnect', () => {
		if ("user" in socket) {
			connectedUsers = removeUser(connectedUsers, socket.user.name);
			io.emit(USER_DISCONNECTED, connectedUsers);
			console.log("Disconnected: " + socket.user)
		}
	})

	//User logouts
	socket.on(LOGOUT, () => {
		connectedUsers = removeUser(connectedUsers, socket.user.name);
		io.emit(USER_DISCONNECTED, connectedUsers);
		console.log("Logout:" , socket.user)
	})

	//User joins community chat
	socket.on(COMMUNITY_CHAT, (callback) => {
		callback(communityChat);
	})

	//User sends message
	socket.on(MESSAGE_SENT, ({chatId, message}) => {
		console.log(message);
		sendMessageToChatFromUser(chatId, message);
	})

	//User types
	socket.on(TYPING, ({chatId, isTyping}) => {
		console.log(chatId, isTyping);
		sendTypingFromUser(chatId, isTyping);
	})

	socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat}) => {
		//console.log(reciever, sender);
		if (receiver in connectedUsers) {
			const receiverSocket = connectedUsers[receiver].socketId;
			if (activeChat === null || activeChat.id === communityChat.id) {
				const newChat = createChat({ name: `${receiver} & ${sender}`, users:[receiver, sender]});
				
				socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
				socket.emit(PRIVATE_MESSAGE, newChat);
			} else {
				if (!(receiver in activeChat.users)) {
					activeChat.users
								.filter((user) => user in connectedUsers)
								.map( user => connectedUsers[user] )
								.map( user => {
									socket.to(user.socketId).emit(NEW_CHAT_USER, { chatId: activeChat.Id, newUser: receiver})
								});
					socket.emit(NEW_CHAT_USER, {chatId: activeChat.id, newUser: receiver});
				}
				socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
			}
		}
	});
}

/**
 * same as function below
 * @param {*} user 
 */
function sendTypingToChat(user) {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, {user, isTyping});
	}
}

/**	HOF
 * sends message to the chat box
 * @param chatId,
 * @param message
 * @return Message, type of message and sender
 */
function sendMessageToChat(sender) {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
	}
}

/**
  * Adds user to list passed in.
  * @param userList {Object} Object with key value pairs of users
  * @param user {User} the user to added to the list.
  * @return userList {Object} Object with key value pairs of Users
  */
function addUser(userList, user){
	let newList = Object.assign({}, userList)
    newList[user.name] = user
    console.log("adedd to list user")
	return newList
}

/**
 * Removes user from the list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {string} name of user to be removed
 * @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/**
 * Checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, username){
  	return username in userList
}
