import { clientSahmat } from "../client";
import {
  actor,
  director,
  directorMovies,
  movie,
  movieDetails,
  role,
} from "./types";

export const getActors = async (currentPage: number) => {
  return clientSahmat.get<actor>("/actors", {
    page: currentPage,
    page_size: 10,
  });
};

export const getActorDeatils = async (id: number) => {
  return clientSahmat.get<movie>(`/actors/${id}/details`);
};

export const getDirectorDetails = async (id: number) => {
  return clientSahmat.get<directorMovies[]>(`/directors/${id}/movies`);
};
export const getMovieDetails = async (id: number) => {
  return clientSahmat.get<movieDetails>(`/movies/${id}/details`);
};

export const getDirectorMoviesCount = async (id: number) => {
  return clientSahmat.get<number>(`/directors/${id}/movies_count`);
};

export const getActor = async (id: number) => {
  return clientSahmat.get<actor>(`/actors/${id}`);
};

export const getDirectors = async (currentPage: number) => {
  return clientSahmat.get<director>("/directors", {
    page: currentPage,
    page_size: 10,
  });
};

export const getDirector = async (id: number) => {
  return clientSahmat.get<director>(`/directors/${id}`);
};

export const getMovie = async (id: number) => {
  return clientSahmat.get<movie>(`/movies/${id}`);
};

export const updateActor = async (actor_id: number, actor_data: actor) => {
  return clientSahmat.put(`/actors/${actor_id}`, actor_data);
};

export const getMovies = async (currentPage: number) => {
  return clientSahmat.get<movie>("/movies", {
    page: currentPage,
    page_size: 10,
  });
};

export const deleteActor = async (id: number) => {
  return clientSahmat.delete(`/actors/${id}`);
};

export const deleteDirector = async (id: number) => {
  return clientSahmat.delete(`/directors/${id}`);
};

export const deleteMovie = async (id: number) => {
  return clientSahmat.delete(`/movies/${id}`);
};

export const updateDirector = async (
  director_id: number,
  director_data: director
) => {
  return clientSahmat.put(`/directors/${director_id}`, director_data);
};

export const updateMovie = async (movie_id: number, movie_data: movie) => {
  return clientSahmat.put(`/movies/${movie_id}`, movie_data);
};

export const createActor = async (actor_data: actor) => {
  return clientSahmat.post("/actors", actor_data);
};

export const createDirector = async (director_data: director) => {
  return clientSahmat.post("/directors", director_data);
};

export const createMovie = async (movie_data: movie) => {
  return clientSahmat.post("/movies", movie_data);
};

export const getActorRoles = async (id: number) => {
  return clientSahmat.get<role[]>(`/actors/${id}/roles`);
};

export const getSortedActor = async () => {
  return clientSahmat.get<actor[]>("/actors/sorted");
};

export const searchActor = async (query: string) => {
  return clientSahmat.get<actor[]>("/actors/search", { q: query });
};

export const searchDirector = async (query: string) => {
  return clientSahmat.get<director[]>("/directors/search", { q: query });
};

export const getMoviesSortedByDate = async () => {
  return clientSahmat.get<movie[]>("/movies/sorted_by_date");
};

export const getMoviesSortedByRank = async () => {
  return clientSahmat.get<movie[]>("/movies/sorted_by_rank");
};

export const searchMovie = async (query: string) => {
  return clientSahmat.get<movie[]>("/movies/search", { name: query });
};

export const getGenres = async () => {
  return clientSahmat.get<string[]>("/genres");
};

export const getMoviesByGenre = async (genre: string, currentPage: number) => {
  return clientSahmat.get<movie[]>(`/movies/by_genre`, {
    genre,
    page: currentPage,
  });
};
