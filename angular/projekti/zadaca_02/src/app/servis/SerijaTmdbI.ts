export interface SerijeTmdbI {
    page: number;
    results: Array<SerijaTmdbI>;
    total_pages: number;
    total_results: number;
  }
  export interface SerijaTmdbI {
    adult: boolean;
    backdrop_path: string;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    episode_count: number;
  }
  