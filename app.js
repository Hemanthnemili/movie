const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3001/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

convertMovieDbObjectToResponsive = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

convertDirectorDbObjectToResponsive = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT
      * 
    FROM 
      movie;`;
  const movieArray = await database.all(getMovieQuery);
  response.send(
    movieArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const createNewMovie = `
    INSERT INTO 
       movie(director_id, movie_name, lead_actor)
    VALUES
       ('${directorId}','${movieName}','${leadActor}');`;
  const newMovie = await database.run(createNewMovie);
  response.send("Movie Successfully Added");
});

app.get("/movies/:moviesId", async (request, response) => {
  const { movieId } = request.params;
  const getMovQuery = `
    SELECT
      *
    FROM 
      movie
    WHERE
      movie_id='${movieId}';`;
  const movArray = await database.get(getMovQuery);
  response.send(convertMovieDbObjectToResponsive(movArray));

app.put("/movies/:movieId", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updatedMovie = `
    UPDATE
      movie
    SET
      director_id='${directorId}',
      movie_name='${movieName}',
      leadActor='${leadActor}'
    WHERE
      movie_id='${movieId}';`;
  const movie = await database.run(updatedMovie);
  response.send("Movie Details Updated");
});

app.delete("/movies/:moviesId", async (request, response) => {
  const { movieId } = request.params;
  const DelMovie = `
    DELETE FROM
      movie
    WHERE
      movie_id='${movieId}';`;
  await database.run(DelMovie);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const directorsList = `
    SELECT 
      *
    FROM 
      director`;
  const directorArray = await database.get(directorsList);
  response.send(
    directorArray.map((eachDirector) =>
      convertDirectorDbObjectToResponsive(eachDirector)
    )
  );
});

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirMovie = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_name='${directorName}';`;
  const dirMovArray = await database.all(getDirMovie);
  response.send(
    dirMovArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

module.exports = app;
