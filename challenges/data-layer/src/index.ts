// challenge link: https://www.typescript-training.com/course/making-typescript-stick/04-data-layer-challenge/
export interface DataEntity {
  id: string;
}
export interface Movie extends DataEntity {
  director: string;
}
export interface Song extends DataEntity {
  singer: string;
}

export type DataEntityMap = {
  movie: Movie;
  song: Song;
};

/* Type guard example: isDefined of genericType T which takes in an argument of type T or could be undefined.
Special thing is return type (x is T): If function returned true x has to be of type T. If false else is not of type T
*/
function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== "undefined";
}

// below we are adding stuff
/**
 * Below we are looping through each key of DataEntityMap with keyof and transforming it to methods like getAllMovies, getAllSongs.
 * We return the type as a function which takes 0 arguments and returns an array of type Key for the first set of methods.
 * For 2nd set of methods we return a function that takes 1 argument called id of type string and returns data of type Key such as Movie, Song.
 * They are then clubbed together with &
 * TS Concepts used: mapped type, template literal type, indexed access type
 */
type DataStoreMethods = {
  [Key in keyof DataEntityMap as `getAll${Capitalize<Key>}s`]: () => DataEntityMap[Key][]; // getAll<Keys> => getAllSongs, getAllMovies
} & {
  [Key in keyof DataEntityMap as `get${Capitalize<Key>}`]: (
    id: string
  ) => DataEntityMap[Key]; // get<Key> => getMovie, getSong
} & {
  [Key in keyof DataEntityMap as `clear${Capitalize<Key>}s`]: () => void; // clear<Keys> => clearSongs, clearMovies
} & {
  [Key in keyof DataEntityMap as `add${Capitalize<Key>}`]: (
    arg: DataEntityMap[Key] // argument here has to be of type Movie, Song
  ) => DataEntityMap[Key]; // add<Key> => addMovie, addSong
};

// continueee.. implement this class and also define isDefined method (timestamp around 8th min mark of video: https://frontendmasters.com/courses/typescript-practice/typed-data-store-solution/)
export class DataStore implements DataStoreMethods {
  // # means field is private. Below data is private field and cannot be accessed by outside objects. We will provide methods to be accessible
  #data: { [Key in keyof DataEntityMap]: Record<string, DataEntityMap[Key]> } =
    {
      movie: {},
      song: {},
    };
  getAllSongs() {
    return Object.keys(this.#data.song)
      .map((songKey) => this.#data.song[songKey])
      .filter(isDefined);
  }
  getSong(songId: string) {
    const song = this.#data.song[songId];
    if (!song) throw new Error(`Could not find song with id ${songId}`);
    return song;
  }
  clearSongs(): void {
    this.#data.song = {};
  }
  getAllMovies() {
    return Object.keys(this.#data.movie)
      .map((movieKey) => this.#data.movie[movieKey])
      .filter(isDefined);
  }
  getMovie(movieId: string) {
    const movie = this.#data.movie[movieId];
    if (!movie) throw new Error(`Could not find movie with id ${movieId}`);
    return movie;
  }
  clearMovies(): void {
    this.#data.movie = {};
  }
  addMovie(movie: Movie): Movie {
    this.#data.movie[movie.id] = movie; // either it will overwrite or add a new id for that movie
    return movie;
  }
  addSong(song: Song): Song {
    this.#data.song[song.id] = song;
    return song;
  }
}
