import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import dotenv from "dotenv";
dotenv.config();
const token = process.env.BOT_TOKEN || "";

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply("Welcome to my chat bot!"));

/* Help commands */

bot.help((ctx) => {
  const helpMessage = `
    Here are some available commands:
    /help : Display help information
    /sayhello :  Say hello
    `;
  ctx.reply(helpMessage);
});

bot.command("sayhello", (ctx) =>
  ctx.reply("Hello there , the sayhello command was triggerd")
);

bot
  .launch()
  .then(() => {
    console.log("Bot launched");
  })
  .catch(() => {
    console.log("Some error in bot launching");
  });
