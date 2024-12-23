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
  getActorMovieDeatils,
  getDirectorMovieDetails,
} from "../services/endpoints";
import { actor, director, movie } from "../services/endpoints/types";
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
  const [selectedActor, setSelectedActor] = useState<actor | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<director | null>(
    null
  );
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
  useEffect(() => {
    getActors(currentPageActor).then((response) => {
      setActors(Array.isArray(response.data) ? response.data : []);
    });
    getDirectors(currentPageDirector).then((response) => {
      setDirectors(Array.isArray(response.data) ? response.data : []);
    });
    getMovies(currentPageMovie).then((response) => {
      setMovies(Array.isArray(response.data) ? response.data : []);
    });
  }

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
          rank: selectedItem.rank,
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
        setSelectedActor(actorResponse.data);
        break;
      case "director":
        const directorResponse = await getDirector(id);
        setSelectedDirector(directorResponse.data);
        break;
      case "movie":
        const movieResponse = await getMovie(id);
        setSelectedMovie(movieResponse.data);
        break;
    }
  };

  useEffect(() => {
    getActors(currentPageActor).then((response) => {
      setActors(Array.isArray(response.data) ? response.data : []);
    });
    getDirectors(currentPageDirector).then((response) => {
      setDirectors(Array.isArray(response.data) ? response.data : []);
    });
    getMovies(currentPageMovie).then((response) => {
      setMovies(Array.isArray(response.data) ? response.data : []);
    });
  }, [currentPageDirector, currentPageActor, currentPageMovie]);

  const openDetails = (item: any) => {
    getDetails(item.type, item.id);
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
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition-all duration-300"
      >
        <FaPencilAlt className="inline-block w-4 h-4 mr-1" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-8 shadow-md">
        <h1 className="text-center text-4xl font-extrabold tracking-wide">
          IMDB Mock Frontend
        </h1>
      </header>
      <main className="px-5 mx-auto">
        <SearchBar />
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
            {selectedItem.first_name && (
              <>
                <div className="font-semibold text-gray-700">First Name:</div>
                <div>{selectedItem.first_name}</div>
              </>
            )}
            {selectedItem.last_name && (
              <>
                <div className="font-semibold text-gray-700">Last Name:</div>
                <div>{selectedItem.last_name}</div>
              </>
            )}
            {selectedItem.name && (
              <>
                <div className="font-semibold text-gray-700">Name:</div>
                <div>{selectedItem.name}</div>
              </>
            )}
            {selectedItem.year && (
              <>
                <div className="font-semibold text-gray-700">Year:</div>
                <div>{selectedItem.year}</div>
              </>
            )}
            {selectedItem.rank && (
              <>
                <div className="font-semibold text-gray-700">Rank:</div>
                <div>{selectedItem.rank}</div>
              </>
            )}
            {selectedItem.gender && (
              <>
                <div className="font-semibold text-gray-700">Gender:</div>
                <div>{selectedItem.gender}</div>
              </>
            )}
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
