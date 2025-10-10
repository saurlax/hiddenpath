import { ref } from "vue";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export function useAI() {
  const messages = ref<Message[]>([
    {
      role: "system",
      content:
        "你是一个中式园林设计导师，用简洁的中文给出可执行的设计建议和理由。",
    },
  ]);

  const isLoading = ref(false);

  async function ask(userMessage: string) {
    if (!userMessage.trim() || isLoading.value) return;

    // 添加用户消息
    messages.value.push({
      role: "user",
      content: userMessage,
    });

    isLoading.value = true;

    try {
      const data = await $fetch("/api/completions", {
        method: "POST",
        body: { messages: messages.value },
      });

      const text = data?.choices?.[0]?.message?.content || "";

      messages.value.push({
        role: "assistant",
        content: text,
      });
    } catch (error) {
      console.error("AI 调用失败:", error);
      messages.value.push({
        role: "assistant",
        content: "抱歉，AI 服务暂时不可用。",
      });
    } finally {
      isLoading.value = false;
    }
  }

  function clearHistory() {
    const systemMsg = messages.value[0];
    messages.value = systemMsg ? [systemMsg] : [];
  }

  return {
    messages,
    isLoading,
    ask,
    clearHistory,
  };
}
