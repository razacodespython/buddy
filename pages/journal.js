import { Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
} from "@chakra-ui/react";
//import abi json
export const initialMessages = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

export default function Home() {
  const [data, setData] = useState("How can i help?");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [timer, setTimer] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1*60);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);


  const sendMessage = async (message = "") => {
    console.log("function triggered");
    console.log(message);
    try {
      const newMessages = [...messages, { role: "user", content: message }];
      setMessages(newMessages);
      const last10messages = newMessages.slice(-10); // remember last 10 messages
      console.log(last10messages);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: last10messages,
        }),
      });
      // const response = await fetch('/api/chat')
      const data = await response.json();
      console.log("this is response.body");
      console.log(data);
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message.content },
      ]);
      setData(data.message.content);
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred while sending the message. Please try again later."
      );
    }
  };
  const options = {
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
    const response = await fetch("/api/notion", options);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      sendMessage(prompt);
      setPrompt("");
      handleClick();
    }
  };
  const handleClick = async () => {
    if (!timer) {
      setShowButton(false);
      setTimer(
        setInterval(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000)
      );
    }
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      setTimer(null);
      handleTimeout();
    }
  }, [timeRemaining, timer]);

  const handleTimeout = async () => {
    setShowButton(true);
    setTimeRemaining(1*60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Ethereum wallet is not available");
    }
  }
  const ERC20_ADDRESS = "0x55011d0B0935b411EDf87D72cD49A5bCCe27a959";
  const ERC20_ABI = require("./abi.json");
  async function mintTokens() {
    if (provider) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, signer);
      const mintTransaction = await contract.mint(address, 1000);
      await mintTransaction.wait();
      console.log(`Minted 1000 tokens to ${address}`);
    } else {
      console.log("Wallet not connected");
    }
  }
  return (
    <>
      <Container maxW="container.xl">
        <Flex alignItems="center" justifyContent="space-between" py={4}>
            <Link href="/">
          <Box>
            <Image src="/scroll.png" alt="Robot Logo" h="30px" />
          </Box>
          </Link>
          <Box>
            {showButton ? (
              <Button onClick={mintTokens}>Mint</Button>
            ) : (
              <p>Time remaining: {formatTime(timeRemaining)}</p>
            )}
          </Box>
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
