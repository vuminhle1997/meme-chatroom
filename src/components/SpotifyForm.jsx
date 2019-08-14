import React from 'react';
import { Paper, Slide, Fab, Button, TextField, InputAdornment, Icon } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

export default class SpotifyForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            spotifyIsVerified: false,
            ACCESS_TOKEN: '',
            data: [],
            showSpotifyTracks: false,
            searchTerm: ''
        }
    }
    componentDidMount = () => {
        setTimeout(() => {
            var url = new URL(window.location.href);
            var ACCESS_TOKEN = url.searchParams.get('code');
            console.log(ACCESS_TOKEN);
            if (ACCESS_TOKEN) this.setState({ACCESS_TOKEN: ACCESS_TOKEN, spotifyIsVerified: true})
        }, 100)
    }

    componentDidUpdate = () => {
        
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
    showList = () => {
        if (this.state.ACCESS_TOKEN) {
            const BEARER = 'Bearer ' + this.state.ACCESS_TOKEN;
            const TERM = this.state.searchTerm
            fetch(`https://api.spotify.com/v1/search?q=${TERM}&type=track%2Cartist`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': BEARER
                }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.setState({ data: data, showSpotifyTracks: true})
            })
        }
    }
    render(){
        const { data } = this.state;
        var showSpotifyTracks = this.state.showSpotifyTracks ? (
        <div>
            <h3>HI</h3>
            <div className="artists-div">
                {
                   /* Object.values(data.artists.items).map((item, index) => {
                        console.log(item, index);
                        return (
                            <div className="artist-div">
                                <img src={item.images[1].url} alt="an image" />
                                <h3>{item.name}</h3>
                                <h4>Currently following: {item.followers.total}</h4>
                                <Button color="primary">Check it out on Spotify!</Button>
                                <Button color="primary">Share it on Chat!</Button>
                            </div>
                        )
                    })*/
                }
            </div>
        
            <div className="tracks-div">
                {
                   /* Object.values(data.tracks.items).map((item, index) => {
                        console.log(item, index);
                        return (
                            <div className="track-div">
                                <img src={item.album.images[1].url} alt="search term"/>
                                <h3>{item.name}</h3>
                                <h4>{item.album.name}</h4>
                                <Button color="primary">Check it out!</Button>
                                <Button color="primary">Share it on chat!</Button>
                            </div>
                        )
                    })*/
                }
            </div>
        </div>) : '';

        var showSearchInput = this.state.spotifyIsVerified ? 
        <TextField InputProps={{
            endAdornment: (
            <InputAdornment>
                <IconButton>
                <SearchIcon />
                </IconButton>
            </InputAdornment>
            )
            }} 
            onChange={ (e) => {
                this.setState({ searchTerm: e.target.value })
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    console.log(e.target.value)
                    this.showList();
                }
            }}
        >
        </TextField> : 
        <Fab onClick={this.verifySpotify}>
          spotify
        </Fab>;

        return (
            <Slide in={true}>
                <Paper>
                
                <Fab onClick={this.showList}>
                    bp
                </Fab>
                {showSearchInput}
                {showSpotifyTracks}
                </Paper>
            </Slide>
            
        )
    }
}