import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'

export default class LoginForm extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	nickname:"",
	  	error:""
	  };
	}
	componentDidMount = () => {
		const { socket } = this.props
		setTimeout(() => {
			const name = sessionStorage.getItem('name');
			if (name) socket.emit(VERIFY_USER, name, this.setUser)
		}, 50)
	}
	setUser = ({user, isUser})=>{
		if(isUser){
            console.log ("Server already has this user!")
			this.setError("User name taken")
		}else{
			console.log ("Server created user: ")
			console.log(user)
			this.setError("")
			this.props.setUser(user)
		}
	}

	handleSubmit = (e)=>{
		e.preventDefault()
		const { socket } = this.props
		const { nickname } = this.state
		console.log("NOW VERIFYING")
		sessionStorage.setItem('name', nickname);
		socket.emit(VERIFY_USER, nickname, this.setUser)
	}

	handleChange = (e)=>{
		this.setState({nickname:e.target.value})
	}

	setError = (error)=>{
		this.setState({error})
	}

	render() {	
		const { nickname, error } = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form" >

					<label htmlFor="nickname">
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input)=>{ this.textInput = input }} 
						type="text"
						id="nickname"
						value={nickname}
						onChange={this.handleChange}
						placeholder={'MYCoolUSername'}
						/>
						<div className="error">{error ? error:null}</div>

				</form>
			</div>
		);
	}
}