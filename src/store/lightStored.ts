import { create } from 'zustand';

// export type LightMode = 'white' | 'rgb';

export interface LightState {
  online: boolean;
  on: boolean;
  // mode: LightMode;
  brightness: number;      // 0-100
  colorTemperature: number;             // 2700-6500
  colorCode: string;

  // actions
  hydrateFromDevice: (s: Partial<LightState>) => void;
  setOn: (v: boolean, publish?: boolean) => void;
  setBrightness: (v: number, publish?: boolean) => void;
  setColorTemperature: (k: number, publish?: boolean) => void;
  setColorCode: (code:string, publish?: boolean) => void;
  // setMode: (m: LightMode, publish?: boolean) => void;
}

const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export const useLightStore = create<LightState>((set,get)=>({
  online: true,
  on: true,
  // mode: 'white',
  brightness: 80,
  colorTemperature: 4000,
  colorCode: '#000000',

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

  setColorTemperature: (k, publish) => {
    const val = Math.round(clamp(k,2700,6500));
    set({ colorTemperature: val });
    if (publish) require('../mqtt/client').publishSet({ colorTemperature: val });
  },

  setColorCode: (code, publish) => {
    set({ colorCode: code });
    if (publish) require('../mqtt/client').publishSet({ colorCode: code });
  },

  // setMode: (m, publish) => {  
  //   set({ mode: m });
  //   if (publish) require('../mqtt/client').publishSet({ mode: m });
  // },
}));
