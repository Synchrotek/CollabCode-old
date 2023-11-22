import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast'
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast.error('Please Fill all the Fields');
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }
            const { data } = await axios.post(
                '/api/user/login',
                { email, password }
            )
            toast.success('Login Successful');
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false);
            navigate('/')
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data);
            setLoading(false);
        }
    }

    return (
        <VStack spacing="10px">
            <FormControl id="email_login" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password_login" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>
        </VStack>
    )
}

export default Login