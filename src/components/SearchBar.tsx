import React, { useState } from "react";

const mockData = {
  movies: ["Inception", "Interstellar", "The Dark Knight"],
  actors: ["Leonardo DiCaprio", "Christian Bale", "Matthew McConaughey"],
  directors: ["Christopher Nolan", "Steven Spielberg", "Quentin Tarantino"],
};

type SearchResults = {
  movies: string[];
  actors: string[];
  directors: string[];
};

const SearchBar: React.FC = () => {
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
      const filteredResults: SearchResults = {
        movies: mockData.movies.filter((movie) =>
          movie.toLowerCase().includes(value)
        ),
        actors: mockData.actors.filter((actor) =>
          actor.toLowerCase().includes(value)
        ),
        directors: mockData.directors.filter((director) =>
          director.toLowerCase().includes(value)
        ),
      };
      setResults(filteredResults);
    } else {
      setResults({ movies: [], actors: [], directors: [] });
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
              <ul className="list-disc pl-5 text-gray-800">
                {results.movies.map((movie, index) => (
                  <li key={index}>{movie}</li>
                ))}
              </ul>
            </div>
          )}
          {results.actors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600 text-lg">Actors</h3>
              <ul className="list-disc pl-5 text-gray-800">
                {results.actors.map((actor, index) => (
                  <li key={index}>{actor}</li>
                ))}
              </ul>
            </div>
          )}
          {results.directors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600 text-lg">Directors</h3>
              <ul className="list-disc pl-5 text-gray-800">
                {results.directors.map((director, index) => (
                  <li key={index}>{director}</li>
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
