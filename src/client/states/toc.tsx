import { create } from "zustand";

export const TocVisibility = {
    Invisible: 0,
    Visible: 1,
    Top: 2,
};

export type TocVisibility = number;

type TocState = {
    current?: string;
    state: {
        label: string;
        id: string;
        level: number;
        visible: TocVisibility;
    }[];
    scroll(id: string): void;
    push(label: string, id: string, level: number):number;
    update(index: number, visible: TocVisibility): void;
};

export const useToc = create<TocState>((set,get) => ({
    state: [],
    push(label, id, level) {
        const { state } = get();
        set({
            state: [
                ...state,
                {
                    label,
                    level,
                    id,
                    visible: TocVisibility.Invisible
                }
            ]
        });
        return state.length;
    },
    scroll(current) {
        set({ current });
    },
    update(index, visible) {
        const { state } = get();
        if (state[index].visible === visible) {
            return;
        }

        if (visible ===  TocVisibility.Visible) {
            state[index].visible = visible;
            return set({ state });
        }

        if (visible === TocVisibility.Top) {
            state[index].visible = visible;

            let i = index - 1;
            while(i >= 0) {
                state[i].visible = TocVisibility.Invisible;
                i--;
            }

            // @ts-ignore
            set({ state }, true);
        }
    }
}));