import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { compareAsc, format } from "date-fns";
import Button from "./components/Button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Table(props) {
  const checkbox = useRef();
  const [people, setPeople] = useState([]);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3002/users", { credentials: "include" })
      .then((result) => {
        if (result.status === 401) {
          window.location.href = "/";
          return [];
        } else {
          return result.json();
        }
      })
      .then((data) => {
        setPeople(data);
      });
  }, []);

  // const logout = async () => {
  //   const url = "http://localhost:3002/logout";
  //   const data = props.userInfo;

  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify(data),
  //   }).then(() => navigate("/"));

  //   return response;
  // };
  // console.log(props.userInfo.id);

  const clickBlock = () => {
    const selectedID = selectedPeople.map((person) => person.id);
    const isActive = selectedID.find((item) => item === props.userInfo.id);

    if (isActive) {
      const url = "http://localhost:3002/logout";
      const data = props.userInfo;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }).then(() => navigate("/"));
    }

    const url = "http://localhost:3002/block";
    const data = selectedID;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((data) => {
      if (data.status === 200) {
        fetch("http://localhost:3002/users", { credentials: "include" })
          .then((result) => {
            if (result.status === 401) {
              window.location.href = "/";
              return [];
            } else {
              return result.json();
            }
          })
          .then((data) => {
            setPeople(data);
            setSelectedPeople([]);
          });
      }
    });
  };

  const clickUnblock = () => {
    const selectedID = selectedPeople.map((person) => person.id);

    const url = "http://localhost:3002/unblock";
    const data = selectedID;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((data) => {
      if (data.status === 200) {
        fetch("http://localhost:3002/users", { credentials: "include" })
          .then((result) => {
            if (result.status === 401) {
              window.location.href = "/";
              return [];
            } else {
              return result.json();
            }
          })
          .then((data) => {
            setPeople(data);
            setSelectedPeople([]);
          });
      }
    });
  };

  const clickDelete = () => {
    const selectedID = selectedPeople.map((person) => person.id);

    const url = "http://localhost:3002/delete";
    const data = selectedID;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }).then((data) => {
      if (data.status === 200) {
        fetch("http://localhost:3002/users", { credentials: "include" })
          .then((result) => {
            if (result.status === 401) {
              window.location.href = "/";
              return [];
            } else {
              return result.json();
            }
          })
          .then((data) => {
            setPeople(data);
            setSelectedPeople([]);
          });
      }
    });
  };

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < people.length;
    setChecked(selectedPeople.length === people.length && people.length !== 0);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : people);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div class="mt-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold leading-6 text-gray-900">
            EDITABLE USERLIST FOR TASK 4
          </h1>
        </div>
      </div>
      <div className="flex justify-between mt-5 items-center">
        <div className=" top-0 left-14 flex h-12 items-center space-x-3 sm:left-12">
          <button
            onClick={clickBlock}
            type="button"
            className="group flex justify-center items-center space-x-1 rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <span className="inset-y-0 left-0 flex items-center px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>Block</span>
          </button>
          <button
            onClick={clickUnblock}
            type="button"
            className="group flex justify-center items-center space-x-1 rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <span className="inset-y-0 left-0 flex items-center px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
              </svg>
            </span>
            <span>Unblock</span>
          </button>
          <button
            onClick={clickDelete}
            type="button"
            className="group flex justify-center items-center space-x-1 rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="inset-y-0 left-0 flex items-center px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>Delete</span>
          </button>
        </div>

        <div className="flex items-center">
          <div className="mx-5">
            <p>
              User:{" "}
              <span className="text-1xl font-bold text-gray-900">
                {!props.userInfo ? "unauthorized" : props.userInfo.email}
              </span>
            </p>
          </div>
          <form action="http://localhost:3002/logout" method="POST" credentials='include'>
            <button
              type="submit"
              className="group flex justify-center items-center space-x-1 rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <span className="inset-y-0 left-0 flex items-center px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>logout</span>
            </button>
          </form>
        </div>
      </div>
      <div className="mt-3 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className=" py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Lastname
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Registration date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last login date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr
                      key={person.id}
                      className={
                        selectedPeople.includes(person)
                          ? "bg-gray-50"
                          : undefined
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedPeople.includes(person) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          value={person.email}
                          checked={selectedPeople.includes(person)}
                          onChange={(e) =>
                            setSelectedPeople(
                              e.target.checked
                                ? [...selectedPeople, person]
                                : selectedPeople.filter((p) => p !== person)
                            )
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.id}
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                          selectedPeople.includes(person)
                            ? "text-blue-600"
                            : "text-gray-900"
                        )}
                      >
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.lastname}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(
                          new Date(person.registration_date),
                          "yyyy-MM-dd"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(
                          new Date(person.last_login),
                          "yyyy-MM-dd")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={
                            person.isBlocked === 0
                              ? "inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
                              : "inline-flex rounded-full justify-center bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800"
                          }
                        >
                          {person.isBlocked === 0 ? "Active" : "Blocked"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
