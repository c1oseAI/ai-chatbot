import { deepseek } from "@ai-sdk/deepseek";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": deepseek("deepseek-chat"),
        // 👇👇👇 新增这一行 👇👇👇
        "title-model": deepseek("deepseek-chat"),

        // 💡 建议：为了防止以后用到 artifact 功能报错，建议顺便把下面这行也加上
        "artifact-model": deepseek("deepseek-chat"),
        "chat-model-reasoning": wrapLanguageModel({
          model: deepseek("deepseek-reasoner"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      },
    });
