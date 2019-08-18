import React, { Component } from 'react';
import GIPHYForm from './GIPHYForm';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { TextField } from '@material-ui/core';
import SpotifyForm from './SpotifyForm';
import placeholder from '../static/img/track-dummy.jpg'
export default class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isTyping: false, 
            showGIPHY: false, 
            showSpotify : false
        }
    }

    componentWillUnmount() {
        this.startCheckingTyping();
    }

    /**
     * Only submit the message, if message has at least one character!
     */
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.message.length > 0) {
            this.sendMessage();
            this.setState( { message: '' });
        }
    }

    /**
     * Helper functions, send messages to socket!
     */
    sendGIF = (gif) => {
        this.props.sendMessage(gif);
    }
    sendSpotify = (item) => {
        this.props.sendMessage(item);
    }
    sendMessage = () => {
        this.props.sendMessage(this.state.message);
    }

    /**
     * Notifies the socket, that the current user is typing
     */
    sendTyping = () => {
        this.lastUpdateTime = Date.now();
        if (!this.state.isTyping) {
            this.setState({isTyping: true});
            this.props.sendTyping(true);
            this.startCheckingTyping();
        }
    }

    /**
     * Start checking who is typing
     */
    startCheckingTyping = () => {
        this.typingInterval = setInterval(() => {
            if ((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({isTyping: false});
                this.stopCheckingTyping();
            }
        }, 300 )
    }

    /**
     * Stop checking who is typing!
     */
    stopCheckingTyping = () => {
        if(this.typingInterval) {
            clearInterval(this.typingInterval);
            this.props.sendTyping(false);
        }
    }

    /**
     * Shows or hides the GIPHY panel
     */
    toggleGIPHY = () => {
        !this.state.showGIPHY ? this.setState({ showGIPHY: true }) : this.setState({ showGIPHY: false })
    }

    /**
     * Shows or hides the spotify panel
     */
    toggleSpotify = () => {
        !this.state.showSpotify ? this.setState({ showSpotify: true }) : this.setState({ showSpotify: false })
    }

    closeGIPHY = () => {
        this.setState({ showGIPHY: false })
    }

    /**
     * Handles the sending the panel based on using the GIPHY form!
     */
    handleShowGIF = (gif) => {
        const gifURL = gif.images.original.url;
            const sendedGif = `gif::${gifURL}`
        if (gifURL) {
            this.setState( {showGIPHY: false } )
            this.sendGIF(sendedGif);
        }
    }

    /**
     * Handles the submit of sending either an artist or a track.
     */
    handleShowSpotify = (item) => {
        this.setState( {showSpotify: false } )
        console.log(item);

        let string = '', url = ''

        if(item.type === 'track') { //if track
            if (item.album.images.length === 3) 
                url = item.album.images[1].url
            else   
                url = placeholder

            string = `spotify:?name=${item.name}&imgURL=${url}&openURL=${item.external_urls.spotify}`;
        } else { // if artist
            if (item.images.length === 3) 
                url = item.images[1].url
            else   
                url = placeholder
            string = `spotify:?name=${item.name}&imgURL=${url}&openURL=${item.external_urls.spotify}`;
        }
            
        
        /* const name = string.substring(string.indexOf('?name=')+6, string.indexOf('&imgURL=')),
            imgURL = string.substring(string.indexOf('&imgURL=')+8, string.indexOf('&openURL=')),
            openURL = string.substring(string.indexOf('&openURL=')+9, string.length);

        console.log(string)
        console.log(name)
        console.log(imgURL)
        console.log(openURL)
        */

        this.sendSpotify(string);
    }

    render() {
        const { message } = this.state;
        const GIPHYPanel = this.state.showGIPHY ? <GIPHYForm className="giphy-form" onClick={this.handleShowGIF} 
            closeGiphy={this.closeGIPHY} /> : '',
            togglerSpotify = this.props.spotifyIsVerified ? <Fab color="primary" 
                aria-label="add" onClick={this.toggleSpotify} className="giphy-button">
            <Icon>
                send
            </Icon>
            </Fab> : '',
            spotifyPanel = this.state.showSpotify ? <SpotifyForm handleShowSpotify={this.handleShowSpotify}/> : '';
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
                         placeholder="Start typing something"
                         onKeyUp={ e => {e.keyCode !== 13 &&  this.sendTyping()} }
                         onChange={
                             ({target}) => {
                                 this.setState( {message: target.value} );
                             }
                        }   
                    ></TextField>
                    {GIPHYPanel}
                    {spotifyPanel}
                    {togglerSpotify}
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