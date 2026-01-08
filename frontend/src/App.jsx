import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Panel, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Handle, Position } from '@xyflow/react';

 
import "./App.css"
import ChatHistory from "./components/ChatHistory"
import { TypingLoader } from './components/TypingLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useChat } from './context/ChatContext';

function App() {

  const { 
    fetchChats,
    currentPrompt,
    currentResponse,
    clearCurrentChat
   } = useChat();

  const initialNodes = [
  { id: 'n1', 
    type: "inputNode",
    position: { x: 150, y: 200 }, 
     data: {
      value: '',
      onChange: () => {},
    }, },

   {
    id: "n2",
    type: "outputNode",
    position: { x: 550, y: 200 },
    data: { response: "",
    loading: false
     },
  },

];

const initialEdges = [
  { 
    id: 'n1-n2',
     source: 'n1',
      target: 'n2',
        markerEnd: {
      type: MarkerType.ArrowClosed,
    },
     style: {
      strokeWidth: 2,
    },

  }];

  const [variant, setVariant] = useState('dots');

  const [nodes, setNodes] = useState(initialNodes);

  const [edges, setEdges] = useState(initialEdges);

  const [loading, setLoading] = useState(false)
  
  const Backend_Url = import.meta.env.VITE_BACKEND_URL;


  const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,

};

const updateNodeValue = (id, value) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === id
        ? {
            ...node,
            data: {
              ...node.data,
              value,  // prompt will save here
            },
          }
        : node
    )
  );
};


const nodesWithHandlers = nodes.map((node) =>
  node.type === 'inputNode'
    ? {
        ...node,
        data: {
          ...node.data,
          onChange: (val) => updateNodeValue(node.id, val),
        },
      }
    : node
);



  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


  const runFlow = async () => {

    console.log(nodes);
  const inputNode = nodes.find((n) => n.id === "n1");
  const prompt = inputNode?.data?.value;

  if (!prompt) {
    toast.warning("Please enter a prompt");
    return;
  }


    // LOADING 
  setNodes((nds) =>
    nds.map((node) =>
      node.id === "n2"
        ? {
            ...node,
            data: {
              ...node.data,
              loading: true,
              response: "",
            },
          }
        : node
    )
  );



  try {

    setLoading(true)
    const res = await fetch(`${Backend_Url}/api/ask-ai/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    setNodes((nds) =>
      nds.map((node) =>
        node.id === "n2"
          ? {
              ...node,
              data: {
                ...node.data,
                 loading: false,
                response: data.answer, 
              },
            }
          : node
      )
    );
  } catch (err) {
    console.error(err);
  }finally{
    setLoading(false)
  }
};


const saveChat = async () => {
  const inputNode = nodes.find((n) => n.id === "n1");
  const outputNode = nodes.find((n) => n.id === "n2");

  const prompt = inputNode?.data?.value;
  const response = outputNode?.data?.response;

  if (!prompt || !response) {
    toast.warning("Run the flow before saving");
    return;
  }

  try {
    const res = await fetch(`${Backend_Url}/api/chat/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, response }),
    });

    const data = await res.json();
    console.log("SAVED:", data);
    fetchChats()
    toast.success("Chat saved successfully ✅");
  } catch (err) {
    console.error(err);
    alert("Failed to save chat");
  }
};



