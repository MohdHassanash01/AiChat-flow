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


  return (
   <div className="flex flex-col h-full">

      <div className="sticky top-0 bg-stone-200 z-10 pb-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent border-b border-stone-400 pb-1">
          Future Blick
        </h3>

        {chats.length > 0 && (
          <button
            onClick={DeleteAllChats}
            className="my-3 bg-stone-300 hover:bg-stone-400 w-full rounded flex justify-between items-center px-2 py-1 text-[#6b7280] hover:text-white"
          >
            <span>Clear History</span>
            <Trash size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto history-panel pr-1">
        {loading && <p className="text-gray-500">Loading chats...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {!loading && chats.length === 0 && (
          <p className="text-stone-500 font-semibold mt-3">
            No chat history yet
          </p>
        )}

        {chats.map((item) => (
          <div key={item._id} className="history-card">
            <div
              className="cursor-pointer"
              onClick={() => selectChat(item)}
            >
              <p className="text-sm font-semibold truncate-1">{item.prompt}</p>
              <p className="text-sm text-gray-700 truncate-2">{item.response}</p>
            </div>

            <small className="text-gray-400 flex justify-between">
              <span>{new Date(item.updatedAt).toLocaleString()}</span>
              
              <span
                onClick={() => DeleteChatbyId(item._id)}
                className="px-3 py-1 bg-stone-300 rounded cursor-pointer hover:bg-stone-400"
              >
                <Trash className='text-black' size={14} />
              </span>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
