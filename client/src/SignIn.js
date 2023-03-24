import Input from "./components/Input";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./components/Button";
import { useEffect, useState } from "react";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.search;

  const errValue = ()=>{
    if (!fieldsErr){
    if (path == "?blocked"){
      return 'You have been blocked'
    }
    if (path == "?not_found") {
      return "User not found"
    }
    if (path == "?failure=true" ) {
      return "Incorrect email or password"
    }} else {
     return "Fields can't be empty"
    }
  }
  


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldsErr, setFieldsErr] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, ...{ [name]: value } });
  };

  const handleSubmit = (event) => {
    if (formData.email?.trim() === "" || formData.password?.trim() === "") {
      event.preventDefault();
      setFieldsErr(true);

      return;
    }
  };
  useEffect(() => {
    setFieldsErr(false);
  }, [formData.email, formData.password]);

  return (
    <div className="flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action= {`/login`}
            method="POST"
            onSubmit={handleSubmit}
          >
            <Input
              title="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              title="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate("/reg")}
                className="font-medium border-none bg-transparent text-indigo-600 hover:text-indigo-500"
              >
                Not registered yet?
              </button>
            </div>

            <div className="flex justify-between items-center">
              <Button title="SignIn" type="submit" />
              <div className="text-red-500">
              <p>{errValue()}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
