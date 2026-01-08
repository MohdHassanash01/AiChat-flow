
import {  createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");

    const Backend_Url = import.meta.env.VITE_BACKEND_URL;



   async function fetchChats(){
     try {
    setLoading(true)
    const res = await fetch(`${Backend_Url}/api/chat/chats`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("chats:", data);

   setChats(data.chats || [])

  } catch (err) {
    console.error(err);
    
    const message = "Failed to load chat history";
    setError(message);
    toast.error(message);

  }finally{
      setLoading(false);    
  }
   }



    async function DeleteAllChats(){
    try {
    setLoading(true)
    const res = await fetch(`${Backend_Url}/api/chat/allChat`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    setChats([])
    toast.success(data.message)

  } catch (err) {
    console.error(err);
    toast.error("Failed to delete chat history")
  }finally{
      setLoading(false);    
  }
   }
   

    async function DeleteChatbyId(id){
    try {
    setLoading(true)
    const res = await fetch(`${Backend_Url}/api/chat/chat/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    
    console.log(data);
    
    if(data){
    setChats((prev) => prev.filter((c) => c._id !== id));
      toast.success(data.message)
      
    }

  } catch (err) {
    console.error(err);
    setError("Failed to delete chat history")
  }finally{
      setLoading(false);    
  }
   }


  function selectChat(chat) {
    setCurrentPrompt(chat.prompt);
    setCurrentResponse(chat.response);
  }

  
  function clearCurrentChat() {
    setCurrentPrompt("");
    setCurrentResponse("");
  }



  useEffect(() => {
      fetchChats()
      
},[])


console.log(chats);

    return (
    <ChatContext.Provider
      value={{
         chats,
        loading,
        error,
        fetchChats,
        DeleteAllChats,
        DeleteChatbyId,

        currentPrompt,
        currentResponse,

        setCurrentPrompt,
        setCurrentResponse,

        selectChat,
        clearCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );

}


export const useChat = () => useContext(ChatContext);