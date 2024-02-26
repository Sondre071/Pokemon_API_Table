export type StateType = {
  pokemonData: Array<PokemonEntry> | Array<string>;
  renderedPokemonData: Array<PokemonEntry> | Array<string>;

  dataFields: Array<string>;

  currentDropdowns: Array<string>;
  filters: Array<String>;
  search: string;

  currentEditIndex: undefined | string;
  currentEditBackup: undefined | PokemonEntry;

  booleans: {
    [key: string]: boolean;
  };
};

export type RawDataType = {
  data: {
    abilities: Array<PokemonAbilities>;
    height: number;
    name: string;
    weight: number;
    types: Array<PokemonTypes>;
  };
};

export type PokemonEntry = {
  name: string;
  types: string;
  height: number;
  pokedexIndex: number;
};

type PokemonAbilities = {
  [key: number]: {
    ability: {
      name: string;
      url: string;
    };
    isHidden: boolean;
    slot: number;
  };
};

type PokemonTypes = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};
