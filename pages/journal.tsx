import { Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ContractInterface, ethers } from "ethers";
import React, { KeyboardEvent } from "react";
import { Box, Button, Container, Flex, Image } from "@chakra-ui/react";
import type { InitialMessage } from "../types/initialmessage";
import type { Options } from "../types/Options";
import type { Data } from "../types/Data";
//import abi json
export const initialMessages: InitialMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

export default function Home() {
  //////////////
  //OPEN AI/////
  //////////////

  const [data, setData] = useState<string>("How can i help?");
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<InitialMessage[]>(initialMessages);

  const sendMessage = async (message: string = "") => {
    console.log("function triggered");
    console.log(message);

    //function to send message to backend
    try {
      //we need send an array with objects containing the role and message
      //we need to add every old message so the model 'remembers' the conversation
      const newMessages: InitialMessage[] = [
        ...messages,
        { role: "user", content: message },
      ];
      setMessages(newMessages);
      const last10messages: InitialMessage[] = newMessages.slice(-10); // remember last 10 messages
      console.log(last10messages);

      //the api call
      const response: Response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: last10messages,
        }),
      });

      // const response = await fetch('/api/chat')
      const data: Data = await response.json();
      console.log("this is response.body");
      console.log(data);

      //add response from AI to array of messages
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message.content },
      ]);
      setData(data.message.content);

      //standard catch error
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred while sending the message. Please try again later."
      );
    }
  };

  //send the messages to backend to make the call when pressing enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      sendMessage(prompt);
      setPrompt("");
      //calling the function that sets the timer and handles the visibility of the mint button
      handleClick();
    }
  };

  /////////////////
  //NOTION PART////
  /////////////////
  //refactor later
  //body is send as string to backend to be handled
  //as soon as body is received by backend, the backend parses the data back into original format
  //messages is passed here to body and messages has type Initialmessage []
  const options: Options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    },
    body: JSON.stringify({ messages }),
  };
  const createPage = async () => {
    //goes to folder
    const response: Response = await fetch("/api/notion", options);
    console.log(response);
  };

  ///////////////
  ///TIMER///////
  ///////////////

  const [timer, setTimer] = useState<NodeJS.Timer>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(1 * 60);

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      setTimer(null);
      handleTimeout();
    }
  }, [timeRemaining, timer]);

  const handleTimeout = () => {
    setShowButton(true);
    setTimeRemaining(1 * 60);
  };

  const formatTime = (time: number) => {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };
  //the function that sets the timer and handles the visibility of the mint button

  const handleClick = () => {
    if (!timer) {
      setShowButton(false);
      setTimer(
        setInterval(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000)
      );
    }
  };
  handleClick();

  ////////////////////////
  ///CONNECT & MINT///////
  ///////////////////////
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [address, setAddress] = useState<string>(null);

  async function connectWallet() {
    if ((window as any).ethereum) {
      try {
        const provider: ethers.providers.Web3Provider =
          new ethers.providers.Web3Provider((window as any).ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address: string = await signer.getAddress();
        setAddress(address);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Ethereum wallet is not available");
    }
  }
  const ERC20_ADDRESS: string = "0x55011d0B0935b411EDf87D72cD49A5bCCe27a959";
  //refactor import at the top
  const ERC20_ABI: ContractInterface = require("./abi.json");
  async function mintTokens(): Promise<void> {
    if (provider) {
      const signer: ethers.providers.JsonRpcSigner = provider.getSigner();
      const contract: ethers.Contract = new ethers.Contract(
        ERC20_ADDRESS,
        ERC20_ABI,
        signer
      );
      const mintTransaction: any = await contract.mint(address, 1000);
      await mintTransaction.wait();
      console.log(`Minted 1000 tokens to ${address}`);
    } else {
      console.log("Wallet not connected");
    }
  }

  return (
    <>
      {/* header */}
      <Container maxW="container.xl">
        <Flex alignItems="center" justifyContent="space-between" py={4}>
          {/* logo  */}
          <Link href="/">
            <Box>
              <Image src="/scroll.png" alt="Robot Logo" h="30px" />
            </Box>
          </Link>

          {/* mint button */}
          <Box>
            {showButton ? (
              <Button onClick={mintTokens}>Mint</Button>
            ) : (
              <p>Time remaining: {formatTime(timeRemaining)}</p>
            )}
          </Box>

          {/* connect wallet button      */}
          <Box>
            <Button
              onClick={connectWallet}
              bg="transparent"
              borderColor="white"
              borderWidth="2px"
              color="black"
            >
              {address ? (
                <>
                  {address.slice(0, 4)}...
                  {address.slice(38, 42)}
                </>
              ) : (
                <>Connect Wallet</>
              )}
            </Button>
          </Box>
        </Flex>
      </Container>

      {/* main body start */}

      <Flex
        mx={"auto"}
        height={"100vh"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          maxWidth={"768px"}
          width={"100%"}
          color="black"
          borderColor="black"
        >
          show all the data
          {messages.map((item, index) => (
            <div key={`${item.role}-${index}`}>
              <p>
                {item.role}: {item.content}
              </p>
            </div>
          ))}
          <p>{data}</p>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text here"
            size="lg"
            mr={2}
            maxW="768px"
          />
        </Box>
        <Flex justifyContent={"center"} mt={4}>
          <Button mr={4} colorScheme="blue" type="submit">
            Send
          </Button>
          <Box color="black">
            <Button colorScheme="blue" type="submit" onClick={createPage}>
              Record in Notion
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
