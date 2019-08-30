import React from 'react';
import { Paper, Slide, Fab, Button, TextField, InputAdornment, Icon, Container, Box } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import placeholder from '../static/img/track-dummy.jpg';

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

    /**
     * When successfully authenticated, get token for accessing to the SPOTIFY API by getting the url params
     */
    componentDidMount = () => {
        setTimeout(() => {
            var url = new URL(window.location.href);
            var ACCESS_TOKEN = url.searchParams.get('access_token');
            console.log(ACCESS_TOKEN);
            if (ACCESS_TOKEN) this.setState({ACCESS_TOKEN: ACCESS_TOKEN, spotifyIsVerified: true});
        }, 100)
    }

    /**
     * Shows the result, when succeeded!
     */
    showList = () => {
        const BEARER = 'Bearer ' + this.state.ACCESS_TOKEN,
                    TERM = this.state.searchTerm;
        if (this.state.ACCESS_TOKEN && TERM.length > 5) {
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

    /**
     * User can check the track/artist and gets redirected to the spotify page
     */
    checkItem = (item) => {
        window.open(item.external_urls.spotify, '_blank');
    }

    render(){
        const { data } = this.state;
        const { closeForm } = this.props;
        var showSpotifyTracks = this.state.showSpotifyTracks ? (
        <Box className="spotify-results-root">
            <h2>Artists</h2>
            <Paper className="artists-div">
                {
                   Object.values(data.artists.items).map((item, index) => {
                        const imgURL = () => {
                            if (item.images.length === 3) return item.images[1].url;
                            else return placeholder;
                        } 
                        return (
                            <Container className="artist-div">
                                <img src={imgURL()} alt={`an img ${index}`} />
                                <h3>{item.name}</h3>
                                <h4>Currently following: {item.followers.total}</h4>
                                <Button variant="outlined" color="primary" onClick={() => this.props.handleShowSpotify(item)}>
                                    <Icon>
                                        send
                                    </Icon>
                                    Send
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => this.checkItem(item)}>
                                    <Icon>
                                        link
                                    </Icon>
                                    Check
                                </Button>
                            </Container>
                        )
                    })
                }
            </Paper>
            <h2>Tracks</h2>   
            <Paper className="tracks-div">
                {
                   Object.values(data.tracks.items).map((item, index) => {
                        return (
                            <Container className="track-div">
                                <img src={item.album.images[1].url} alt={`searched term ${index}`}/>
                                <h3>{item.name}</h3>
                                <h4>{item.album.name}</h4>
                                <Button variant="outlined" color="primary" onClick={() => this.props.handleShowSpotify(item)}>
                                    <Icon>
                                        send
                                    </Icon>
                                    Send
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => this.checkItem(item)}>
                                    <Icon>
                                        link
                                    </Icon>
                                    Check
                                </Button>
                            </Container>
                        )
                    })
                }
            </Paper>
        </Box>) : '';

        var showSearchInput = this.state.spotifyIsVerified ? 
        <TextField 
            label="Search..."
            placeholder="BLΛƆKPIИK"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            InputProps={{
            endAdornment: (
            <InputAdornment>
                <IconButton onClick={() => this.showList()}>
                <SearchIcon />
                </IconButton>
            </InputAdornment>
            )
            }} 
            onChange={(e) => {
                this.setState({ searchTerm: e.target.value })
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    this.showList();
                }
            }}
        >
        </TextField> : 
        '';
        return (
            <Slide in={true} className="spotify-results">
                <Paper >
                <Fab className="close-spotify-button" onClick ={closeForm}>
                    <Icon>
                        close
                    </Icon>
                </Fab>
                    <Container>
                    {showSearchInput}
                    </Container>
                    <Container>
                    {showSpotifyTracks}
                    </Container>              
                </Paper>
            </Slide>
            
        )
    }
}