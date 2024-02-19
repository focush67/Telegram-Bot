import { Telegraf } from "telegraf";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();
const token = process.env.BOT_TOKEN || "";
const api = process.env.FAKE_STORE_API || "";

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply("Welcome to my chat bot!"));

/* Help commands */

bot.help((ctx) => {
  const welcomeMessage = `
 Welcome to my Telegram Bot 
 I'm here to assist you with various tasks Here are some available commands:

 /start - Start the bot
 /help - Display help information
 /sayhello - Say Hello
 /products - List the products
 /category <category_name> - List products in a specific category
 `;

  ctx.reply(welcomeMessage);
});

bot.command("sayhello", (ctx) =>
  ctx.reply("Hello there , the sayhello command was triggerd")
);

bot.command("products", async (ctx) => {
  try {
    const response = await axios.get(`${api}/products`);
    const products = await response.data;

    const randomProducts: any[] = [];
    while (randomProducts.length < 4) {
      const rIndex = Math.floor(Math.random() * products.length);
      if (!randomProducts.includes(rIndex)) {
        randomProducts.push(rIndex);
      }
    }

    for (const i of randomProducts) {
      let message = ``;
      message += `Title: *${products[i].title}*\n`;
      message += `Price: *${products[i].price}*\n`;
      message += `Category: *${products[i].category}*\n`;

      await ctx.replyWithPhoto(products[i].image, {
        caption: message,
        parse_mode: "Markdown",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    ctx.reply(
      "An error occured while fetching the products, check logs or try again later"
    );
  }
});

bot.command("category", async (ctx) => {
  const categoryName = ctx.message.text.split(" ")[1];
  if (!categoryName) {
    ctx.reply("Please specify the category, like /category electronics");
    return;
  }

  try {
    const response = await axios.get(
      `${api}/products/category/${categoryName}`
    );
    const products = await response.data;
    const productNames = products
      .map((product: any) => product.title)
      .join("\n");
    ctx.reply(
      `Here are the products for ${categoryName} category:\n\n${productNames}`
    );
  } catch (error) {
    console.log(`Error fetching products for ${categoryName}`);
    ctx.reply(
      `An error occured while fetching the products for ${categoryName}`
    );
  }
});

bot
  .launch()
  .then(() => {
    console.log("Bot launched");
  })
  .catch(() => {
    console.log("Some error in bot launching");
  });
