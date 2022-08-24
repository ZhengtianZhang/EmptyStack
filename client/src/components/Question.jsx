import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import image from '../logo.png';

import "../style/questions.css";



export default function Question() {
  let { id } = useParams();
  const [question, setQuestion] = useState([]);
  const [answers, setAnswer] = useState([]);
  const { accessToken } = useAuthToken();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const { user } = useAuth0();

  async function getQuestionDetail() {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/question/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const ques = await data.json();

    setQuestion(ques);
  }

  async function getAnswers() {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/answers/byquestion/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const ans = await data.json();

    setAnswer(ans);
  }
  function toTheTop() {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    toTheTop();
    getQuestionDetail();

    getAnswers();
  }, [accessToken]);

  async function postAnswer(newAnswer) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newAnswer),
    });
    if (data.ok) {
      const newAns = await data.json();
      return newAns;
    } else {
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAnswer = {
      content: e.target.content.value,
      questionId: id,
      authorEmail: user.email,
    };

    await postAnswer(newAnswer);
    getQuestionDetail();
    getAnswers();

    // setAnswer([...answers, newAns]);

    e.target.reset();
  };

  return (
    <div>
      <div className="title">
      <img src={image} alt="Logo for the name of the company, it says Empty Stack" height={80} width={200} />
        
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrapper">
        <h3>{"Qestion title: " + question.title}</h3>
        {/* <span>{"Created at" + question.createdAt.slice(0, 10)}</span> */}
        <p>{"Qestion: " + question.content}</p>
      </div>
      <div className="wrapper">
        <h3>Answers:</h3>

        <ul className="answers">
          {answers.map((item) => {
            return (
              <li key={item.id} className="answer-item">
                <span className="itemName">{item.content}</span>
                <hr></hr>
              </li>
              
            );
          })}
        </ul>
      </div>
      <div className="wrapper">
        <form className="blog-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="formDiv">
            <textarea
            defaultValue=" "
              className="answerText"
              id="content"
              name="content"
              required
            >
             
            </textarea>
          </div>
          {!isAuthenticated ? (
            <button className="btn-primary" onClick={loginWithRedirect}>
              Login To Post Answer
            </button>
          ) : (
            <div>
              <input
                className="btn-primary"
                type="submit"
                value="Post Answer"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
