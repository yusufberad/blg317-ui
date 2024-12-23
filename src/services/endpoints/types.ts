export interface actor {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
}

export interface director {
  id: number;
  first_name: string;
  last_name: string;
}

export interface movie {
  id: number;
  name: string;
  year: number;
  rank: number;
}

export interface updateActor {
  actor_id: number;
  actor_data: {
    name: string;
    surname: string;
    gender: string;
  };
}

export interface updateDirector {
  director_id: number;
  director_data: {
    first_name: string;
    last_name: string;
  };
}

export interface updateMovie {
  movie_id: number;
  movie_name: string;
  movie_year: number;
  movie_rank: number;
}
