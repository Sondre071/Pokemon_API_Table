import type { Ref } from 'vue';

export type pokemonDataType = Ref<Array<PokemonEntry>>;

export type dataFieldsType = Ref<Array<string>>;

export type currentDropdownsType = Ref<Array<string>>;
export type activeFiltersType = Ref<Array<String>>;
export type searchType = Ref<string>;
export type sortStateType = Ref<'none' | 'ascending' | 'descending'>;
export type sortFieldType = Ref<string>;

export type currentEditIndexType = Ref<undefined | number>;
export type currentEditBackupType = Ref<undefined | PokemonEntry>;

export type booleansType = Ref<{
  [key: string]: boolean;
}>;

export type resetObjectType = {
  currentDropdowns: Array<string>;
  activeFilters: Array<string>;
  search: string;
  currentEditIndex: undefined | number;
  currentEditBackup: undefined | PokemonEntry;
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
