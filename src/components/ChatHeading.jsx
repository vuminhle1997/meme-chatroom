import React from 'react';
import { Fab } from '@material-ui/core';

export default class ChatHeading extends React.Component{  
    render() {
        const { numberOfUsers, name } = this.props;
        return (
        <div className="chat-header">
            <div className="user-info">
                <div className="user-name">{name}</div>
                <div className="status">
                    <div className="indicator"></div>
                    <span>{numberOfUsers ? numberOfUsers: null}</span>
                </div>
            </div>
        </div>
        );
    }
}