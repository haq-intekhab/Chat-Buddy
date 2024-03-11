import React ,{useState} from 'react'
import {VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react'


const Signup = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [show1 , setShow1] = useState(false);
    const [show2 , setShow2] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pics) => {
        setLoading(true);
        if(pic === undefined){
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'intekhab');
            fetch('https://api.cloudinary.com/v1_1/intekhab/image/upload', {
                method: 'POST',
                body: data,
            }).then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
        }
        else{
            toast({
                title: 'Please Select an Image File',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
     };

    const submitHandler = async () => { 
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
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
        if(password !== confirmPassword){
            toast({
            title: 'Passwords do not match',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
          });
          return;
        }
        try {
            const config = {
                headers: {
                'Content-Type': 'application/json'
              },
            };

            const {data} = await axios.post(
                "/api/users",
                {name, email, password, pic},
                config
            );
            toast({
                title: 'Registratoin Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');  
      } catch (err) {
        toast({
            title: 'Error occured!',
            description: err.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        console.log(err);
        setLoading(false);
      }
    };


  return <VStack spacing="5px" color="black">
    <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
        />
    </FormControl>

    <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
        />
    </FormControl>

    <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input
            type={show1 ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
        />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={()=> setShow1(!show1)}>
                    {show1 ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input
            type={show2 ? "text" : "password"}
            placeholder="Enter Your Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=> setShow2(!show2)}>
                {show2 ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id="pic">
        <FormLabel>Upload picture</FormLabel>
        <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
        />
    </FormControl>

    <Button
        colorScheme='blue'
        width='100%'
        color={'white'}
        style={{marginTop:'15px'}}
        onClick={submitHandler}
        isLoading={loading}
    >
        Sign Up
    </Button>
  </VStack>
}

export default Signup;
