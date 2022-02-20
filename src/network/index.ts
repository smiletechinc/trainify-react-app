/* eslint-disable arrow-parens */
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/', // e.g. https://yourapi.com
    prepareHeaders: async headers => {
      // const user = await AsyncStorageService.getStoredData()
      // const hasUser = !!user && !!user!.userToken

      // if (hasUser) {
      //   headers.set('Authorization', `Token ${user.userToken}`)
      // }

      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  endpoints: builder => ({
    GetPokemonByName: builder.query<any, string>({
      query: name => `pokemon/${name}`,
      transformResponse: response => {
        return response;
      },
    }),
  }),
  reducerPath: 'apiReducer',
  tagTypes: ['KalinatRehab'],
});
export const {useGetPokemonByNameQuery} = api;
