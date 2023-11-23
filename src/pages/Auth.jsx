import React, { useEffect } from 'react'
import { ChakraProvider, Container, Box, Text, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import axios from 'axios'
import Navbar from '../components/Navbar'

axios.defaults.baseURL = import.meta.env.VITE_ENDPOINT;

const Auth = () => {
    return (<>
        <div className='authInterface'><ChakraProvider>
            <Navbar />
            <Container maxW='xl' centerContent>
                <Box
                    d='flex' justifyContent='center' p={3} bg={'black'}
                    w='100%' m="40px 0 15px 0" borderRadius='lg' borderWidth='1px'
                ><Text fontSize='2xl' color="white" textAlign="center">Code Collabe</Text>
                </Box>
                <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                    <Tabs isFitted variant="soft-rounded">
                        <TabList mb="1em">
                            <Tab>Login</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Signup />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </ChakraProvider>
        </div>
    </>
    )
}

export default Auth