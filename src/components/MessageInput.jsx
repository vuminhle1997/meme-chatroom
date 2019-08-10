import React, { Component } from 'react';
import GIPHYForm from './GIPHYForm';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { TextField } from '@material-ui/core';
export default class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isTyping: false, 
            showGIPHY: false
        }
    }

    componentWillUnmount() {
        this.startCheckingTyping();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.message.length > 0) {
            this.sendMessage();
            this.setState( { message: '' });
        }
    }

    sendGIF = (gif) => {
        this.props.sendMessage(gif);
    }
    sendMessage = () => {
        this.props.sendMessage(this.state.message);
    }

    sendTyping = () => {
        this.lastUpdateTime = Date.now();
        if (!this.state.isTyping) {
            this.setState({isTyping: true});
            this.props.sendTyping(true);
            this.startCheckingTyping();
        }
    }

    startCheckingTyping = () => {
        this.typingInterval = setInterval(() => {
            if ((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({isTyping: false});
                this.stopCheckingTyping();
            }
        }, 300 )
    }

    stopCheckingTyping = () => {
        if(this.typingInterval) {
            clearInterval(this.typingInterval);
            this.props.sendTyping(false);
        }
    }

    toggleGIPHY = () => {
        !this.state.showGIPHY ? this.setState({ showGIPHY: true }) : this.setState({ showGIPHY: false })
    }

    closeGIPHY = () => {
        this.setState({ showGIPHY: false })
    }

    handleShowGIF = (gif) => {
        const gifURL = gif.images.original.url;
            const sendedGif = `gif::${gifURL}`
        if (gifURL) {
            this.setState( {showGIPHY: false } )
            this.sendGIF(sendedGif);
        }
    }

    render() {
        const { message } = this.state;
        const GIPHYPanel = this.state.showGIPHY ? <GIPHYForm className="giphy-form" onClick={this.handleShowGIF} 
            closeGiphy={this.closeGIPHY} /> : '';
        return (
            <div className="message-input">
                <form 
                    onSubmit={this.handleSubmit}
                    className="message-form"
                >
                    <TextField 
                         id="message"
                         ref={"messageinput"}
                         type="text"
                         className="form-control"
                         value = { message } 
                         autoComplete={'off'}
                         placeholder="Hi Clark"
                         onKeyUp={ e => {e.keyCode !== 13 &&  this.sendTyping()} }
                         onChange={
                             ({target}) => {
                                 this.setState( {message: target.value} );
                             }
                        }   
                    ></TextField>
                    {GIPHYPanel}
                    <Fab color="primary" aria-label="add" onClick={this.toggleGIPHY} className="giphy-button">
                        <Icon>
                            gif
                        </Icon>
                    </Fab>
                    <button
                        disabled={ message.length < 1 }
                        type="submit"
                        className="send"
                    >Send</button>
                </form>

            </div>
        )
    }
}