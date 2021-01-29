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
        <div class="form sign-in-form">
          <div class="wrapper">
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
              <button disabled={loading} type="submit" id="logInButton">
                Log In
              </button>
              {/* handle forget password */}
              <div
                style={{ paddingTop: "25px" }}
                onClick={triggerForgotPasswordForm}
              >
                Forgot Password?
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
              <button disabled={loading} type="submit" id="logInButton">
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
              <button disabled={loading} type="submit">
                Sign Up
              </button>
            </form>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-left">
              <h1>Already have an account?</h1>
              <br />
              <button
                id="signInButton"
                onClick={() => {
                  document.querySelector(
                    ".container .overlay-container"
                  ).style.transform = "translateX(100%)";
                  document.querySelector(
                    ".container .overlay-container .overlay"
                  ).style.transform = "translateX(-50%)";
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
            <div class="overlay-right">
              <h1>No account yet?</h1>
              <br />
              <button
                id="signUpButton"
                onClick={() => {
                  document.querySelector(
                    ".container .overlay-container"
                  ).style.transform = "translateX(0)";
                  document.querySelector(
                    ".container .overlay-container .overlay"
                  ).style.transform = "translateX(0)";
                  document
                    .querySelector(".container .sign-up-form")
                    .classList.add("active");
                  document
                    .querySelector(".container .sign-in-form")
                    .classList.remove("active");
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignInSignUp;
