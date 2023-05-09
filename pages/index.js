import { Flex, Grid, GridItem, Box, Button, Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";


export const initialMessages = [
  {
    role: 'assistant',
    content: 'Hi! I am a friendly AI assistant. Ask me anything!',
  },
]


export default function Home() {
  const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3'
  const [data, setData] = useState('How can i help?')
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState(initialMessages)
  const [cookie, setCookie] = useCookies([COOKIE_NAME])

    useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  const sendMessage = async (message='') => {
    console.log('function triggered')
    console.log(message)

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content: message },
      ]
      setMessages(newMessages)
      const last10messages = newMessages.slice(-10) // remember last 10 messages
      console.log(last10messages)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: last10messages,
        }),
        
      })
      // const response = await fetch('/api/chat')
      const data = await response.json();
      console.log('this is response.body')
      console.log(data)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.message.content },
      ])
      setData(data.message.content)
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the message. Please try again later.');
    }}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      //handleSubmit(e as any);
      sendMessage(prompt);
      setPrompt('')
    }
  };


  return (
    <>
          <>
     <Grid
     templateRows="repeat(3,1fr)"
     templateColumns="repeat(1,1fr)"
    bg="linear-gradient(to bottom, #191970, #2e0854, #4b0082)"
     minHeight="100vh"
     >
     <GridItem colSpan={1}>

     <GridItem rowSpan={1}>
      <Flex>
        <Box color="white">
          <h1>Header</h1>
        </Box>
      </Flex>
      </GridItem>

     <GridItem rowSpan={1}>
      <Flex>
        <Box color="white">
        <p>
      {data}
    </p>
        {/* <form onSubmit={handleSubmit}>
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter text here"
        size="lg"
        mr={2}
      />
      <Button
        colorScheme="blue"
        type="submit"
      >
        Send
      </Button>
    </form>
          </Box>
          <Box color="white">
        <h1>
      {data}
    </h1> */}

      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter text here"
        size="lg"
        mr={2}
      />
      <Button
        colorScheme="blue"
        type="submit"
      >
        Send
      </Button>

          </Box>
          </Flex>
          </GridItem>
     <GridItem rowSpan={1}><Flex><Box color="white"><h1>footer</h1></Box></Flex></GridItem>
     </GridItem>
     </Grid>
    </>
    </>
  )
}
