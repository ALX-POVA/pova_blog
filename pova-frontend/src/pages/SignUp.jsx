import { useState } from 'react';
import { useNavigate } from 'react-router';

import sigupImage from "../assets/images/signup_image.png";

function SignUp() {
  const [ inputs, setInputs ] = useState({});
  const [ message, setMessage ] = useState(null);
  const navigate = useNavigate();

  function handleInputsChange(event){
    const name = event.target.name;
    const value = event.target.value;

    setInputs(values => ({...values, [name]: value}));
  }

  async function handleSubmit(event){
    event.preventDefault();
    if (inputs.password === inputs.confirmPassword){
      try{
        const response = await fetch('https://pova_blog-onrender.com/api/v1/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
          }
        );
        if (response.status !== 201){
          setMessage(response.json())
          throw new Error(JSON.stringify(response.json()));
        }
        setMessage(response.json().message)
        setTimeout(2000, () => navigate('/login'));
      } catch (err){
        console.error(err.message)
      }
    } else {
      setMessage({error: "Can't submit, password does not match"});
    }
  }

  return (
    <div className="flex w-3/4 my-96 mx-auto font-prime_font">
      <div className="">
        <img src={sigupImage} alt="pic" />
      </div>
      <div className="w-2/3 bg-custom_gray">
        <div className="flex m-14 justify-end">
          <p className="text-lg">
           Have an account?{" "}
            <a href="/signin" className="text-orange_primary">Sign in!</a>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-2xl mb-2 font-semibold">Get Started With Pova</p>
            <p className="font-semibold text-xl text-gray-400">Get started is easy</p>
            {/* {message.error && <p style={{ color: 'red' }}>{message.error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>} */}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Full Name"
                className="font-medium w-96 p-5 my-5 rounded-lg border-gray-300 border-2"
                name="fullName"
                value={inputs.fullName || ""}
                onChange={handleInputsChange}
              />
              <input
                type="email"
                placeholder="Email"
                className="font-medium w-96 p-5 my-5 rounded-lg border-gray-300 border-2"
                name="email"
                value={inputs.email || ""}
                onChange={handleInputsChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="font-medium w-96 p-5 my-5 rounded-lg border-gray-300 border-2"
                name="password"
                value={inputs.password || ""}
                onChange={handleInputsChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="font-medium w-96 p-5 my-5 rounded-lg border-gray-300 border-2"
                name="confirmPassword"
                value={inputs.confirmPassword || ""}
                onChange={handleInputsChange}
                style={{
                  borderColor: (inputs.confirmPassword && inputs.password === inputs.confirmPassword) ? "green" : "red"
                }}
              />
            </div>
            <div>
              <input type="submit" className="text-center w-96 bg-orange_primary border-2 rounded-md p-3 my-9"/>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-0.5 w-1/4 bg-gray-300"></div>
              <p>Or continue with</p>
              <div className="h-0.5 w-1/4 bg-gray-300"></div>
            </div>
            <div className="flex justify-center mb-14">
              <div className="soc-media-link">Google</div>
              <div className="soc-media-link">Facebook</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
