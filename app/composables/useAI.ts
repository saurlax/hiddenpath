interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  hidden?: boolean;
}

export function useAI() {
  const messages = ref<Message[]>([
    {
      role: "system",
      content:
        "你是一个中式园林设计导师，用简洁的中文给出可执行的设计建议和理由。请以JSON格式回复，包含 message 字段（你的回复内容），如有需要修改地图请额外返回 change 字段，格式为 {'x.y':'id'}，如无修改则不返回 change。",
      hidden: true,
    },
    { role: "assistant", content: "你好！请告诉我你的设计需求吧。" },
  ]);

  const isLoading = ref(false);

  /**
   * @param message 用户输入
   * @param map 可选，当前地图二维数组（id[][]）
   * @returns {Promise<Record<string, string>|undefined>} AI 返回的 change
   */
  async function ask(
    message: string,
    map?: string[][]
  ): Promise<Record<string, string> | undefined> {
    if (!message.trim() || isLoading.value) return;

    let sendContent = message;
    if (map) {
      sendContent =
        `当前地图大小为${map[0]?.length || 0}x${
          map.length || 0
        }，内容如下：\n` +
        map.map((row) => row.join(",")).join("\n") +
        `\n用户需求：${message}\n`;
    }

    messages.value.push({
      role: "user",
      content: message,
    });

    isLoading.value = true;

    try {
      const data = await $fetch("/api/completions", {
        method: "POST",
        body: {
          messages: messages.value.concat({
            role: "user",
            content: sendContent,
          }),
        },
      });

      const text = data?.choices?.[0]?.message?.content || "";
      let aiMsg = text;
      let change: Record<string, string> | undefined = undefined;
      try {
        const json = JSON.parse(text);
        aiMsg = json.message || text;
        if (json.change && typeof json.change === "object") {
          change = json.change;
        }
      } catch (e) {}

      messages.value.push({
        role: "assistant",
        content: aiMsg,
      });
      return change;
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
