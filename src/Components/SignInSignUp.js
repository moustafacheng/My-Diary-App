import firebase from "firebase/app";
import React, { useRef, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Alert, message } from "antd";
import "antd/dist/antd.css";
import { Link, useHistory } from "react-router-dom";
import app from "../firebase";
import { db } from "../firebase";
require("firebase/firestore");
// import { fixControlledValue } from "antd/lib/input/Input";

function SignInSignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const { signin } = useAuth();
  const history = useHistory();
  const resetPasswordEmailRef = useRef();

  //Trigger/Show Forget Password Form, and hide Log In Form

  function triggerForgotPasswordForm() {
    document.getElementById("logInForm").setAttribute("hidden", true);
    document.getElementById("forgotPasswordForm").removeAttribute("hidden");

    console.log(document.getElementById("logInForm"));
    console.log(document.getElementById("forgotPasswordForm"));
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    resetPassword(resetPasswordEmailRef.current.value)
      .then(message.success("Reset Email Sent"))
      .then((document.getElementById("resetPasswordEmail").value = ""));
  }

  //Trigger/Show Log In Form, and hide Forgot Password Form
  function handleCancelForgotPassword() {
    document.getElementById("forgotPasswordForm").setAttribute("hidden", true);
    document.getElementById("logInForm").removeAttribute("hidden");
  }

  //Handle Sign In function

  async function handleSignIn(e) {
    e.preventDefault();

    try {
      setSignInError("");
      setLoading(true);
      await signin(loginEmailRef.current.value, loginPasswordRef.current.value);
      history.push("/");
    } catch {
      setSignInError("Failed to Log In");
    }

    setLoading(false);
  }

  // Handle Sign up function. While signed up, users document with UID name also created.
  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        (cred) => {
          return db.collection("users").doc(cred.user.uid).set({
            email: emailRef.current.value,
          });
        }
      );

      history.push("/");
    } catch {
      setError("Failed to create account");
    }
    setLoading(false);
  }
  return (
    <section class="log-container">
      <div class="container">
        <div className="title-container">
          <div id="app-title">My Diary App</div>
        </div>
        {/******************* SIGN UP *******************/}
        <div class="form sign-up-form active">
          <div class="wrapper">
            <form onSubmit={handleSubmit}>
              <h1>Sign up</h1>
              {error && <Alert message={error} type="error" showIcon />}
              <br />
              <br />
              <input type="email" ref={emailRef} placeholder="Email" required />
              <input
                type="password"
                ref={passwordRef}
                placeholder="Password"
                required
              />
              <input
                type="password"
                ref={passwordConfirmRef}
                placeholder="Confirm Password"
                required
              />
              <button
                disabled={loading}
                type="submit"
                className="regular-button"
              >
                Sign Up
              </button>
              <div className="bottom-text">
                <br />
                Already Have An Account?
                <br />
                <button
                  className="small-button"
                  id="signInButton"
                  onClick={() => {
                    document.querySelector(
                      ".container .overlay-container"
                    ).style.transform = "translateX(200%)";
                    document.querySelector(
                      ".container .overlay-container .overlay"
                    ).style.transform = "translateX(0%)";
                    document
                      .querySelector(".container .sign-in-form")
                      .classList.add("active");
                    document
                      .querySelector(".container .sign-up-form")
                      .classList.remove("active");
                  }}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>

        {/******************* SIGN IN *******************/}
        <div class="overlay-container">
          <div class="overlay sign-in-form">
            <div class="overlay-1">
              {/* Log In Form, should be hidden if "forget password" is clicked */}
              <form onSubmit={handleSignIn} id="logInForm">
                <h1>Log In</h1>
                {signInError && (
                  <Alert message={signInError} type="error" showIcon />
                )}
                <br />
                <br />
                <input
                  id="logInEmail"
                  type="email"
                  ref={loginEmailRef}
                  placeholder="Email"
                  required
                />
                <input
                  id="logInPassword"
                  type="password"
                  ref={loginPasswordRef}
                  placeholder="Password"
                  required
                />
                <button
                  className="regular-button"
                  disabled={loading}
                  type="submit"
                  id="logInButton"
                >
                  Log In
                </button>
                {/* handle forget password */}
                <div
                  className="forgot-password"
                  onClick={triggerForgotPasswordForm}
                >
                  Forgot Password?
                </div>

                <div className="bottom-text-2">
                  <br />
                  <span className="no-account">No Account Yet ?</span>
                  <br />
                  <button
                    className="small-button-2"
                    id="signUpButton"
                    onClick={() => {
                      document.querySelector(
                        ".container .overlay-container"
                      ).style.transform = "translateX(0%)";
                      document.querySelector(
                        ".container .overlay-container .overlay"
                      ).style.transform = "translateX(200%)";
                      document
                        .querySelector(".container .sign-up-form")
                        .classList.add("active");
                      document
                        .querySelector(".container .sign-in-form")
                        .classList.remove("active");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              {/* Forget Password form, should be shown if "forget password" is clicked */}
              <form
                onSubmit={handleForgotPassword}
                id="forgotPasswordForm"
                hidden
              >
                <h1>Reset Password</h1>
                <br />
                <br />
                <input
                  id="resetPasswordEmail"
                  ref={resetPasswordEmailRef}
                  type="email"
                  placeholder="Email"
                  required
                />
                <button disabled={loading} type="submit" id="resetButton">
                  Reset
                </button>
                {/* handle forget password */}
                <div
                  style={{ paddingTop: "25px" }}
                  onClick={handleCancelForgotPassword}
                >
                  Cancel
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignInSignUp;
