var StarWarsMeta = {};

/**
 * Star Wars People (http://swapi.co/api/people)
 */
StarWarsMeta.people = function() {
  return {
    "birth_year": "string",
    "eye_color": "string",
    "films": "string",
    "gender": "string",
    "hair_color": "string",
    "height": "int",
    "homeworld": "string",
    "mass": "int",
    "name": "string",
    "skin_color": "string",
    "created": "datetime",
    "edited": "datetime",
    "species": "string",
    "starships": "string",
    "url": "string",
    "vehicles": "string"
  }
};

/**
 * Star Wars Films (http://swapi.co/api/films)
 */
StarWarsMeta.films = function() {
  return {
    "characters": "string",
    "created": "datetime",
    "director": "string",
    "edited": "datetime",
    "episode_id": "int",
    "opening_crawl": "string",
    "planets": "string",
    "producer": "string",
    "release_date": "datetime",
    "species": "string",
    "starships": "string",
    "title": "string",
    "url": "string",
    "vehicles": "string"
  }
};

/**
 * Star Wars Planets (http://swapi.co/api/planets)
 */
StarWarsMeta.planets = function() {
  return {
    "climate": "string",
    "created": "datetime",
    "diameter": "int",
    "edited": "datetime",
    "films": "string",
    "gravity": "float",
    "name": "string",
    "orbital_period": "int",
    "population": "int",
    "residents": "string",
    "rotation_period": "int",
    "surface_water": "int",
    "terrain": "string",
    "url": "string"
  }
};

/**
 * Star Wars Species (http://swapi.co/api/species)
 */
StarWarsMeta.species = function() {
  return {
    "average_height": "float",
    "average_lifespan": "int",
    "classification": "string",
    "created": "datetime",
    "designation": "string",
    "edited": "datetime",
    "eye_colors": "string",
    "hair_colors": "string",
    "homeworld": "string",
    "language": "string",
    "name": "string",
    "people": "string",
    "films": "string",
    "skin_colors": "gray",
    "url": "string"
  }
};

/**
 * Star Wars Starships (http://swapi.co/api/starships)
 */
StarWarsMeta.starships = function() {
  return {
    "MGLT": "string",
    "cargo_capacity": "int",
    "consumables": "string",
    "cost_in_credits": "int",
    "created": "datetime",
    "crew": "int",
    "edited": "datetime",
    "hyperdrive_rating": "float",
    "length": "float",
    "manufacturer": "string",
    "max_atmosphering_speed": "int",
    "model": "string",
    "name": "string",
    "passengers": "int",
    "films": "string",
    "pilots": "string",
    "starship_class": "string",
    "url": "string"
  }
};

/**
 * Star Wars Vehicles (http://swapi.co/api/vehicles)
 */
StarWarsMeta.vehicles = function() {
  return {
    "cargo_capacity": "int",
    "consumables": "string",
    "cost_in_credits": "int",
    "created": "datetime",
    "crew": "int",
    "edited": "datetime",
    "length": "float",
    "manufacturer": "string",
    "max_atmosphering_speed": "int",
    "model": "string",
    "name": "string",
    "passengers": "int",
    "pilots": "string",
    "films": "string",
    "url": "string",
    "vehicle_class": "string"
  }
};
