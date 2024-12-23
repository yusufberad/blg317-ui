import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import {
  getActors,
  getDirectors,
  getMovies,
  getActor,
  getDirector,
  getMovie,
  deleteActor,
  deleteDirector,
  deleteMovie,
  updateActor,
  updateDirector,
  updateMovie,
  createActor,
  createDirector,
  createMovie,
  getActorDeatils,
  getDirectorDetails,
  getMovieDetails,
  getActorRoles,
  getMoviesSortedByDate,
  getMoviesSortedByRank,
  getSortedActor,
  searchActor,
  searchMovie,
  getGenres,
  getMoviesByGenre,
} from "../services/endpoints";
import {
  actor,
  director,
  directorMovies,
  movie,
  movieDetails,
  role,
} from "../services/endpoints/types";
import Pagination from "@/components/Pagination";
import Modal from "../components/Modal"; // Modal import
import { MdDeleteForever } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<movie[]>([]);
  const [actors, setActors] = useState<actor[]>([]);
  const [directors, setDirectors] = useState<director[]>([]);
  const [currentPageDirector, setCurrentPageDirector] = useState(1);
  const [currentPageActor, setCurrentPageActor] = useState(1);
  const [currentPageMovie, setCurrentPageMovie] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [selectedDirector, setSelectedDirector] = useState<director | null>(
    null
  );
  const [actorRoles, setActorRoles] = useState<role[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<movieDetails | null>(null);
  const [movieActorList, setMovieActorList] = useState<actor[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSortedActor, setIsSortedActor] = useState(false);
  const [movieSort, setMovieSort] = useState<string>("");
  const movieSortOptions = ["rank", "date"];
  const [genres, setGenres] = useState<string[]>([]);
  const [directorsMovies, setDirectorsMovies] = useState<directorMovies[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [newDirector, setNewDirector] = useState<director>({
    id: 0,
    first_name: "",
    last_name: "",
  });
  const [newActor, setNewActor] = useState<actor>({
    id: 0,
    first_name: "",
    last_name: "",
    gender: "M",
  });
  const [newMovie, setNewMovie] = useState<movie>({
    id: 0,
    name: "",
    year: 0,
    movie_rank: 0,
  });

  useEffect(() => {
    getGenres().then((response) => {
      setGenres(Array.isArray(response.data) ? response.data : []);
    });
  }, []);

  const deleteItem = async (type: string, id: number) => {
    switch (type) {
      case "actor":
        await deleteActor(id);
        break;
      case "director":
        await deleteDirector(id);
        break;
      case "movie":
        await deleteMovie(id);
        break;
    }
  };

  const addDirector = async (data: director) => {
    console.log(data);
    await createDirector(data).then((response) => {
      if (response.status === 201) {
        setCurrentPageDirector(1);
      } else {
        alert("An error occurred while adding the director.");
      }
    });
  };

  const addActor = async (data: actor) => {
    await createActor(data).then((response) => {
      if (response.status === 201) {
        setCurrentPageActor(1);
      } else {
        alert("An error occurred while adding the actor.");
      }
    });
  };

  const addMovie = async (data: movie) => {
    console.log("test");
    console.log(data);
    await createMovie(data).then((response) => {
      if (response.status === 201) {
        setCurrentPageMovie(1);
      } else {
        alert("An error occurred while adding the movie.");
      }
    });
  };

  const updateItem = async (type: string, id: number, data: any) => {
    console.log(type, id, data);
    switch (type) {
      case "actor":
        await updateActor(id, {
          id: id,
          first_name: selectedItem.first_name,
          last_name: selectedItem.last_name,
          gender: selectedItem.gender,
        });
        setCurrentPageActor(1);
        break;
      case "director":
        await updateDirector(id, {
          id: id,
          first_name: selectedItem.first_name,
          last_name: selectedItem.last_name,
        });
        setCurrentPageDirector(1);
        break;
      case "movie":
        await updateMovie(id, {
          id: id,
          name: selectedItem.name,
          year: selectedItem.year,
          movie_rank: selectedItem.rank,
        });
        setCurrentPageMovie(1);
        break;
    }
  };

  const getDetails = async (type: string, id: number) => {
    console.log(type, id);
    switch (type) {
      case "actor":
        const actorResponse = await getActor(id);
        const actorRolesResponse = await getActorRoles(id);
        if (actorRolesResponse.data) {
          setActorRoles(actorRolesResponse.data);
        }
        setSelectedActor(actorResponse.data);
        break;
      case "director":
        const directorResponsed = await getDirector(id);
        setSelectedDirector(directorResponsed.data);
        const directorResponse = await getDirectorDetails(id);

        if (directorResponse.data) {
          // Gelen veriyi işle
          const processedMovies = directorResponse.data.map((movie) => ({
            ...movie,
            actors:
              typeof movie.actors === "string"
                ? JSON.parse(movie.actors)
                : movie.actors, // actors alanını JSON stringden listeye dönüştür
          }));

          // State'e kaydet
          setDirectorsMovies(processedMovies);
        }

        console.log(directorsMovies);
        break;
      case "movie":
        console.log(type);
        const movieResponse = await getMovieDetails(id);
        setSelectedMovie(movieResponse.data);
        if (movieResponse.data?.actor_ids) {
          movieResponse.data.actor_ids.forEach(async (actorId) => {
            const actorResponse = await getActor(actorId);
            if (actorResponse.data) {
              if (actorResponse.data) {
                if (actorResponse.data) {
                  setMovieActorList((prev) => [...prev, actorResponse.data]);
                }
              }
            }
          });
        }
        break;
    }
  };

  useEffect(() => {
    if (isSortedActor) {
      getSortedActor().then((response) => {
        setActors(Array.isArray(response.data) ? response.data : []);
      });
    } else {
      getActors(currentPageActor).then((response) => {
        setActors(Array.isArray(response.data) ? response.data : []);
      });
    }
    getDirectors(currentPageDirector).then((response) => {
      setDirectors(Array.isArray(response.data) ? response.data : []);
    });
    if (selectedGenre !== "") {
      getMoviesByGenre(selectedGenre, currentPageMovie).then((response) => {
        setMovies(Array.isArray(response.data) ? response.data : []);
      });
    } else if (movieSort === "rank") {
      getMoviesSortedByRank().then((response) => {
        setMovies(Array.isArray(response.data) ? response.data : []);
      });
    } else if (movieSort === "date") {
      getMoviesSortedByDate().then((response) => {
        setMovies(Array.isArray(response.data) ? response.data : []);
      });
    } else {
      getMovies(currentPageMovie).then((response) => {
        setMovies(Array.isArray(response.data) ? response.data : []);
      });
    }
  }, [
    currentPageDirector,
    currentPageActor,
    currentPageMovie,
    isSortedActor,
    movieSort,
    selectedGenre,
  ]);

  const openDetails = (item: any) => {
    console.log("testDetails");
    console.log(item);
    item.movie_rank
      ? getDetails("movie", item.id)
      : item.gender
      ? getDetails("actor", item.id)
      : getDetails("director", item.id);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const renderButtons = (item: any) => (
    <div className="flex justify-end space-x-3">
      <button
        onClick={() => openDetails(item)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
      >
        Details
      </button>
      <button
        onClick={() => {
          setSelectedDeleteItem(item);
          setIsDeleteModalOpen(true);
        }}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
      >
        <MdDeleteForever className="inline-block w-5 h-5 mr-1" />
      </button>
      <button
        onClick={() => {
          setSelectedItem(item);
          setIsUpdateModalOpen(true);
        }}
        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
      >
        <FaPencilAlt className="inline-block w-4 h-4 mr-1" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-8 shadow-md">
        <h1 className="text-center text-4xl font-extrabold tracking-wide">
          IMDB Mock Frontend
        </h1>
      </header>
      <main className="px-5 mx-auto">
        <SearchBar getDetails={openDetails} />

        <div className="relative w-full flex justify-start gap-10 mb-5">
          <h2 className="text-xl font-bold">Sort Actors :</h2>
          <button
            onClick={() => {
              setIsSortedActor(!isSortedActor);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
          >
            {isSortedActor ? "Unsort" : "Sort"}
          </button>
        </div>
        <div className="flex gap-10 mb-5">
          <h1 className="text-xl font-bold">Movies Genre:</h1>
          <select
            onChange={(e) => {
              setSelectedGenre(e.target.value);
            }}
          >
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex gap-10">
          <div>
            <h2 className="text-xl font-bold">Sort Movies By :</h2>
          </div>
          <div className="flex gap-2">
            {movieSortOptions.map((sortOption) => (
              <li
                key={sortOption}
                onClick={() => setMovieSort(sortOption)}
                className={`cursor-pointer w-fit text-white font-semibold py-1 px-3 rounded transition-all duration-300 ${
                  movieSort === sortOption ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                {sortOption}
              </li>
            ))}
            <li>
              <button
                onClick={() => setMovieSort("")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Clear
              </button>
            </li>
          </div>
        </ul>
        {/* add section */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-center font-bold text-3xl">Add Movie</h1>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    name: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Year"
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    year: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Rank"
                onChange={(e) =>
                  setNewMovie({
                    ...newMovie,
                    movie_rank: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />
              <button
                onClick={() => {
                  console.log(newMovie);
                  addMovie(newMovie);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Add Movie
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-center font-bold text-3xl">Add Actor</h1>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="First Name"
                onChange={(e) =>
                  setNewActor({
                    ...newActor,
                    first_name: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                onChange={(e) =>
                  setNewActor({
                    ...newActor,
                    last_name: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <select
                onChange={(e) =>
                  setNewActor({
                    ...newActor,
                    gender: e.target.value,
                  })
                }
              >
                Gender:
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              <button
                onClick={() => addActor(newActor)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Add Actor
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-center font-bold text-3xl">Add Director</h1>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="First Name"
                onChange={(e) =>
                  setNewDirector({
                    ...newDirector,
                    first_name: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                onChange={(e) =>
                  setNewDirector({
                    ...newDirector,
                    last_name: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
              <button
                onClick={() => addDirector(newDirector)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Add Director
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* Movies */}
          <SectionCard
            title="Movies"
            icon={<div>🎬</div>}
            items={movies}
            renderItem={(movie, index) => (
              <tr key={index}>
                <td>
                  {movie.name} ({movie.year})
                </td>
                <td>{renderButtons(movie)}</td>
              </tr>
            )}
            paginationProps={{
              currentPage: currentPageMovie,
              totalPages: 10,
              onPageChange: setCurrentPageMovie,
            }}
          />
          {/* Actors */}

          <SectionCard
            title="Actors"
            icon={<div>🎭</div>}
            items={actors}
            renderItem={(actor, index) => (
              <tr key={index}>
                <td>
                  {actor.first_name} {actor.last_name}
                </td>
                <td>{renderButtons(actor)}</td>
              </tr>
            )}
            paginationProps={{
              currentPage: currentPageActor,
              totalPages: 10,
              onPageChange: setCurrentPageActor,
            }}
          />
          {/* Directors */}
          <SectionCard
            title="Directors"
            icon={<div>🎥</div>}
            items={directors}
            renderItem={(director, index) => (
              <tr key={index}>
                <td>
                  {director.first_name} {director.last_name}
                </td>
                <td>{renderButtons(director)}</td>
              </tr>
            )}
            paginationProps={{
              currentPage: currentPageDirector,
              totalPages: 10,
              onPageChange: setCurrentPageDirector,
            }}
          />
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {selectedItem && selectedItem.name} Details
        </h2>
        {selectedItem && (
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {selectedItem.name ? (
              <>
                <div className="font-semibold text-gray-700">Name:</div>
                <p>{selectedMovie?.name}</p>
                <div className="font-semibold text-gray-700">Year:</div>
                <p>{selectedMovie?.year}</p>
                <div className="font-semibold text-gray-700">Rank:</div>
                <p>{selectedMovie?.movie_rank}</p>
                {selectedMovie?.genres ? (
                  <>
                    <div className="font-semibold text-gray-700">Genres:</div>
                    <p>{selectedMovie?.genres.join(", ")}</p>
                  </>
                ) : (
                  <div className="font-semibold text-gray-700">
                    Genres: Not Available
                  </div>
                )}
                {selectedMovie?.actor_ids &&
                selectedMovie?.actor_ids.length > 0 ? (
                  <>
                    <div className="font-semibold text-gray ">Actors:</div>
                    <ul className="max-h-[20rem] overflow-scroll">
                      {movieActorList.map((actor) => (
                        <li key={actor.id}>
                          {actor.first_name} {actor.last_name}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="font-semibold text-gray-700">
                    Actors: Not Available
                  </div>
                )}
              </>
            ) : selectedItem.gender ? (
              <>
                <div className="font-semibold text-gray-700">Name:</div>
                <p>
                  {selectedActor?.first_name} {selectedActor?.last_name}
                </p>
                <div className="font-semibold text-gray-700">Roles:</div>
                <div className="h-[20vw] overflow-y-scroll">
                  <table className="w-full border-collapse">
                    <thead className="sticky">
                      <tr>
                        <th className="text-left px-4 py-2 border">Movie</th>
                        <th className="text-left px-4 py-2 border">-</th>
                        <th className="text-left px-4 py-2 border">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actorRoles.map((role, index) => (
                        <tr key={index} className="border">
                          <td className="px-4 py-2">{role.movie}</td>
                          <td className="px-4 py-2">-</td>
                          <td className="px-4 py-2">{role.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-gray-700">Name:</div>
                <p>
                  {selectedDirector?.first_name} {selectedDirector?.last_name}
                </p>
                <div className="font-semibold text-gray-700">Movies:</div>
                <ul className="max-h-[20rem] overflow-scroll">
                  {directorsMovies.map((movie, index) => (
                    <li key={index} className="border-[1px] borde-gray">
                      <div className="flex font-bold text-2xl">
                        <h1>Movie Name :</h1>
                        <h1>
                          {movie.name} ({movie.year})
                        </h1>
                      </div>

                      <div className="flex">
                        <h1>Rank:</h1>
                        <h1>{movie.movie_rank}</h1>
                      </div>
                      <ul className="flex flex-col">
                        <h1 className="font-bold text-xl">Actors:</h1>
                        {movie.actors.map((actor, index) => (
                          <li key={index}>
                            {actor.first_name} {actor.last_name}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/*Delete Button*/}
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedDeleteItem(selectedItem);
                  setIsDeleteModalOpen(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Delete Confirmation
          </h2>
          <p className="text-gray-600">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={async () => {
                await deleteItem(
                  selectedDeleteItem.gender
                    ? "actor"
                    : selectedDeleteItem.first_name
                    ? "director"
                    : "movie",
                  selectedDeleteItem.id
                );
                setIsDeleteModalOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
            >
              Yes
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Update {selectedItem && selectedItem.name}
          </h2>
          <p className="text-gray-600">
            Update the details of the selected item.
          </p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {selectedItem && selectedItem.first_name && (
              <>
                <div className="font-semibold text-gray-700">First Name:</div>
                <input
                  type="text"
                  defaultValue={selectedItem.first_name}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      first_name: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
            {selectedItem && selectedItem.last_name && (
              <>
                <div className="font-semibold text-gray-700">Last Name:</div>
                <input
                  type="text"
                  defaultValue={selectedItem.last_name}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      last_name: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
            {selectedItem && selectedItem.name && (
              <>
                <div className="font-semibold text-gray-700">Name:</div>
                <input
                  type="text"
                  defaultValue={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      name: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
            {selectedItem && selectedItem.year && (
              <>
                <div className="font-semibold text-gray-700">Year:</div>
                <input
                  type="text"
                  defaultValue={selectedItem.year}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      year: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
            {selectedItem && selectedItem.rank && (
              <>
                <div className="font-semibold text-gray-700">Rank:</div>
                <input
                  type="text"
                  defaultValue={selectedItem.rank}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      rank: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
            {selectedItem && selectedItem.gender && (
              <>
                <div className="font-semibold text-gray-700">Gender:</div>
                <input
                  type="text"
                  value={selectedItem.gender}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                    })
                  }
                  className="border p-2 rounded"
                />
              </>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={async () => {
                console.log(selectedItem);
                await updateItem(
                  selectedItem.gender
                    ? "actor"
                    : selectedItem.first_name
                    ? "director"
                    : "movie",
                  selectedItem.id,
                  selectedItem
                );
                console.log("Updated");
                setIsUpdateModalOpen(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
            >
              Update
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// SectionCard Component
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  paginationProps: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  items,
  renderItem,
  paginationProps,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-4">
    <div className="flex items-center mb-4">
      <div>{icon}</div>
      <h2 className="ml-2 text-xl font-bold">{title}</h2>
    </div>
    <table className="w-full">
      <tbody>{items.map((item, index) => renderItem(item, index))}</tbody>
    </table>
    <Pagination {...paginationProps} />
  </div>
);

export default HomePage;
