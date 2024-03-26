import type { Ref } from 'vue';

export type ApiStateType = {
  name: string;
  status: 'none' | 'loading' | 'loaded' | 'error';
};

export type DataFieldsType = Ref<Array<string>>;

export type PokemonArrayType = Array<pokemonEntryType | BlankEntryType>

export type currentDropdownsType = Ref<Array<string[]>>;
export type activeFiltersType = Ref<Array<String>>;
export type SearchType = Ref<string>;
export type sortStateType = Ref<'none' | 'ascending' | 'descending'>;
export type sortFieldType = Ref<keyof DataFieldsType | undefined>;

export type currentEditIndexType = Ref<undefined | number>;
export type currentEditBackupType = Ref<undefined | pokemonEntryType>;

export type currentTableLengthType = Ref<number | undefined>;

export type booleansType = Ref<{
  [key: string]: boolean;
}>;

export type resetObjectType = {
  currentDropdowns: Array<string>;
  activeFilters: Array<string>;
  search: string;
  currentEditIndex: undefined | number;
  currentEditBackup: undefined | pokemonEntryType;
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

export type pokemonEntryType = {
  checkbox: boolean;
  name: string;
  types: string;
  height: number;
  pokedexIndex: number;
};

export type BlankEntryType = {
  [key: string]: string | number | boolean;
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
