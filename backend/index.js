import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import dotenv from "dotenv";
import router from  "./route.js";
dotenv.config();


const env = process.env;
const app = express();


const bot = new TelegramBot(env.TELEGRAM_KEY, {polling: true})
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";
const token = env.OPENAI_KEY
const prisma = new PrismaClient();

bot.on('message', async(msg) =>{
    const chatId = msg.chat.id;
    const messageText = msg.text;
    
    switch(messageText){
            case '/start':
            bot.sendMessage(chatId, 'Test')
            break;

            case '/activity': 
            bot.sendMessage(chatId, 'Test');
            break;

            case '/dice':
                const dice = Math.floor(Math.random() * 6) + 1;
                bot.sendMessage(chatId, `Dice: ${dice}`);
                break;
            }
            
            if(messageText.includes('Hello Bot')){
                const client = new OpenAI({ baseURL: endpoint, apiKey: token });
                
                const response = await client.chat.completions.create({
                    messages: [
                        { role:"system", content: "You are a creator of query sql make me just query without anything" },
                        { role:"user", content: messageText }
                    ],
                    temperature: 1.0,
                    top_p: 1.0,
                    max_tokens: 1000,
                    model: modelName
                });
                bot.sendMessage(chatId, response.choices[0].message.content);
            }
        })
        
    app.use('/', router);
app.listen(3000, () =>{
    console.log('Server Runing on port 3000');  
})