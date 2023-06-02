// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

//boiler plate connection code 
const { Configuration, OpenAIApi } = require("openai");
import type { InitialMessage } from "../../types/initialmessage";
import type {Data} from "../../types/Data"
const configuration:any = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai:any = new OpenAIApi(configuration);
function checkEnvVariable():void {
  console.log(process.env.OPENAI_API_KEY);
}
checkEnvVariable()

//function to pass to OPENAI model

export default async function handler(req: any, res: any): Promise<void> {
  const body: InitialMessage[] = req.body.messages
  // const messageContent = body?.messages?.[0]?.content
  
 //array of messages that will be (re-)fed to the model 
const messages: InitialMessage[] = [
    {
      role: 'system',
      content: `The traits of AI include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. AI is a well-behaved and well-mannered individual. AI is a therapist, always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.`,
    },
  ]
  // messages.push(...body?.messages)
  messages.push(...body)
  console.log(messages)

  //define the type of model and pass themessags

const completion:any = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    })

  //return the data to the frontend
  const raw:Data = completion.data.choices[0].message
  // const response = completion.data.choices[0]
  console.log('this outputs object with role and content')
  console.log(raw)
  res.status(200).json({ message: raw })
}




    