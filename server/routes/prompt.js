import express from "express"
import axios from "axios"
import { cleanAIResponse } from "../utils/EnhanceAiResponce.js"

export const promptRouter = express.Router()

promptRouter.post("/prompt",async function(req,res){
   
   try {
    
    const {prompt} = req.body

    if (!prompt) {
        res.status(400).json({
            error:"Prompt is required"
        })
    }

      console.log("PROMPT RECEIVED:", prompt);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "mistralai/mistral-7b-instruct",
        messages: [

          {
            role: "user",
            content: prompt,
          },

        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.HTTP_REFERER_URL,
          "X-Title": "Future Blick",
        },
      }
    );

    // console.log(response);
    
     const aiResponce =
      response.data.choices[0].message.content;

      console.log("ai responce : ",aiResponce);
      
    const cleanText = cleanAIResponse(aiResponce);

    res.status(200).json({
      answer: cleanText,
    });

   } catch (error) {

    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed to respond" });
   }
}) 