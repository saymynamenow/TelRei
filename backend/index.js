import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
const app = express();
const apiKey = "7873641946:AAEuNJxexlhUzRtrWJqqcX4S8tyCiBryWdc"
const bot = new TelegramBot(apiKey, {polling: true})
const prisma = new PrismaClient();
const activeInterval = {};
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";
const token = "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";

bot.on('message', async(msg) =>{
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if(!activeInterval[chatId]){
        activeInterval[chatId] = setInterval(async() => {
            const date = new Date();
            console.log(`Current time: ${date.getHours()}:${date.getMinutes()}`);
            if(date.getHours() === 21 && date.getMinutes() === 51){
                bot.sendMessage(chatId, 'Good Night Fiqri');
                console.log('Good Night Fiqri');
            }
        }, 60000)
    }
    
    switch(messageText){
        case '/start':
            console.log(token)
            bot.sendMessage(chatId, 'Test')
            break;
            case '/activity': 
            const response = await prisma.activity.findMany();
            bot.sendMessage(chatId, 'Test');
            bot.sendMessage(chatId, response.map((activity) => activity.name).join('\n'));
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

    
    
    
    app.listen(3000, () =>{
        console.log('Server Runing on port 3000');  
    })