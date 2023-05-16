import React, { useState } from "react";
import { isFullChecker, useHeroesStore } from "../../App";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { HEROES } from "../../heroes";
import CloseIcon from "@mui/icons-material/Close";

const ROLES = [
  "Carry",
  "Midlaner",
  "Offlaner",
  "SemiSupport",
  "FullSupport",
] as const;

const Header = () => {
  const [role, setRole] = useState<(typeof ROLES)[number]>("Carry");
  const [
    radiant,
    dire,
    bans,
    isLoading,
    setLoading,
    clearAll,
    setReccomendationPage,
    reccomendationPage,
    side,
    setSide,
    allSides,
    setError,
  ] = useHeroesStore((state) => [
    state.radiant,
    state.dire,
    state.bans,
    state.isLoading,
    state.setLoading,
    state.clearHeroes,
    state.setReccomendationPage,
    state.reccomendationPage,
    state.side,
    state.setSide,
    state.allSides,
    state.setError,
  ]);

  const handleRecommend = async () => {
    setLoading(true);
    setReccomendationPage(true);
    try {
      await fetch("http://localhost:5000/api/Prediction", {
        method: "POST",
        body: JSON.stringify({
          radiantPicks: radiant
            .filter((item) => item !== null)
            .map((item, i) => ({ heroId: item, order: i })),
          direPicks: dire
            .filter((item) => item !== null)
            .map((item, i) => ({ heroId: item, order: i })),
          bans: bans.map((item) => ({ heroId: item })),
        }),
      });
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  const handleChangeSide = (
    event: SelectChangeEvent<"Radiant" | "Dire" | "both sides">
  ) => {
    setSide(event.target.value);
  };

  const handleChangeRole = (
    event: SelectChangeEvent<
      "Carry" | "Midlaner" | "Offlaner" | "SemiSupport" | "FullSupport"
    >
  ) => {
    setRole(event.target.value);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="h-[90px] flex justify-center items-center">
        <div className="flex justify-center gap-[60px] items-center">
          <div className="flex flex-col gap-[10px] items-center">
            <h2 className="text-[#2e7d32]">Radiant</h2>
            <div className="flex gap-[10px]">
              {radiant.map((item) => (
                <HeroeItem id={item} side="radiant" />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-[4px]">
            <button
              className="p-[4px] bg-[#1F1F1F]"
              onClick={() => {
                clearAll();
              }}
              disabled={reccomendationPage}
            >
              <img src={"/refresh.svg"} className="w-[24px] h-[24px]" />
            </button>
            <span className="text-[24px]">VS</span>
          </div>
          <div className="flex flex-col gap-[10px] items-center">
            <h2 className="text-[#d32f2f]">Dire</h2>
            <div className="flex gap-[10px]">
              {dire.map((item) => (
                <HeroeItem id={item} side="dire" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[10px] justify-center max-w-[1000px] flex-wrap mt-[30px]">
        {bans.map((item) => (
          <HeroeItem id={item} side="ban" />
        ))}
      </div>
      <div className="relative mt-[22px]">
        <LoadingButton
          variant="contained"
          onClick={handleRecommend}
          loading={isLoading}
          disabled={
            (isFullChecker(radiant) && isFullChecker(dire)) ||
            reccomendationPage
          }
        >
          Recommend
        </LoadingButton>
        {!reccomendationPage && (
          <div className="absolute -right-[320px] top-[4px] flex gap-[12px] items-baseline w-[300px]">
            <span className="text-[gray]">for</span>
            <FormControl variant="standard">
              <Select
                sx={{
                  color: "gray",
                  "& .MuiSvgIcon-root": {
                    fill: "gray",
                  },
                }}
                labelId="demo-simple-select-standard-label"
                value={role}
                onChange={handleChangeRole}
              >
                {ROLES.map((role) => (
                  <MenuItem value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {allSides !== null && side !== null && Array.isArray(allSides) ? (
              <FormControl variant="standard">
                <Select
                  sx={{
                    color: "gray",
                    "& .MuiSvgIcon-root": {
                      fill: "gray",
                    },
                  }}
                  value={side}
                  onChange={handleChangeSide}
                >
                  {allSides.map((side) => (
                    <MenuItem value={side}>{side}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              side
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HeroeItem = ({
  id,
  side,
}: {
  id: number | null;
  side: "radiant" | "dire" | "ban";
}) => {
  const rec = useHeroesStore((item) => item.reccomendationPage);
  const deleteHeroe = useHeroesStore((store) => store.deleteHeroe);
  const deleteFromBan = useHeroesStore((store) => store.deleteFromBans);
  const [closable, setClosable] = useState(false);

  const handleDelete = () => {
    if (id && !rec) {
      if (side === "dire" || side === "radiant") {
        deleteHeroe(id, side);
      } else {
        deleteFromBan(id);
      }
      setClosable(false);
    }
  };

  if (!id) {
    return <div className={`w-[80px] h-[45px] bg-[#1F1F1F] rounded-[10px]`} />;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setClosable(true);
      }}
      onMouseLeave={() => {
        setClosable(false);
      }}
    >
      <div
        className={`w-[80px] relative h-[45px] bg-[#1F1F1F] rounded-[10px] overflow-hidden ${
          side === "ban" && "w-[60px] h-[35px] border-[#d32f2f] border-[2px]"
        }`}
      >
        <img src={"heroes/" + HEROES.find((item) => item.id === id)?.img} />
      </div>
      {side !== "ban" && (
        <span className="absolute top-[45px] text-center w-full">
          {HEROES.find((item) => item.id === id)?.localized_name}
        </span>
      )}
      {closable && !rec && (
        <div className="absolute -left-[5px] -top-[5px] bg-[gray] w-[24px] h-[24px] rounded-[1000px] cursor-pointer flex justify-center items-center">
          <CloseIcon
            onClick={handleDelete}
            style={{ fill: "white", width: "16px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Header;