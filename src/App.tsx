import "./App.css";
import Header from "./components/Header";
import { create } from "zustand";
import Heroes from "./components/Heroes/index.tsx";
import { InputAdornment, TextField } from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Reccomendation from "./components/Reccomendation";
import { getFromLocalStorage } from "./utils/localStorage.ts";
import { isArrayOfNumber, isArrayOfNumberOrNull } from "./utils/typeGuards.ts";

export const isFullChecker = (arr: (null | number)[]) => {
  return arr.filter((item) => item !== null).length === 5;
};

const SIDES = ["Radiant", "Dire", "both sides"] as const;
type TSides = (typeof SIDES)[number];

const startRadiant = getFromLocalStorage("radiant", isArrayOfNumberOrNull);
const startDire = getFromLocalStorage("dire", isArrayOfNumberOrNull);
const startBans = getFromLocalStorage("bans", isArrayOfNumber);

const fullRadiant = startRadiant ? isFullChecker(startRadiant) : false;
const fullDire = startDire ? isFullChecker(startDire) : false;

type THeroes = {
  isLoading: boolean;
  isError: boolean;
  side: TSides | null;
  allSides: null | string[] | string;
  radiant: (number | null)[];
  dire: (number | null)[];
  bans: number[];
  reccomendationPage: boolean;
  setError: (err: boolean) => void;
  setSide: (side: TSides) => void;
  setHeroe: (id: number, type: "radiant" | "dire") => void;
  deleteHeroe: (id: number, type: "radiant" | "dire") => void;
  deleteFromBans: (id: number) => void;
  addToBan: (id: number) => void;
  clearHeroes: () => void;
  setLoading: (res: boolean) => void;
  setReccomendationPage: (res: boolean) => void;
};

export const useHeroesStore = create<THeroes>((set) => ({
  side: fullRadiant
    ? fullDire
      ? null
      : "Dire"
    : fullDire
    ? "Radiant"
    : "both sides",
  allSides: fullRadiant
    ? fullDire
      ? null
      : "Dire"
    : fullDire
    ? "Radiant"
    : [...SIDES],
  setSide: (side) => {
    set(() => ({ side }));
  },
  setError: (err) => {
    set(() => ({ isError: err }));
  },
  isError: false,
  reccomendationPage: false,
  setReccomendationPage: (res: boolean) => {
    set(() => ({ reccomendationPage: res }));
  },
  isLoading: false,
  setLoading: (res: boolean) => {
    set(() => ({ isLoading: res }));
  },
  radiant: startRadiant || [null, null, null, null, null],
  dire: startDire || [null, null, null, null, null],
  clearHeroes: () => {
    set(() => ({
      radiant: [null, null, null, null, null],
      dire: [null, null, null, null, null],
      bans: [],
    }));
    localStorage.clear();
  },
  bans: startBans || [],
  deleteFromBans: (id) => {
    set((state) => {
      const newBans = state.bans.filter((item) => item !== id);
      return { bans: newBans };
    });
  },
  addToBan: (id) =>
    set((state) => {
      const newBans = [...state.bans];
      newBans.push(id);
      return { bans: newBans };
    }),
  setHeroe: (id, type) => {
    if (type === "radiant") {
      set((state) => {
        const nullIndex = state.radiant.indexOf(null);
        if (nullIndex === -1) {
          return {};
        }
        const newArray = [...state.radiant];
        newArray[nullIndex] = id;
        if (isFullChecker(newArray)) {
          if (state.side === "Radiant") {
            return { radiant: newArray, side: null, allSides: null };
          } else {
            return { radiant: newArray, side: "Dire", allSides: "Dire" };
          }
        }
        return { radiant: newArray };
      });
    } else {
      set((state) => {
        const nullIndex = state.dire.indexOf(null);
        if (nullIndex === -1) {
          return {};
        }
        const newArray = [...state.dire];
        newArray[nullIndex] = id;
        if (isFullChecker(newArray)) {
          if (state.allSides === "Dire") {
            return { dire: newArray, side: null, allSides: null };
          } else {
            return { dire: newArray, side: "Radiant", allSides: "Radiant" };
          }
        }
        return { dire: newArray };
      });
    }
  },
  deleteHeroe: (id, type) => {
    if (type === "radiant") {
      set((state) => {
        const findIndex = state.radiant.findIndex((item) => item === id);
        if (findIndex === -1) {
          return {};
        }
        const newArray = [...state.radiant];
        newArray[findIndex] = null;
        if (state.allSides === "Dire") {
          return {
            radiant: newArray,
            allSides: [...SIDES],
            side: "both sides",
          };
        } else if (state.allSides === null) {
          return { radiant: newArray, allSides: "Radiant", side: "Radiant" };
        }
        return { radiant: newArray };
      });
    } else {
      set((state) => {
        const findIndex = state.dire.findIndex((item) => item === id);
        if (findIndex === -1) {
          return {};
        }
        const newArray = [...state.dire];
        newArray[findIndex] = null;
        if (state.allSides === "Radiant") {
          return { dire: newArray, allSides: [...SIDES], side: "both sides" };
        } else if (state.allSides === null) {
          return { dire: newArray, allSides: "Dire", side: "Dire" };
        }
        return { dire: newArray };
      });
    }
  },
}));

function App() {
  const [nameSearch, setNameSearch] = useState("");
  const handleChangeSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    setNameSearch(event.target.value.trim());
  };
  const reccomendationPage = useHeroesStore(
    (state) => state.reccomendationPage
  );

  return (
    <>
      <Header />
      {reccomendationPage ? (
        <Reccomendation />
      ) : (
        <div className="w-vw flex items-center flex-col">
          <div>
            <div className="my-[12px]">
              <TextField
                label="Search by name"
                variant="standard"
                onChange={handleChangeSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Heroes search={nameSearch} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
