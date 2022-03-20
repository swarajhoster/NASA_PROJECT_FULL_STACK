const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const HabitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((r, re) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          HabitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        re(err);
      })
      .on("end", () => {
        console.log(`${HabitablePlanets.length} Habitable planets found!`);
        r();
      });
    });
  }

  function getAllPlanets() {
    return HabitablePlanets
  }

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
