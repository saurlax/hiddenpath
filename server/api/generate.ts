export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = useRuntimeConfig();

  return (await $fetch(`${AI_BASE_URL}/v1/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: {
      model: AI_MODEL,
      ...body,
    },
  })) as { choices: { message: { content: string } }[] };
});
