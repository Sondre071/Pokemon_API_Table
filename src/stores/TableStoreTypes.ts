export type RawDataType = {
  data: {
    abilities: Array<PokemonAbilities>
    height: number
    name: string
    weight: number
    types: Array<PokemonTypes>
  }
}

export type PokemonEntry = {
    name: string
    types: Array<string>
    height: number
    pokedexIndex: number
}

type PokemonAbilities = {
  [key: number]: {
    ability: {
      name: string
      url: string
    }
    isHidden: boolean
    slot: number
  }
}

type PokemonTypes = {
    slot: number
    type: {
      name: string
      url: string
    }
}
