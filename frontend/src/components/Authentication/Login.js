import React,{useState} from  'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show , setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const submitHandler = async () => { 
        setLoading(true);
        try{
            if(!email || !password){
                toast({
                    title: 'Please fill all fields',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            const {data} = await axios.post('/api/users/login', {email, password},config);
            console.log(data);
            toast({
                title: 'Login Successful!',
                status:'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        }catch(error){
            toast({
                title: 'Error occured!',
                description: 'Invalid Credentials',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false);
            console.log(error);
        }
    };


  return <VStack spacing="5px" color="black">
    <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
    </FormControl>

    <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={()=> setShow(!show)}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <Button
        colorScheme='blue'
        width='100%'
        color={'white'}
        style={{marginTop:'15px'}}
        onClick={submitHandler}
        isLoading={loading}
    >
        Login
    </Button>

    <Button
        colorScheme='red'
        varient="solid"
        width='100%'
        style={{marginTop:'8px'}}
        onClick={() => {
            setEmail("guest@example.com");
            setPassword("12345678");
         }}
    >
        Get Guest User Credentials
    </Button>
  </VStack>
}

export default Login;
