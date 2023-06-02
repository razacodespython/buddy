import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Box
      backgroundSize="cover"
      backgroundPosition="center"
      color="black"
      minHeight="100vh"
    >
      <Box>
        <Container maxW="container.xl">
          <Flex alignItems="center" justifyContent="space-between" py={4}>
            <Box>
              <Image src="/scroll.png" alt="Robot Logo" h="30px" />
            </Box>
            <Box>
              <Button
                bg="transparent"
                borderColor="white"
                borderWidth="2px"
                color="black"
              >
                Sign In
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box>
        <Container maxW="container.xl" pt={16}>
          <Flex alignItems="center" justifyContent="space-between">
            <Box w="50%">
              <Heading as="h1" size="2xl" mb={8}>
                Nurture your mind daily with AI-powered journaling with Buddy.
              </Heading>
              <Text fontSize="xl" lineHeight="tall" mb={12}>
                Buddy is your AI therapis that helps you journal 15 min a day to
                help battle mental health
              </Text>
              <Link href="/journal">
                <Button
                  bg="transparent"
                  borderColor="black"
                  borderWidth="2px"
                  color="black"
                >
                  Get Started
                </Button>
              </Link>
            </Box>

            <Box w="40%" h="40%">
              <Image src="/robot3.jpeg" alt="Robot Image" />
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;