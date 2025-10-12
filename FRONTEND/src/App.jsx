
import './App.css'
import Sidebar from "./Sidebar"
import ChatWindow from './ChatWindow'

import {MyContext} from "./MyContext"
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);     // an array that contains all chats of the current threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);  //store {threadId and title}
  const [showSidebar, setShowSidebar] = useState(false);
   

  const providerValues = {
    prompt, setPrompt,
    reply,setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    showSidebar, setShowSidebar
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
