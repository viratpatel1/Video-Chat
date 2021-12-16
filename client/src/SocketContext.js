import React, { createContext, useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";


// const url = "";
const Local = "http://localhost:4000";

const SocketContext = createContext();
const socket = io(Local);

const ContextProvider = ({ children }) =>
{

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() =>
    {
        //Permission to use the Audio and video
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) =>
            {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        socket.on("me", (id) => setMe(id));
        socket.on("calluser", ({ from, name: callerName, signal }) =>
        {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        })
    }, []);

    const answerCall = () =>
    {
        setCallAccepted(true)
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) =>
        {
            socket.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on("stream", (currentStream) =>
        {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const calluser = (id) =>
    {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) =>
        {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on("stream", (currentStream) =>
        {
            userVideo.current.srcObject = currentStream;
        });

        socket.on("callaccepted", (signal) =>
        {
            setCallAccepted(true);

            peer.signal(signal);
        });
        connectionRef.current = peer;
    }

    const leaveCall = () =>
    {
        setCallEnded(true);
        connectionRef.current.destroy();

        window.location.reload();
    }
    return (
        <SocketContext.Provider value={{
            call, callAccepted, userVideo, stream, name, myVideo, setName, me, calluser, leaveCall, answerCall, callEnded
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };
