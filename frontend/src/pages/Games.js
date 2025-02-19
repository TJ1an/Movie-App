import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { SimpleGrid, Box, Heading, Card, CardBody, Image, CardFooter, Button, ButtonGroup, Input, Skeleton, HStack, StackDivider, Spacer, Text, keyframes, useDisclosure, useToast} from '@chakra-ui/react';
import { ScaleFade} from '@chakra-ui/react'
import {HamburgerIcon } from '@chakra-ui/icons'
import '@fontsource-variable/orbitron';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const Games = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState(null); // State to store the username
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [popup, setPopup] = useState(false);
  const [popupFailed, setPopupFailed] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

const animationKeyframes1 = keyframes`
    0% { transform: scale(1) rotate(0);}
    25% { transform: scale(1.5) rotate(0);}
    50% { transform: scale(1.5) rotate(270deg);}
    75% { transform: scale(1) rotate(270deg);}
    100% { transform: scale(1) rotate(0);}
  `;

const animationKeyframes2 = keyframes`
    100%{ transform: scale(1.1) rotate(0);}
  `;

const animation1 = `${animationKeyframes1} 2s ease-in-out infinite`;
const animation2 = `${animationKeyframes2} ease-in-out forwards`;

const viewGameDetails = (id) => {
    navigate(`/games/${id}`, { state: { id } });
}

const nextPage = () => {
    setPage(page + 1);
};

const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
};
useEffect(() => {
  // Check if the user is logged in using cookies
  const token = Cookies.get('jwt');
  console.log(token);
  if (token) {
      // If token exists, decode it to get user information
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      console.log(username);
  }
}, []); // Empty dependency array means this effect will run only once after the component mounts

