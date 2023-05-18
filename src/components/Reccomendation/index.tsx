import { Button, Skeleton } from "@mui/material";
import { useHeroesStore } from "../../App";
import { HEROES } from "../../heroes";
import { useMemo } from "react";

function Reccomendation() {
  const [isLoading, isError, heroes] = useHeroesStore((store) => [
    store.isLoading,
    store.isError,
    store.reccomendedHeroes,
  ]);

  if (isError) {
    return (
      <div className="w-full flex items-center mt-[40px] text-[#d32f2f] flex-col gap-[40px]">
        <div>Server error.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-[50px] w-full">
      <div className="w-[1036px] flex justify-center gap-[200px]">
        {isLoading ? (
          heroes.side === "both sides" ? (
            <>
              <RecItemsSkeleton />
              <RecItemsSkeleton />
            </>
          ) : (
            <RecItemsSkeleton />
          )
        ) : heroes.side === "both sides" ? (
          <>
            <RecHeroes
              side={"Radiant"}
              heroes={heroes.recommendedRadiantPicks}
            />
            <RecHeroes side={"Dire"} heroes={heroes.recommendedDirePicks} />
          </>
        ) : (
          <>
            <RecHeroes
              side={heroes.side}
              heroes={
                heroes.side === "Dire"
                  ? heroes.recommendedDirePicks
                  : heroes.recommendedRadiantPicks
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

const RecItemsSkeleton = () => {
  return (
    <div className="flex flex-col gap-[12px]">
      {[1, 2, 3, 4].map(() => (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={380}
          height={80}
          style={{ borderRadius: "10px" }}
        />
      ))}
    </div>
  );
};

const RecHeroes = ({
  heroes,
  side,
}: {
  heroes: { heroId: number; winProbability: number }[];
  side: "Radiant" | "Dire";
}) => {
  const [radiant, dire, setHeroe, deleteHeroe] = useHeroesStore((store) => [
    store.radiant,
    store.dire,
    store.setHeroe,
    store.deleteHeroe,
  ]);

  const matchHeroeId = useMemo(() => {
    if (side === "Radiant") {
      const filtered = heroes.filter((item) => radiant.includes(item.heroId));
      if (filtered.length === 0) {
        return null;
      } else {
        return filtered[0].heroId;
      }
    } else {
      const filtered = heroes.filter((item) => dire.includes(item.heroId));
      if (filtered.length === 0) {
        return null;
      } else {
        return filtered[0].heroId;
      }
    }
  }, [radiant, dire]);

  return (
    <div className="flex flex-col gap-[12px]">
      <span>Reccomendation for {side}</span>
      <div className=" gap-[12px] max-h-[400px] overflow-auto">
        {heroes.map((i) => (
          <div className="w-[380px] h-[60px] flex items-center bg-[#1F1F1F] rounded-[10px] px-[12px] mb-[12px]">
            <img
              height={45}
              width={70}
              src={
                "heroes/" +
                HEROES.find((item) => item.id === i.heroId)?.img.replace(
                  "_sb",
                  "_lg"
                )
              }
              alt={HEROES.find((item) => item.id === i.heroId)?.localized_name}
            />
            <span className="ml-[12px] flex-grow">
              {HEROES.find((item) => item.id === i.heroId)?.localized_name}
            </span>
            {matchHeroeId === i.heroId ? (
              <Button
                variant="outlined"
                onClick={() => {
                  deleteHeroe(i.heroId, side === "Dire" ? "dire" : "radiant");
                }}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                disabled={matchHeroeId !== null}
                onClick={() => {
                  setHeroe(i.heroId, side === "Dire" ? "dire" : "radiant");
                }}
              >
                Add
              </Button>
            )}
            <span className="ml-[10px]">
              {Math.round(i.winProbability * 100) + "%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reccomendation;
