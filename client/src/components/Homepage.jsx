import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import SearchAPI from "./SearchAPI";
import image from "../logo.png";

import "../style/appLayout.css";
import "../style/home.css";
import "../style/questionList.css";
import "../style/profile.css";

export default function AppLayout() {
  const [questionItems, setQuestionItems] = useState([]);
  const { accessToken } = useAuthToken();
  const [userInfo, setUserInfo] = useState([]);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { user, logout } = useAuth0();
  const [searchResults, setSearchResults] = useState([]);

  async function getQuestionFromApi() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/questions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const question = await data.json();

    setQuestionItems(question.reverse());
  }

  async function getUserInfo() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await data.json();

    setUserInfo(result);
  }

  useEffect(() => {
    getQuestionFromApi();
    if (isAuthenticated) {
      getUserInfo();
    } else {
      setUserInfo([]);
    }
  }, [accessToken]);

  async function postQuesntion(newQuestion) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newQuestion),
    });
    if (data.ok) {
      const ques = await data.json();
      return ques;
    } else {
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      title: e.target.title.value,
      content: e.target.content.value,
      authorEmail: user.email,
    };

    await postQuesntion(newQuestion);
    getQuestionFromApi();

    e.target.reset();
  };

  return (
    <div className="app">
      <div className="title">
        <img src={image} alt="Logo for the name of the company, it says Empty Stack" height={80} width={200} />
      </div>

      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            {!isAuthenticated ? (
              <li>
                <button className="btn-primary" onClick={loginWithRedirect}>
                  Login
                </button>
              </li>
            ) : (
              <li>
                <Link to={`/user/${userInfo.id}`}>Profile</Link>
              </li>
            )}
            {!isAuthenticated ? (
              <li></li>
            ) : (
              <li>
                <button
                  className="btn-primary"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  LogOut
                </button>
              </li>
            )}
            {!isAuthenticated ? (
              <li></li>
            ) : (
              <li>
                <div>Welcome 👋 {userInfo.name} </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="container">
        <div className="form-wrapper">
          <form
            className="blog-form"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <label htmlFor="title">Title: </label>
            <input
              className="input-title"
              type="text"
              name="title"
              id="title"
              required
            />

            <label htmlFor="content">Question: </label>
            <textarea
              className="questionText"
              defaultValue=" "
              id="content"
              name="content"
              required
              
            >
             
            </textarea>
            <div>
              {!isAuthenticated ? (
                <button className="btn-primary" onClick={loginWithRedirect}>
                  Login To Post Question
                </button>
              ) : (
                <input
                  className="btn-primary"
                  type="submit"
                  value="Ask Question"
                />
              )}
            </div>
          </form>
        </div>

        <div className="question-wrapper">
          <p>All recent questions:</p>
          <ul className="questions">
            {questionItems.map((item) => {
              return (
                <li key={item.id} className="question-item">
                  <Link to={`/${item.id}`} className="itemName">
                    {item.title}
                  </Link>
                  <span>Created at {item.createdAt.slice(0, 10)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="wrapper">
          <div>
            <SearchAPI
              setSearchResults={setSearchResults}
              searchResults={searchResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
