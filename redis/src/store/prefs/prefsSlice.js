import { createSlice } from '@reduxjs/toolkit'

const prefsSlice = createSlice({
  name: 'prefs',
  initialState: { theme: 'light', locale: 'en' },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setLocale: (state, action) => {
      state.locale = action.payload
    },
  },
})

export const { setTheme, setLocale } = prefsSlice.actions
export default prefsSlice.reducer
