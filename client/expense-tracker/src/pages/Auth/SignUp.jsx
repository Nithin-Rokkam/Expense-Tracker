import React,{useState} from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/Inputs/input';
import { useNavigate,Link } from 'react-router-dom';
import {validateEmail} from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import uploadImage from '../../utils/uploadImage';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if(!fullName){
      setError("Please enter your name");
      return;
    }
    if(!validateEmail(email)) {
      setError("Please enter your email address");
      return;
    }
    if(!password){
      setError("please enter the password");
      return;
    }
    setError("");

    //SignUp API call
    try{

      //upload image if present
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        console.log("Uploaded Image Respones:", imgUploadRes);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });
      console.log("Signup Successful",response.data);
      const {token,user} = response.data;
      if(token) {
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/login");
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else {
        console.log("SignUp Failed",error.response?.data?.message || error.message);
        setError("Something went wrong. Please try again.");
      }
    }

  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-50 md:h-full mt-10 md:mt-0 flex-col justify-center'>
        <h3 className='text-3xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xl text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic}/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label= "Full Name"
              placeholder="nithin"
              type = "text"
            />
            <Input
              value = {email}
              onChange={({target}) => setEmail(target.value)}
              label = "Email Address"
              placeholder='nithinrokkam@example.com'
              type = "text"
            />
            <div className='col-span-2'>
              <Input
                value = {password}
                onChange={({target}) => setPassword(target.value)}
                label = "Password"
                placeholder = "Minimum 8 Characters"
                type = "password"/>
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
          <button type ="submit" className='btn-primary'>SIGN UP</button>
          
          <p  className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className ="font-medium  text-primary underline" to = "/login">Login</Link>
          </p>
        </form> 
      </div>
    </AuthLayout>
  )
}

export default SignUp