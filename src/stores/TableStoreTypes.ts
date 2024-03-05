import type { Ref } from 'vue';
export type apiStateType = Ref<{
  name: string;
  status: 'none' | 'loading' | 'loaded' | 'error';
}>;

export type pokemonDataType = Ref<Array<pokemonEntryType | blankEntryType>>;

export type dataFieldsType = Ref<Array<string>>;

export type currentDropdownsType = Ref<Array<string[]>>;
export type activeFiltersType = Ref<Array<String>>;
export type searchType = Ref<string>;
export type sortStateType = Ref<'none' | 'ascending' | 'descending'>;
export type sortFieldType = Ref<keyof dataFieldsType | undefined>;

export type currentEditIndexType = Ref<undefined | number>;
export type currentEditBackupType = Ref<undefined | pokemonEntryType>;

export type pageCountType = Ref<number>;
export type pageNumberType = Ref<number>;
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
  name: string;
  types: string;
  height: number;
  pokedexIndex: number;
};

export type blankEntryType = {
  [key: string]: string | number;
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
