import React, { useState } from "react";

const apiUrl =
  "https://www.googleapis.com/customsearch/v1?key=AIzaSyCSdano1Mg7vbNR1uzYv3c24zzgF-BaeMM&cx=d57c591ce27174259&";

export default function SearchAPI({ setSearchResults, searchResults }) {
  const [search, setSearch] = useState("");

  const getSearchResults = (search) => {
    fetch(`${apiUrl}q=${search}`)
      .then((res) => res.json())
      .then((response) => {
        for (let i = 0; i < 10; i++) {
          setSearchResults((searchResults) => [
            ...searchResults,
            response.items[i].link,
          ]);
        }
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    getSearchResults(search);
    setSearchResults([]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>If can't find an answer here. Google it below!</label>
      <input
        className="question-Google"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="search-results">
        {searchResults.map((result, index) => (
          <li className="search-results" key={index}>
            <a href={`${result}`} target="_blank">
              {result}
            </a>{" "}
          </li>
        ))}
      </ul>
    </form>
  );
}
