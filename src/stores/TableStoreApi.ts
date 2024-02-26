import { ref } from 'vue';
import type { Ref } from 'vue';
import axios from 'axios';
import type { RawDataType, PokemonEntry } from './TableStoreTypes';
import { capitalize, startCase } from 'lodash';

export const booleans = ref({
  apiDataLoaded: false,
});

const getPokemonNames = async () => {
  console.log('*** getPokemonNames()');
  const rawPokemonList = await axios.get('https://pokeapi.co/api/v2/pokemon/');
  let pokemonNames: Array<string> = [];
  for (let i = 0; i < rawPokemonList.data.results.length; i++) {
    pokemonNames.push(rawPokemonList.data.results[i].name);
  }

  return pokemonNames;
};

const getPokemonTypes = (rawPokemonData: RawDataType) => {
  console.log('*** getPokemonTypes()');
  const typesObject = rawPokemonData.data.types;

  console.log('typesObject length: ' + typesObject.length + ' ' + typesObject);
  console.log(typesObject);
  console.log(typesObject[0].type.name);

  if (!typesObject[1]) {
    return capitalize(typesObject[0].type.name);
  } else {
    return capitalize(typesObject[0].type.name) + ', ' + capitalize(typesObject[1].type.name);
  }
};

const getIndividualPokemonData = async (pokemonName: string, index: number) => {
  console.log('*** getIndividualPokemonData()');
  const rawPokemonData: RawDataType = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
  );
  console.log(rawPokemonData);

  const pokemonHeight = rawPokemonData.data.height;
  const pokemonTypes = getPokemonTypes(rawPokemonData);
  const pokemonIndex = index;
  // optional: abilities,
  const pokemonObject = {
    name: capitalize(pokemonName),
    types: pokemonTypes,
    height: pokemonHeight,
    pokedexIndex: pokemonIndex,
  };
  console.log('*** getIndividualPokemonData() done. returning: ' + pokemonObject.name);
  return pokemonObject;
};

const createPokemonList = async (): Promise<Array<PokemonEntry>> => {
  console.log('*** createPokemonList()');
  try {
    let tempPokemonList: Array<PokemonEntry> = [];

    const pokemonNames = await getPokemonNames();

    for (const element of pokemonNames) {
      console.log('Foreach loop, fetching data on: ' + element);
      const newPokemonEntry = await getIndividualPokemonData(
        element,
        pokemonNames.indexOf(element),
      );
      console.log(element + ' found. Pushing: ' + newPokemonEntry);
      tempPokemonList.push(newPokemonEntry);
      console.log('full list so far: ');
      console.log(tempPokemonList);
    }
    console.log('Loops done. Full list so far: ');
    console.log(tempPokemonList);
    console.log('*** createPokemonList() done. returning: ' + tempPokemonList);
    return tempPokemonList;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

// begynn her. hver pokemon entry legges ikke til ordentlig. sjekk oreach her!
export const makeList = async (): Promise<Array<PokemonEntry>> => {
  console.log('*** makeList()');
  try {
    console.log('*-- makeList() try block');

    let pokemonList: Array<PokemonEntry> = [];
    let tempList = await createPokemonList();
    booleans.value.apiDataLoaded = true;

    tempList.forEach((element) => {
      console.log('pushing ' + element.name + ' to pokemonList');
      pokemonList.push(element);
    });

    console.log('pokemonList pushing part done successfully!' + pokemonList);

    return pokemonList;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
