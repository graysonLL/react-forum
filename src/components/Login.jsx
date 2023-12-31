import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderIMG from "../assets/usc75_01ed.png";
import Loaderz from "./Loader";
import ForgotP from "./ForgotP";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingIMG, setisLoadingIMG] = useState(true);
  const location = useLocation();
  const [showF, setShowF] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const messageFRest = searchParams.get("message");

  const openForgot = () => {
    setShowF(!showF);
  };

  useEffect(() => {
    document.title = "TCC - Login";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    
  };

  const handleSubmit = async (e) => {
    const urlParam = decodeURIComponent(
      (location.search.match(/(\?|&)lastLink=([^&]*)/) || [])[2]
    );
    const lastUrl = decodeURIComponent(urlParam || "");

    e.preventDefault();
    setIsLoading(true);

    const { username, password } = formData;
    const newErrors = {};

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);

        if (lastUrl !== "undefined") {
          navigate(lastUrl);
        } else {
          navigate("/dashboard");
        }
      } else if (response.status === 401) {
        const { error } = await response.json();
        if (error === "Invalid username or password") {
          setError("Invalid username or password");
        } else {
          setError(
            "An error occurred while logging in. Please try again later."
          );
        }
      } else {
        setError("An error occurred while logging in. Please try again later.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while logging in. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/api/register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const imageSrc = useMemo(() => HeaderIMG, []);

  const handleImageLoaded = () => {
    setisLoadingIMG(false);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
          <figure>
            {isLoadingIMG && <Loaderz />}
            <img
              src={imageSrc}
              onLoad={handleImageLoaded}
              alt="Header"
              className={isLoadingIMG ? "hidden" : ""}
            />
          </figure>
          <div className="card-body">
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {messageFRest && (
              <p
                className={
                  messageFRest === "Invalid or expired token" ? "text-red-500" : "text-green-500"
                }
              >
                {messageFRest}
              </p>
            )}

            <form onSubmit={handleSubmit} className="text-center">
              <div className="mb-4">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="USERNAME"
                  className="input input-bordered input-accent w-full max-w-xs"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="PASSWORD"
                    className="input input-bordered input-accent w-full max-w-xs"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-5 px-2 py-1 bg-inherit text-white-600 text-xs rounded"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-col">
                <button
                  type="submit"
                  className="btn btn-accent mb-5"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>

                <button
                  type="button"
                  className="btn btn-warning mt-5"
                  onClick={openForgot}
                >
                  Forgot Password?
                </button>

                {showF && <ForgotP />}
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer className="footer p-10 bg-base-300 flex">
        <nav>
          <header className="footer-title text-white">
            The Carolinian Connection
          </header>
          <p className="text-justify">
            Embark on a digital revolution designed exclusively for the dynamic
            community of University of San Carlos students! Say hello to "The
            Carolinian Connection", where tech meets the unmistakable Carolinian
            spirit. It's not just an app; it's your passport to a world of
            seamless communication, interactive forums, and a marketplace
            curated for the USC experience. Let's redefine the way Carolinians
            connect, engage, and thrive together!
          </p>
        </nav>
      </footer>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside className="flex flex-col">
          <div className="text-md">
            Made with <span className="text-red-500">&#10084;</span>
          </div>
          <div className="flex flex-col  font-bold lg:flex-row lg:space-x-10">
            <ul>
              <a href="https://github.com/noturnachs" target="_blank">
                Dan Lius Monsales
              </a>
            </ul>
            <ul>
              <a href="https://github.com/prognewb" target="_blank">
                Niño Jan Roz Cabatas
              </a>
            </ul>
            <ul>
              <a href="https://github.com/clandy07" target="_blank">
                Eduardo Miguel Cortes
              </a>
            </ul>
            <ul>
              <a href="https://github.com/graysonLL" target="_blank">
                Liam Michael Jones
              </a>
            </ul>
          </div>
        </aside>
      </footer>
    </>
  );
};

export default LoginForm;
