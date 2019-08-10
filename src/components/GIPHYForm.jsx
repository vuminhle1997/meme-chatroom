import React from 'react';
import Paper from '@material-ui/core/Paper';
import { TextField, Tabs, Tab, AppBar, Icon, Fab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
require('dotenv').config()


const axios = require('axios');
const trendingURL = 'http://api.giphy.com/v1/gifs/trending?'+'&api_key=ZDhnVLDUdlwWGqLxfc9f2kEVe6syMQNl'
class GIPHYForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchedGifs: [],
            isSet: false,
            gifURL: '',
            showGifOnPanel: false,
            value: 0
        }
        this.handleGiphy = this.handleGiphy.bind(this);
    }

    componentWillMount = () => {
        fetch(trendingURL)
                    .then(response => response.json())
                    .then((gifs) => {
                        this.setState({ searchedGifs: gifs.data });
                    });
        this.setState( { isSet: true })
    }

    handleGiphy(e) {
        const term = e.target.value;
        this.setState({
            searchTerm: term
        })        
        this.showResult(term);
    }

    renderGifOnPanel(e) {
        this.setState({
            gifURL: e.images.original.url,
            showGifOnPanel: true
        })
    }

    handleChange = (event, newValue) => {
        console.log(newValue)
        this.setState({
            value: newValue
        })
        switch(newValue) {
            case 0:
                this.showTrending();
                return;
            case 1:
                this.setState( {searchTerm: 'lol'})
                break;
            case 2:
                this.setState( {searchTerm: 'cat'})
                break;
            case 3:
                this.setState( {searchTerm: 'k-pop'})
                break;
            case 4:
                this.setState( {searchTerm: 'blackpink'})
                break;
            case 5:
                this.setState( {searchTerm: 'love'})
                break;
            default:
                break;
        }

        setTimeout(() => {
            this.showResult(this.state.searchTerm)
        }, 500)
    }

    showResult(term) {
        setTimeout(() => {
            if (term.length > 2) {
                console.log(process.env.GIPHY_API_KEY)
                const API_KEY ='ZDhnVLDUdlwWGqLxfc9f2kEVe6syMQNl'
                let url = 'http://api.giphy.com/v1/gifs/search?q='+`${term}`+`&api_key=${API_KEY}`;
                /*axios.get('', {
                    params: {
                        api_key: 'ZDhnVLDUdlwWGqLxfc9f2kEVe6syMQNl',
                        q: this.state.searchTerm
                    }
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                })*/
                /* fetch(url)
                    .then(response => response.json())
                    .then((gifs) => {
                        this.setState({ searchedGifs: gifs.data });
                    });*/
                axios.get(url)
                    .then(response => this.setState( {searchedGifs: response.data.data }))
                this.setState( { isSet: true });
            } else {
                this.showTrending();
            }
        }, 500);
    }

    showTrending() {
        fetch(trendingURL)
                    .then(response => response.json())
                    .then((gifs) => {
                        this.setState({ searchedGifs: gifs.data });
                    });
        this.setState( { isSet: true })
    }

    render() {
        let check =  this.state.searchedGifs;
        var result = [];
        Object.keys(check).map(function(key) {
            result.push(check[key]);
        });
        return (
        <div className="giphys-container"> 
            <div>
                
            </div>
            <Tabs value={this.state.value} className="giphy-tabs" color="primary" onChange={this.handleChange} variant="scrollable"  scrollButtons="on" indicatorColor="primary">
                <Tab label="Trending"></Tab>
                <Tab label="LOL"></Tab>
                <Tab label="CAT"></Tab>
                <Tab label="K-POP"></Tab>
                <Tab label="BLACKPINK ❤️"></Tab>
                <Tab label="LOVE"></Tab>
            </Tabs>
            <div className="giphy-inputs">
                <TextField fullWidth variant="outlined" margin="dense" className="gif-input" onChange={this.handleGiphy} placeholder="Looking GIFs on GIPHY?"></TextField> 
                <Fab color="primary"  className="close-giphy" onClick={this.props.closeGiphy}>
                    <Icon>
                        close
                    </Icon>
                </Fab>
            </div>
            
            <Paper className="gifs-list">
                <div className="flex-container">
                {
                    result.map((ele, index) => {
                        return <div key={index} className="gif-container" onClick={() => this.props.onClick(ele)}>
                            <img src={ele.images.fixed_width_small.url} alt={ele.slug} />
                        </div>
                    })
                }
                </div>
            </Paper>
        </div>)
    }
}

export default GIPHYForm;
