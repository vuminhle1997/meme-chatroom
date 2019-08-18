import React, { Component } from 'react';
import { SideBarOption } from './SidebarOption'

import { get, last, differenceBy } from 'lodash';
import { createChatNameFromUsers } from '../Factories'
import { Icon } from '@material-ui/core';
export default class SideBar extends Component{
	static type = {
		USERS:"users",
		CHATS:"chats"
	}
	constructor(props){
		super(props)
		this.state = {
			receiver:"",
			activeSideBar: SideBar.type.CHATS
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		const { receiver } = this.state
		const { onSendPrivateMessage } = this.props

		onSendPrivateMessage(receiver)
		this.setState({receiver:""})
	}

	addChatForUser = (receiver) => {
		this.props.onSendPrivateMessage(receiver)
		this.setActiveSideBar(SideBar.type.CHATS)
	}
	setActiveSideBar = (type) => {
		this.setState({ activeSideBar:type })
	}

	render(){
		const { chats, activeChat, user, setActiveChat, logout, users } = this.props
		const { receiver, activeSideBar } = this.state
		return (
			<div id="side-bar">
					<div className="heading">
						<div className="app-name">Our Cool Chat </div>
					</div>
					<form onSubmit={this.handleSubmit} className="search">
						<i className="search-icon"><Icon>
							search</Icon></i>
						<input 
							placeholder="Search" 
							type="text"
							value={receiver}
							onChange={(e)=>{ this.setState({receiver:e.target.value}) }}/>
						<div className="plus"></div>
					</form>
					<div className="side-bar-select">
						<div 
							onClick = { ()=>{ this.setActiveSideBar(SideBar.type.CHATS) } }
							className={`side-bar-select__option ${ activeSideBar === SideBar.type.CHATS ? 'active':''}`}>
							<span>Chats</span>
						</div>
						<div 
							onClick = { ()=>{ this.setActiveSideBar(SideBar.type.USERS) } }
							className={`side-bar-select__option ${ activeSideBar === SideBar.type.USERS ? 'active':''}`}>
							<span>Users</span>
						</div>
					</div>
					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
						
						{
						activeSideBar === SideBar.type.CHATS ?
						chats.map((chat)=>{
								return(
								<SideBarOption 
									key = {chat.id}
									lastMessage = { get(last(chat.messages), 'message', '') }
									name = { chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name) }
									active = { activeChat.id === chat.id }
									onClick = { ()=>{ this.props.setActiveChat(chat) } }
								/>
							)
						})	
						
						:
							differenceBy(users, [user], 'name').map((user)=>{
								return <SideBarOption 
									key = { user.id }
									name = { user.name }
									onClick = { ()=>{ this.addChatForUser(user.name) }  }
								/>
							})
						}
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							<Icon>
								eject
							</Icon>
						</div>
					</div>
			</div>
		);
	
	}

}