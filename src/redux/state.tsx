import {useSelector, TypedUseSelectorHook} from 'react-redux';
import {UserState} from '../../types';

export interface RootState {
  routing: UserState;
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
