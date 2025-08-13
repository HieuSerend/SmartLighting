import { create } from 'zustand';

export type LightMode = 'white' | 'rgb';

export interface LightState {
  online: boolean;
  on: boolean;
  mode: LightMode;
  brightness: number;      // 0-100
  cct: number;             // 2700-6500
  color: { h: number; s: number; v: number }; // HSV

  // actions
  hydrateFromDevice: (s: Partial<LightState>) => void;
  setOn: (v: boolean, publish?: boolean) => void;
  setBrightness: (v: number, publish?: boolean) => void;
  setCct: (k: number, publish?: boolean) => void;
  setColorHSV: (h:number,s:number,v:number, publish?: boolean) => void;
  setMode: (m: LightMode, publish?: boolean) => void;
}

const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export const useLightStore = create<LightState>((set,get)=>({
  online: true,
  on: true,
  mode: 'white',
  brightness: 80,
  cct: 4000,
  color: { h: 20, s: 0.5, v: 1 },

  hydrateFromDevice: (s) => set((st) => ({ ...st, ...s })),

  setOn: (v, publish) => {
    set({ on: v });
    if (publish) require('../mqtt/client').publishSet({ on: v });
  },

  setBrightness: (v, publish) => {
    const val = Math.round(clamp(v,0,100));
    set({ brightness: val });
    if (publish) require('../mqtt/client').publishSet({ brightness: val });
  },

  setCct: (k, publish) => {
    const val = Math.round(clamp(k,2700,6500));
    set({ cct: val, mode: 'white' });
    if (publish) require('../mqtt/client').publishSet({ mode:'white', cct: val });
  },

  setColorHSV: (h,s,v, publish) => {
    const color = { h, s:clamp(s,0,1), v:clamp(v,0,1) };
    set({ color, mode: 'rgb' });
    if (publish) require('../mqtt/client').publishSet({ mode:'rgb', color });
  },

  setMode: (m, publish) => {
    set({ mode: m });
    if (publish) require('../mqtt/client').publishSet({ mode: m });
  },
}));
