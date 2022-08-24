import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import image from '../logo.png';

export function QuestionForm({ id, getUserQuestions }) {
  const [updated, setUpdated] = useState(false);
  const { accessToken } = useAuthToken();
  const [question, setQuestion] = useState([]);
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

  async function updateQuesntion(updatedQuestion) {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/question/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedQuestion),
      }
    );
    if (data.ok) {
      const ques = await data.json();
      return ques;
    } else {
      return null;
    }
  }

  useEffect(() => {
    getQuestionDetail();
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedQuestion = {
      title: e.target.title.value,
      content: e.target.content.value,
      authorEmail: user.email,
    };
    await updateQuesntion(updatedQuestion);
    getUserQuestions();
    setUpdated(true);
  };

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  return true ? (
    <form className="blog-form" autoComplete="off" onSubmit={handleSubmit}>
      <div>
        <label for="title">Title: </label>
        <input
          type="text"
          name="title"
          id="title"
          value={question.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <textarea
          className="questionText"
          id="content"
          name="content"
          rows="5"
          value={question.content}
          onChange={handleChange}
          required
        >
          {" "}
        </textarea>
      </div>
      <div>
        <input type="submit" value="Update Question" />
      </div>
    </form>
  ) : (
    <div></div>
  );
}

export function AnswerForm({ id, getUserAnswers }) {
  const [updated, setUpdated] = useState(false);
  const { accessToken } = useAuthToken();
  const [answer, setAnswer] = useState([]);
  const { user } = useAuth0();

  async function getAnswerDetail() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/answer/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const ans = await data.json();

    setAnswer(ans);
  }

  async function updateAnswer(updatedAnswer) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/answer/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedAnswer),
    });
    if (data.ok) {
      const ans = await data.json();
      return ans;
    } else {
      return null;
    }
  }

  useEffect(() => {
    getAnswerDetail();
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAnswer = {
      content: e.target.content.value,
    };
    await updateAnswer(updatedAnswer);
    getUserAnswers();
    setUpdated(true);
  };

  const handleChange = (e) => {
    setAnswer({ ...answer, [e.target.name]: e.target.value });
  };

  return true ? (
    <form className="blog-form" autoComplete="off" onSubmit={handleSubmit}>
      <div>
        <textarea
        className="questionText"
          id="content"
          name="content"
          rows="5"
          value={answer.content}
          onChange={handleChange}
          required
        >
          {" "}
        </textarea>
      </div>
      <div>
        <input type="submit" value="Update Answer" />
      </div>
    </form>
  ) : (
    <div></div>
  );
}

export default function Profile() {
  let { id } = useParams();

  const { user } = useAuth0();
  const { accessToken } = useAuthToken();
  const [userInfo, setUserInfo] = useState([]);
  const [questionFormNum, setQuestionFormNum] = useState(0);
  const [answerFormNum, setAnswerFormNum] = useState(0);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  
  async function getUserInfo() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await data.json();

    setUserInfo(result);
  }

  async function getUserQuestions() {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/questions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = await data.json();

    setUserQuestions(result);
    setQuestionFormNum(0);
  }

  async function getUserAnswers() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/answers/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await data.json();

    setUserAnswer(result);
    setAnswerFormNum(0);
  }

  async function deleteQuestion(id) {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/question/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = await data.json();
  }

  async function deleteAnswer(id) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/answer/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await data.json();
  }

  async function updateUser(updatedUser) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedUser),
    });
    if (data.ok) {
      const user = await data.json();
      return user;
    } else {
      return null;
    }
  }


  async function handleDeleteQ(id) {
    await deleteQuestion(id);
    getUserQuestions();
    getUserAnswers();
  }

  async function handleDeleteA(id) {
    await deleteAnswer(id);
    getUserQuestions();
    getUserAnswers();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEditMode(false);

    const updatedUser = {
      name: e.target.content.value,
    };
    await updateUser(updatedUser);
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getUserInfo()
    getUserQuestions();
    getUserAnswers();
  }, [accessToken]);

  return (
    <div>
      <div className="title">
      <img src={image} alt="Logo for the name of the company, it says Empty Stack" height={80} width={200} />
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li >
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
      {!isAuthenticated ? (
        <p>Not loged in</p>
      ) : (
        <div>
        <div className="wrapper">
        <h3>{user.email}</h3>
          {editMode ? (
          <form className="blog-form" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <textarea
              id="content"
              name="name"
              rows="5"
              value={userInfo.name}
              onChange={handleChange}
              required
            >
              {" "}
            </textarea>
          </div>
          <div>
            <input type="submit" value="Update" />
          </div>
          </form>
        ):(
          <div>
            <p>Name: {userInfo.name}</p>
            <button className="btn-primary" onClick={() => {setEditMode(true)}}>
              Edit
            </button>
          </div>
        )}
      </div>
      <div className="wrapper">
        <h3>Your Questions</h3>
        <ul className="questions-profile">
          {userQuestions.map((item) => {
            return (
              <div className="questionItems" key={"question/"+item.id}>
                <li key={"question"+item.id}>
                <div className="answersItems">
                  <Link to={`/${item.id}`} className="itemName">
                    {item.title}
                  </Link>
                  </div>
                  <div className="answersItems">
                  <button
                    className="btn-primary"
                    value={item.id}
                    onClick={() => {
                      handleDeleteQ(item.id);
                    }}
                  >
                    Remove
                  </button>
                  </div>
                  <div className="answersItems">
                  <button
                    className="btn-primary"
                    value={item.id}
                    onClick={() => {
                      setQuestionFormNum(item.id);
                    }}
                  >
                    Edit
                  </button>
                  {questionFormNum == item.id ? (
                    <QuestionForm
                      id={item.id}
                      getUserQuestions={getUserQuestions}
                    />
                  ) : (
                    <div></div>
                  )}
                  </div>
                  <hr></hr>

                </li>
              </div>
            );
          })}
        </ul>
      </div>
      <div className="wrapper">
        <h3>Your Answers</h3>
        <ul className="questions-profile">
          {userAnswer.map((item) => {
            return (
              <li key={"answer" + item.id}>
                <div className="answersItems">
                  <Link to={`/${item.questionId}`} className="itemName">
                    {item.content}
                  </Link>
                </div>
                <div className="answersItems">
                  <button
                    className="btn-primary"
                    value={item.id}
                    onClick={() => {
                      handleDeleteA(item.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="answersItems">
                  <button
                    className="btn-primary"
                    value={item.id}
                    onClick={() => {
                      setAnswerFormNum(item.id);
                    }}
                  >
                    Edit
                  </button>
                  {answerFormNum == item.id ? (
                    <AnswerForm id={item.id} getUserAnswers={getUserAnswers} />
                  ) : (
                    <div></div>
                  )}
                </div>
                <hr></hr>
              </li>
            );
          })}
        </ul>
      </div>
      </div>
      )}
      
    </div>
  );
}
