import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { modalOpen: false, sidebar: { collapsed: true } },
  reducers: {
    toggleModal: (state) => {
      state.modalOpen = !state.modalOpen
    },
    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed
    },
  },
})

export const { toggleModal, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
