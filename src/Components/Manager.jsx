import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });

  const [passwordArray, setPasswordArray] = useState([]);

  function copyText(text) {
    navigator.clipboard.writeText(text);
    toast.info("text copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  const getPasswords = async () => {
    let request = await fetch("http://localhost:3000/");

    let passwords = await request.json();

    setPasswordArray(passwords);

    console.log(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    if (ref.current.src.includes("Icons/eye-cross.png")) {
      ref.current.src = "Icons/eye.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "Icons/eye-cross.png";
      ref.current.src = "Icons/eye-cross.png";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      // If any such id exists in the db, delete it
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });

      setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: uuidv4() }),
      });

      setForm({ site: "", username: "", password: "" });

      toast.success("Password saved successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.warn("Error: Password not saved!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const deletePassword = async (id) => {
    let deteleResponse = confirm(
      "Are you sure you want to delete this password?"
    );

    if (deteleResponse) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));

      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.error("Password deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const editPassword = (id) => {


    setForm({...passwordArray.filter((item) => item.id === id)[0], id: id});

    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="md:myContainer p-0 md:p-2 min-h-screen ">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700 font-bold">&lt;</span>
          <span className="text-white">Pass</span>

          <span className="text-green-700">Pal</span>
          <span className="text-green-700 font-bold">/&gt;</span>
        </h1>
        <p className="text-green-700 text-lg text-center">
          your own password manager
        </p>
        <div className="text-white flex flex-col p-4 gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            name="site"
            placeholder="Enter website url"
            className="rounded-full border border-green-500 w-full text-black p-4 py-1"
            type="text"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="rounded-full border border-green-500 w-full text-black p-4 py-1"
              type="text"
              name="username"
              id="username"
            />

            <div className="relative">
              <input
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                ref={passwordRef}
                className="rounded-full border border-green-500 w-full text-black p-4 py-1"
                name="password"
                id="password"
              />
              <span
                className="absolute right-0 text-black px-4 text-center bottom-0 top-0"
                onClick={() => {
                  showPassword();
                }}
              >
                <img
                  src="Icons/eye.png"
                  className="cursor-pointer"
                  ref={ref}
                  alt="eye"
                  style={{ width: "32px", height: "32px" }}
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center gap-2 items-center text-black bg-green-600 hover:bg-green-500 px-6 py-2 w-fit text-center mx-auto rounded-full "
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4 text-white text-center">
            Your Passwords
          </h2>
          {passwordArray.length == 0 && (
            <div className="text-white text-center">No Passwords to show</div>
          )}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full overflow-hidden rounded-md mb-10 ">
              <thead className="text-white  bg-green-800">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" text-center py-2 border ">
                        <div className="flex items-center justify-center">
                          <span>{item.site}</span>
                          <div
                            className="coopyBtn size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="  text-center py-2 border">
                        <div className="flex items-center justify-center">
                          <span>{item.username}</span>

                          <div
                            className="copyBtn size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 border ">
                        <div className="flex items-center justify-center">
                          <span>{"*".repeat(item.password.length)}</span>

                          <div
                            className="copyBtn size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>

                      <td className="text-center py-2 border ">
                        <div className="flex items-center justify-center">
                          <button
                            className="cursor-pointer p-1.5 mx-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            onClick={() => {
                              editPassword(item.id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="cursor-pointer p-1.5 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => {
                              deletePassword(item.id);
                            }}
                          >
                            Delete
                          </button>

                          <div
                            className="copyBtn size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