const getGames = async () => {
  try {
    setLoading(true);
    const res = await fetch(`http://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&page=${page}`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonData = await res.json();
    setData(jsonData.results.slice(0, 20))
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error, show message to user, etc.
  }
};


const searchGames = async () => {
    try {
      if (search) {
        setLoading(true);
        const res = await fetch(`http://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&search=${search}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await res.json();
        setData(jsonData.results.slice(0, 20));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error, show message to user, etc.
    }
}

const getGamesByGenre = async () => {
  try {
    if (genre) {
      setLoading(true);
      const res = await fetch(`http://api.rawg.io/api/games?key=${process.env.REACT_APP_API_KEY}&genres=${genre}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await res.json();
      setData(jsonData.results.slice(0, 20));
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error, show message to user, etc.
    setLoading(false); // Make sure to set loading to false even in case of error
  }
};


const goLogout = async () => {
  try {
    const response = await fetch("http://localhost:3500/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
    });
    if (response.ok) {
      setPopup(true);
    } else {
      // Registration failed, handle error
      setPopupFailed(true);
      console.error("logout failed:", response.statusText);
      // Optionally, show an error message to the user
    }
  } catch (error) {
    console.error("Error during logout:", error.message);
  }
};

useEffect(() => {
  if (popup) {
    toast({
      title: "Logged out",
      description: "You have successfully logged out",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    window.location.reload();
    setPopup(false); // Reset popup state after displaying toast
  }
}, [popup]);

useEffect(() => {
  if (popupFailed) {
    toast({
      title: "Error",
      description: "There was an error",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    setPopupFailed(false); // Reset popup state after displaying toast
  }
}, [popupFailed]);

const handleClick = async (game) => {
  setGenre(game);
};

useEffect(() => {
  if (genre) {
      getGamesByGenre();
  } 
}, [genre]);

useEffect(() => {
    getGames();
}, [page]);

const goLogin = () => {
  navigate('/login');
};

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchGames();
    }
};

const goHome = () =>{
  navigate('/')
}

  return (
    <>
      <Box style={{backgroundColor: 'black', fontFamily: `'Orbitron Variable', sansSerif`, height: '100%',}} className='container'>
        <Box display="flex" flexDir="row" as="nav" p="20px" alignItems="center" pl="40px" pr="40px" justifyContent="center">
        <HamburgerIcon color="white" boxSize={10} onClick={onOpen} cursor="pointer" _hover={{color: "purple.300"}}/>
            <Box
            _hover={{
                    animation: `${animation1}`,
                    color: "white",
                    transform: "rotate(0.5turn)",
                }}
            >
            </Box>
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} size="xs">
            <DrawerOverlay />
            <DrawerContent style={{ fontFamily: `'Orbitron Variable', sansSerif` }}>
            <DrawerHeader bgColor='rgb(30, 30, 31)' color="white" display="flex" justifyContent="center">Genres</DrawerHeader>
            <DrawerBody bgColor='rgb(30, 30, 31)' color="white.300" display="flex" flexDir="column" gap="30px">
                <Button onClick={() => {getGames(); setGenre('');}}>Popular</Button>
                <Button onClick={() => handleClick('racing')}>Racing 🏎️💨</Button>
                <Button onClick={() => handleClick('action')}>Action 💥</Button>
                <Button onClick={() => handleClick('adventure')}>Adventure 🧭</Button>
                <Button onClick={() => handleClick('shooter')}>Shooter 🔫</Button>
                <Button onClick={() => handleClick('sports')}>Sports 🏈</Button>
                <Button onClick={() => handleClick('strategy')}>Strategy ♟️</Button>
                <Button onClick={() => handleClick('puzzle')}>Puzzle 🧩</Button>
            </DrawerBody>
            </DrawerContent>
        </Drawer>
            <Spacer/>
            <Box position = "absolute" _hover={{
                    animation: `${animation2}`,
                    color: "purple"
                }}>
            <Heading size='xl' color="white" cursor="pointer" paddingLeft="0" _hover={{color: "purple.300"}} style={{ fontFamily: `'Orbitron Variable', sansSerif` }} onClick={() => goHome()}>Game Hub</Heading>
            </Box>
            <Spacer/>
            <Box>
            <HStack spacing="20px">
            <Text color="white" fontSize="xl">
              Cart
            </Text>
            {username ? (
              <Text
                color="white"
                fontSize="xl"
                cursor="pointer"
                onClick={() => goLogout()}
              >
                Logout
              </Text>
            ) : (
              <Button
                colorScheme="white"
                fontSize="xl"
                cursor="pointer"
                onClick={() => goLogin()}
              >
                Login
              </Button>
            )}
            </HStack>
            </Box>
        </Box>

        <Box display='flex' justifyContent='center' alignItems='center' flexDir="column" paddingLeft = "22px">
          <Input
            placeholder='Search'
            size='md'
            htmlSize={50}
            width='auto'
            color='black'
            value={search}
            onChange={(e) => {setSearch(e.target.value)}}
            onKeyPress={handleKeyPress}
            bgColor="white"
            borderRadius="20px"
          />
          <Heading color="white" paddingTop="20px" paddingLeft="10px" style={{ fontFamily: `'Orbitron Variable', sansSerif` }}>{genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)}` : "Popular 🔥"}</Heading>
        </Box>
        {

        loading ?
        <>
        <SimpleGrid spacing={10} minChildWidth={350} p={10}>
          {[...Array(20)].map((index) => (
            <Skeleton key={index} height="350px" width="100%" borderRadius="10px"/>
          ))}
        </SimpleGrid>
        </> :
        <>
        <ScaleFade initialScale={0.9} in={!loading}>
        <SimpleGrid spacing={10} minChildWidth={350} p={10}>
          {data.map((game) => (
            <Card key={game.id} borderRadius="300px">
              <CardBody bgColor= 'rgb(30, 30, 31)' borderTopLeftRadius="20px" borderTopRightRadius="20px">
                <Image src={game.background_image} alt={game.name} h='250px' borderRadius='lg' onClick={() => viewGameDetails(game.id)} cursor="pointer"/>
                <HStack mt='6' spacing='3'>
                  <Heading size='md' color="white" style={{ fontFamily: `'Orbitron Variable', sansSerif` }}>{game.name}</Heading>
                </HStack>
                <HStack mt='6' spacing='3'>
                  {game.platforms.slice(0, 3).map((platform, index) => (
                    <Heading key={index} size='3xs' color="white" style={{ fontFamily: `'Orbitron Variable', sansSerif` }}>{platform.platform.name}</Heading>
                  ))}
                </HStack>
              </CardBody>
              <StackDivider bg='white' height="1px"/>
              <CardFooter bgColor='rgb(30, 30, 31)' borderBottomLeftRadius="20px" borderBottomRightRadius="20px">
                <ButtonGroup spacing='2' marginLeft="-20px">
                  <Button variant='solid' colorScheme='white'  _hover={{color: "purple.300"}}>
                    Buy now
                  </Button>
                  <Button variant='ghost' colorScheme='white' color="white"  _hover={{color: "purple.300"}}>
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
        {genre === ''? (
          <>
            <HStack display="flex" justifyContent="center" paddingBottom="15px">
              <Button bgColor='white' color="black" variant='solid' minWidth="300px" onClick={previousPage}>
                Previous
              </Button>
              <Button bgColor='white' color="black" variant='solid' minWidth="300px" onClick={nextPage}>
                Next
              </Button>
            </HStack>
            <Box display="flex" justifyContent="center" paddingBottom="20px">
              <Text color="white" border="2px" borderColor="white.300" padding="10px" paddingLeft="20px" paddingRight="20px">{page}</Text>
            </Box>
          </>
        ) : null}
        </ScaleFade>
        </>
        }
      </Box>
    </>
  );
};

export default Games;