const clearFlow = () => {

  clearCurrentChat()
  setNodes((nds) =>
    nds.map((node) => {
      // INPUT NODE
      if (node.id === "n1") {
        return {
          ...node,
          data: {
            ...node.data,
            value: "", // 🔥 clear input
          },
        };
      }

      // AI RESPONSE NODE
      if (node.id === "n2") {
        return {
          ...node,
          data: {
            ...node.data,
            response: "", // 🔥 clear response
            loading: false,
          },
        };
      }

      return node;
    })
  );
};

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === "n1") {
        return {
          ...node,
          data: {
            ...node.data,
            value: currentPrompt || "",
          },
        };
      }

      if (node.id === "n2") {
        return {
          ...node,
          data: {
            ...node.data,
            response: currentResponse || "",
            loading: false,
          },
        };
      }

      return node;
    })
  );
}, [currentPrompt, currentResponse]);




 

  return (
    <>
    <div className="flex h-screen font-serif bg-[#f6f7f9]">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-76 border-r border-stone-300 p-4 overflow-y-auto bg-stone-200">
        <ChatHistory />
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex flex-1 flex-col">

        <div className="px-5 py-3 border-b border-neutral-400 flex gap-10  bg-stone-200 ">

          <button 
          disabled={loading}
          onClick={runFlow}
          className={`px-4 py-0.5 rounded-md border-none cursor-pointer
          ${loading 
      ? "bg-blue-300 cursor-not-allowed" 
      : "bg-blue-500 hover:bg-blue-600 text-white"}
  `}>
            {loading ? "Running..." : "Run Flow"}
          </button>

          <button
  disabled={loading}
  onClick={saveChat}
  className={`px-6 rounded-md
    ${loading ? "bg-stone-300 cursor-not-allowed" : "bg-stone-400 hover:bg-stone-500 text-white"}
  `}
>
  Save
</button>


      <button
  disabled={loading}
  onClick={clearFlow}
  className={`px-6 rounded-md
    ${loading ? "bg-stone-300 cursor-not-allowed" : "bg-stone-400 hover:bg-stone-500 text-white"}
  `}
>
  Clear
</button>


        </div>

        <div className="flex-1">
              <div className='w-full h-full'>
      <ReactFlow
       nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
         nodeTypes={nodeTypes}
        fitView
>

<Background
color="skyblue" 
variant={variant}
/>

{<Controls/>}
  <Panel>

      <div className='flex gap-5'>
        
          <button 
        className={`bg-stone-300 px-3 rounded-lg cursor-pointer ${variant == "dots"  ? "bg-stone-400 text-white":""}`}
        onClick={() => setVariant('dots')}>dots</button>

        <button
        className={`bg-stone-300 px-3 rounded-lg cursor-pointer ${variant == "lines"  ? "bg-stone-400 text-white":""}`}
        onClick={() => setVariant('lines')}>lines</button>

        <button 
        className={`bg-stone-300 px-3 rounded-lg cursor-pointer ${variant == "cross"  ? "bg-stone-400 text-white":""}`}
        onClick={() => setVariant('cross')}>cross</button>
        
        </div> 
      
      </Panel>

</ReactFlow>

    </div>
        </div>
      </main>

    </div>

 <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />

    </>
  )
}



function InputNode({ data }) {
  return (
    <div
      style={{
        width: 250,
        background: "#eef5ff",
        border: "2px solid #b7d4ff",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {/* Target Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#2563eb",
          width: 10,
          height: 10,
        }}
      />

      {/* Header */}
      <div
        style={{
          fontWeight: "600",
          fontSize: 14,
          marginBottom: 8,
          color: "#1e3a8a",
        }}
      >
        Input
      </div>

      {/* Textarea */}
      <textarea
        placeholder="What is the capital of France?"
        value={data.value}
        onChange={(e) => data.onChange(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          resize: "none",
          borderRadius: 6,
          border: "1px solid #c7d2fe",
          padding: 8,
          fontSize: 13,
          outline: "none",
          background: "#ffffff",
        }}
      />

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#000",
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}


function OutputNode({ data }) {
  return (
    <div className="w-[260px] rounded-xl border border-green-300 bg-green-50 shadow-md">

      {/* HEADER */}
      <div className="rounded-t-xl bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
        🤖 AI Response
      </div>

      {/* TARGET HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-green-500! w-3 h-3"
      />

      {/* BODY */}
      <div className="p-3 text-sm text-stone-700 min-h-[80px]">
        {data.loading ? (
          <TypingLoader />
        ) : (
          data.response || "Run the flow to see AI response..."
        )}
      </div>
    </div>
  );
}



export default App
