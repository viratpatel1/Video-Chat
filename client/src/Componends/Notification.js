import React, { useContext } from 'react';
import { Button } from "@material-ui/core";
import { SocketContext } from '../SocketContext';

const Notification = () =>
{
    const { call, answerCall, callAccepted } = useContext(SocketContext);
    return (
        <div>
            {call.isReceivedCall && !callAccepted && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>{call.name} is calling: </h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>Accept</Button>
                </div>
            )}
        </div>
    )
}

export default Notification
