/*
 Importing all the dependencies for the component
 */
import React, { useRef, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import { animateScroll } from "react-scroll";

/*importing the css files */
import './css/chat.css';
import './css/chat-2.css';


class Chat extends React.Component{

     #socket; // private socket object of socket.io
     #ENDPOINT ='https://chatifie-server.herokuapp.com/'; // connect to the node server
    
    constructor(props){
        super(props);
        this.state = {name:'',usersOnline:[] , message:'' , received:[] } //state of the component
        
        /* binding all the events */
        this.sendMessage = this.sendMessage.bind(this);
        this.updateName = this.updateName.bind(this);
    }

    render(){ 

        /*conditional rendering */
        let component = this.state.name==='' 
                                    ?  
                                        /* render the following if name is not entered */
                                        <div className='container'>
                                            <div className='background'></div>
                                            <div className='name'>
                                                <div className='title'>Start chatting with the world</div>
                                                <div>
                                                    <label htmlFor='name'>Enter your name for chat</label>
                                                    <input type='text' id='name' ref='inputName'></input>
                                                </div>
                                                <button onClick={this.updateName}>Go</button>
                                            </div>
                                        </div>
                                        
                                   : 
                                        /* render the following if the name is entered */
                                        <div className='second-container'>
                                            <div className = 'users'>
                                                <div className='heading'>Online Users</div>
                                                <this.OnlineUsers users={this.state.usersOnline}/>
                                            </div>
                                            <div className='row-2'>
                                                <div className='userName'>Welcome {this.state.name}</div>
                                                <this.Messages messages={this.state.received}/>
                                                <div className = 'send-message'>
                                                    <textarea ref='message'></textarea>
                                                    <button onClick={this.sendMessage}>
                                                    <span className="material-icons">double_arrow</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div> 
        return component; // returning the component
    }

    componentDidMount(){
        this.#socket = socketIOClient(this.#ENDPOINT); // connecting to the endpoint

        /* on message received */
        this.#socket.on('received-message',(data)=>{
            let messages = this.state.received; // get all the received messages from the state of the component
            messages.push(data); // addding the newly received message details
           
            this.setState({ // updating the state of component to add new message
               received:messages
           });

        });    

        /* on user update info received */
        this.#socket.on('users',data=>{ // whenever server sends data related to new users
            this.setState({
                usersOnline:data // update the online users in the component state
            });
        })

    }


    sendMessage(){

        if(this.refs.message !== null){ // if reference is not null

            let message = this.refs.message.value; //  get the message from the text area
            
            if(message === ''){ // validating the message
                alert('Message cannot be empty');
                return;
            }

            let name = this.state.name; // get name of user from the state of the component

            let payload = {user:name , message:message} // making payload to be sent 
            this.#socket.emit('message',payload); // emitting the event and sending the message

            this.refs.message.value =''; // empty the text area
        }        
    }

    updateName(){ 
        if(this.refs.inputName !== null){ // if the reference is not null 

            let name = this.refs.inputName.value; //get name from the input box

            if(name!==''){  
                this.#socket.emit('newUser',name); // register the name to the server
            }else{
                alert('Please enter a name'); // validation
            }

            this.setState({ // setting name of the user in the component's state
                name:name
            });
        }
    }

    Messages(props){ 
        let messages = props.messages; // get all the messages from the props

        useEffect(()=>{ // when component updates
            animateScroll.scrollToBottom({
                containerId: 'scroll' // scroll to the bottom
              });
        });

        let component = <div className='messages-wrapper' id='scroll'> {/*contains the component to be sent */}
            {
                messages.map(
                    (data,index)=>
                        <div className='message-box' key={index}>
                            <div className='sender'>{data.user}</div>
                            <div className='message'>{data.message}</div>
                        </div>
                )
            }
        </div>
        return component;

        
    }

    OnlineUsers(props){
        let users = props.users; // getting all the online users from the props
        let component = <ul>
            {
                users.map((name,index)=>
                    <li key={index}>{name}</li>
                )
            }
        </ul>
        return component;
    }
}

export default Chat; // export the component