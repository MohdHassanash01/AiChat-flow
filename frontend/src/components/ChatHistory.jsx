import { Trash } from 'lucide-react';

import { useChat } from "../context/ChatContext";

// example chats
// const chats = [
//   {
//     question: "What is the capital of France?",
//     answer: "Paris is the capital of France.",
//     time: "2 mins ago",
//   },
//   {
//     question: "How far is the Moon from Earth?",
//     answer: "About 384,400 km.",
//     time: "5 mins ago",
//   },

// ];




export default function ChatHistory() {

const {
    chats,
    loading,
    error,
    DeleteAllChats,
    DeleteChatbyId,
    selectChat, 
  } = useChat();


 // Convert date to "time ago"
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} mins ago`;
    return `${hours} hrs ago`;
  }


  return (
    <>
       <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent border-b border-stone-400 pb-1">Future Blick</h3>

     {chats.length > 0 &&  (<button
     onClick={() => DeleteAllChats()}
     className="border-none text-[#6b7280] cursor-pointer my-3 bg-stone-300 hover:bg-stone-400 w-full rounded hover:text-white hover:transition-all flex justify-between items-center px-2 py-1">
        <span>Clear History</span>
        <Trash size={16}/>
      </button>  )}

       {/* Loading */}
      {loading && <p className="text-gray-500">Loading chats...</p>}

       {/* Error */}
      {error && <p className="text-red-500
      font-semibold mt-3">{error}</p>}

       {/* Empty State */}
      {!loading && chats.length === 0 && (
        <p className="text-stone-500 font-semibold mt-3">No chat history yet</p>
      )}

        {/* Chats */}
      {chats.map((item) => (
        <div
         
          className="history-card bg-white p-2 rounded shadow mb-2 "
        >

          <div
          className='cursor-pointer'
          onClick={() => selectChat(item)}
          key={item._id}>

          <p className="block text-sm font-semibold truncate-1">{item.prompt}</p>

          <p className="text-sm text-gray-700 truncate-2">{item.response}</p>

        </div>

          <small className="text-gray-400 flex justify-between">
            <span>
              {timeAgo(item.updatedAt)}
            </span>

            <span 
            onClick={() => {
              DeleteChatbyId(item._id)
              
            }}
            className='px-4 py-1   rounded-lg bg-stone-300 cursor-pointer hover:bg-stone-400'>
              <Trash className='text-black' size={16}/>
            </span>
          </small>
        </div>
      ))}
    </>
  );
}
