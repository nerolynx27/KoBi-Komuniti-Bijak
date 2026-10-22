import { createContext, useContext } from 'react';

const FrameStyle = createContext('current');

export function FrameStyleProvider({ value, children }) {
  return <FrameStyle.Provider value={value}>{children}</FrameStyle.Provider>;
}

export function useFrameStyle() { return useContext(FrameStyle); }
