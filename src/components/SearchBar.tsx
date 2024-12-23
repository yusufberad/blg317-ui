import React, { useState } from "react";
import {
  searchMovie,
  searchActor,
  searchDirector,
} from "../services/endpoints";
import { movie, actor, director } from "../services/endpoints/types";

const mockData = {
  movies: ["Inception", "Interstellar", "The Dark Knight"],
  actors: ["Leonardo DiCaprio", "Christian Bale", "Matthew McConaughey"],
  directors: ["Christopher Nolan", "Steven Spielberg", "Quentin Tarantino"],
};

type SearchResults = {
  movies: movie[];
  actors: actor[];
  directors: director[];
};

interface SearchBarProps {
  getDetails: (item: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ getDetails }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResults>({
    movies: [],
    actors: [],
    directors: [],
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value) {
      searchMovie(value).then((res) => {
        const movies = res.data || [];

        setResults((prev) => ({ ...prev, movies }));
      });

      searchActor(value).then((res) => {
        const actors = res.data || [];

        setResults((prev) => ({ ...prev, actors }));
      });

      searchDirector(value).then((res) => {
        const directors = res.data || [];

        setResults((prev) => ({ ...prev, directors }));
      });
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search movies, actors, or directors..."
        value={query}
        onChange={handleSearch}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-md"
      />
      {query && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-10">
          {results.movies.length > 0 && (
            <div>
              <h3 className="font-semibold text-blue-600 text-lg">Movies</h3>
              <ul className="list-disc flex flex-col pl-5 text-gray-800 gap-2 max-h-[10rem] overflow-scroll ">
                {results.movies.map((movie, index) => (
                  <div className="flex justify-between">
                    <li key={index}>{movie.name}</li>
                    <button
                      className="p-2 bg-yellow-500 rounded-lg text-white"
                      onClick={() => getDetails(movie)}
                    >
                      Details
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
          {results.actors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600 text-lg">Actors</h3>
              <ul className="list-disc flex flex-col pl-5 text-gray-800 gap-2 max-h-[10rem] overflow-scroll ">
                {results.actors.map((actor, index) => (
                  <div className="flex justify-between">
                    <li key={index}>
                      {actor.first_name} {actor.last_name}
                    </li>
                    <button
                      className="p-2 bg-yellow-500 rounded-lg text-white"
                      onClick={() => getDetails(actor)}
                    >
                      Details
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
          {results.directors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600 text-lg">Directors</h3>
              <ul className="list-disc flex flex-col pl-5 text-gray-800 gap-2 max-h-[10rem] overflow-scroll ">
                {results.directors.map((director, index) => (
                  <div className="flex justify-between" key={index}>
                    <li>
                      {director.first_name} {director.last_name}
                    </li>
                    <button
                      className="p-2 bg-yellow-500 rounded-lg text-white"
                      onClick={() => getDetails(director)}
                    >
                      Details
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
