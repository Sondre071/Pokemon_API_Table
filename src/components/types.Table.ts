export type acceptedTypes = string | number | bigint | boolean | undefined | null
export type fieldsArrayType = Array<acceptedTypes>
export type entryObject = {
    [key: string]: acceptedTypes;
}
export type listDataType = {
    jsonData: Array<entryObject>;
    jsonKeys: Array<string>;
    modifiedJsonData: Array<entryObject>;
    rawData: Array<entryObject>;
};
export type inputsType = {
    expandDate: string;
    expandInput: fieldsArrayType;
    filterInput: fieldsArrayType;
    formInput: fieldsArrayType;
    modifyEntryInput: fieldsArrayType;
    searchInput: string;
}
export type sortingType = {
    currentSort: string;
    sortState: "none" | "ascending" | "descending";
}