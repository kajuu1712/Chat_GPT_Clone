import './sidebar.css';

import { MyContext } from './MyContext';
import { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


export default function Sidebar() {
    const { setNewChat, setPrompt, setPrevChats, setReply, setCurrThreadId, allThreads, setAllThreads, currThreadId,  showSidebar, setShowSidebar  } = useContext(MyContext);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setPrevChats([]);
        setCurrThreadId(uuidv4());  //assigning a new thread id for new chat
    };


    // Show Threads as list items in history 

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/thread");
            const res = await response.json();
            const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filterData);

        } catch (err) {
            console.log(err);
        }
    };

    // Go to the selected thread

    const changeThread = async (threadId) => {
        setCurrThreadId(threadId);   //to save the new updations(prompts , replies) in current threadId
        try {
            const response = await fetch(`http://localhost:3000/api/thread/${threadId}`);
            const res = await response.json();
            setPrevChats(res.messages);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    // Delete Thread

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();

            //also remove from history's list
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    //sideBar
    const handleSideBar = () => {
        setShowSidebar(!showSidebar);
        console.log(showSidebar);
    }

    return (
        <>
            <span onClick={handleSideBar}><i className="fa-solid fa-list"></i></span>
           
            <section className={showSidebar? "displaySidebar": "sidebar"}>

                {/* New chat button */}

                <button onClick={createNewChat}>
                    <img className='logo' src="src/assets/blacklogo.png" alt="logo-image" />
                    <span><i className="fa-regular fa-pen-to-square"></i></span>
                </button>


                {/* History */}

                <ul className='history'>
                    {allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash-can" onClick={(e) => {
                                e.stopPropagation(); //stop event bubbling
                                deleteThread(thread.threadId)
                            }}>
                            </i>
                        </li>
                    ))}
                </ul>


                {/* Sign */}

                <div className="sign">
                    <p>Chat GPT Clone</p>
                </div>
            </section>
        </>
    );
}