import Button from "./components/Button";
import Input from "./components/Input";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Registration() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const inputClasses =
    "mt-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  const register = async () => {
    const url = `${process.env.BACKEND_URL}/reginfo`;
    const data = {
      name: firstName,
      lastname: lastName,
      email: email,
      password: password,
    };

    console.log(firstName, lastName, email, password);
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((result) => {
      if (result.status === 408) {
        setErr("Fields can't be empty");
      }
      if (result.status === 410) {
        setErr("User have been blocked");
      }
      if (result.status === 409) {
        setErr("User is already exist");
      }
      if (result.status === 200) {
        setErr("Registered successfully");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Registration
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>

            <input
              title="First Name"
              type="text"
              className={inputClasses}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Last Name
            </label>
            <input
              title="Last Name"
              type="text"
              className={inputClasses}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <input
              title="Email address"
              type="email"
              className={inputClasses}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <input
              title="Password"
              type="password"
              className={inputClasses}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-sm ">
            <button
              onClick={() => navigate("/")}
              className="font-medium border-none bg-transparent text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </button>
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={register} title=" Create an account"></Button>
            <div
              className={
                err === "Registered successfully"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              <p>{err}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
