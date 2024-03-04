import { ref } from 'vue';
import axios from 'axios';
import type { RawDataType, pokemonEntryType } from './TableStoreTypes';
import { capitalize } from 'lodash';

export const pokemonApiRange = {
  start: 1,
  end: 1025,
}

const getPokemonNames = async (listLength: number) => {
  // console.log('*** getPokemonNames()');
  const rawPokemonList = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${listLength}`);
  let pokemonNames: Array<string> = [];
  for (let i = 0; i < rawPokemonList.data.results.length; i++) {
    pokemonNames.push(rawPokemonList.data.results[i].name);
  }

  return pokemonNames;
};

const getPokemonTypes = (rawPokemonData: RawDataType) => {
  // console.log('*** getPokemonTypes()');
  const typesObject = rawPokemonData.data.types;

  // console.log('typesObject length: ' + typesObject.length + ' ' + typesObject);
  // console.log(typesObject);
  // console.log(typesObject[0].type.name);

  if (!typesObject[1]) {
    return capitalize(typesObject[0].type.name);
  } else {
    return capitalize(typesObject[0].type.name) + ', ' + capitalize(typesObject[1].type.name);
  }
};

const getIndividualPokemonData = async (pokemonName: string, index: number) => {
  // console.log('*** getIndividualPokemonData()');
  const rawPokemonData: RawDataType = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
  );
  // console.log(rawPokemonData);

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
  // console.log('*** getIndividualPokemonData() done. returning: ' + pokemonObject.name);
  return pokemonObject;
};

const createPokemonList = async (listLength: number): Promise<Array<pokemonEntryType>> => {
  // console.log('*** createPokemonList()');
  try {
    let tempPokemonList: Array<pokemonEntryType> = [];

    const pokemonNames = await getPokemonNames(listLength);

    for (const element of pokemonNames) {
      // console.log('Foreach loop, fetching data on: ' + element);
      const newPokemonEntry = await getIndividualPokemonData(
        element,
        pokemonNames.indexOf(element),
      );
      // console.log(element + ' found. Pushing: ' + newPokemonEntry);
      tempPokemonList.push(newPokemonEntry);
      // console.log('full list so far: ');
      // console.log(tempPokemonList);
    }
    // console.log('Loops done. Full list so far: ');
    // console.log(tempPokemonList);
    // console.log('*** createPokemonList() done. returning: ' + tempPokemonList);
    return tempPokemonList;
  } catch (error) {
    // console.log(error);
    return Promise.reject(error);
  }
};

export const makeList = async (listLength: number): Promise<Array<pokemonEntryType>> => {
  // console.log('*** makeList()');
  try {
    // console.log('*-- makeList() try block');

    let pokemonList: Array<pokemonEntryType> = [];
    let tempList = await createPokemonList(listLength);

    tempList.forEach((element) => {
      // console.log('pushing ' + element.name + ' to pokemonList');
      pokemonList.push(element);
    });

    // console.log('pokemonList pushing part done successfully!' + pokemonList);

    return pokemonList;
  } catch (error) {
    // console.log(error);
    return Promise.reject(error);
  }
};
