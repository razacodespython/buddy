// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
function checkEnvVariable() {
  console.log(process.env.MY_VARIABLE);
}
checkEnvVariable()
export default async function handler(req, res) {
  const body = req.body.messages
  // const messageContent = body?.messages?.[0]?.content
  
const messages = [
    {
      role: 'system',
      content: `The traits of AI include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. AI is a well-behaved and well-mannered individual. AI is a therapist, always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.`,
    },
  ]
  // messages.push(...body?.messages)
  messages.push(...body)
  console.log(messages)

const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    })
  const raw = completion.data.choices[0].message
  const response = completion.data.choices[0]
  console.log('this outputs object with role and content')
  console.log(raw)
  res.status(200).json({ message: raw })
  // res.status(200).json({ name: 'John Doe' })
}




    