export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = useRuntimeConfig();

  const res = await $fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: {
      model: AI_MODEL,
      ...body,
    },
  });
  console.log(res);

  return res as { choices: { message: { content: string } }[] };
});
