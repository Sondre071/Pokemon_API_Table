export type AcceptedTypes = string | number | undefined | bigint | null;
export type EntryObject = {
  [key: string]: AcceptedTypes;
};

export type TableDataType = {
  baseData: Array<EntryObject>;
  dataFields: Array<string>;
  renderedData: Array<EntryObject>;
  unsortedData: Array<EntryObject>;
  currentDropdowns: Array<AcceptedTypes>[];
};

export type BooleansType = {
  [key: string]: boolean;
};

export type InputsType = {
  entryEditIndex: undefined | number;
  entryEditBackup: EntryObject;
  filterInput: Array<AcceptedTypes>;
  searchInput: string;
};

export type SortingType = {
  currentSort: string;
  sortState: 'none' | 'ascending' | 'descending';
};

