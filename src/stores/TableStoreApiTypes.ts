import type { pokemonEntryType } from './TableStoreTypes';

export type makeListType = Promise<{
    name: string;
    data: Array<pokemonEntryType>;
}>