import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialJars, IJar } from '../interfaces/Jar';

const initialState: IInitialJars = {
	jars: []
};

const JarsReducer = createSlice({
	name: 'jars',
	initialState,
	reducers: {
		setJars: (state, action: PayloadAction<IJar[]>) => {
			state.jars = action.payload;
		},
		addJar: (state, action: PayloadAction<IJar>) => {
			state.jars.push(action.payload);
		}
	}
});

export const { setJars, addJar } = JarsReducer.actions;
export default JarsReducer.reducer;
