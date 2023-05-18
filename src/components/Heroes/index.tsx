import {
  Button,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from "@mui/material";
import { HEROES } from "../../heroes";
import { useHeroesStore } from "../../App";
import { useEffect, useState } from "react";

function Heroes({ search }: { search: string }) {
  const radiantHeroes = useHeroesStore((state) => state.radiant);
  const direHeroes = useHeroesStore((state) => state.dire);
  const banHeroes = useHeroesStore((state) => state.bans);

  const rFull = radiantHeroes.filter((item) => item !== null).length === 5;
  const dFull = direHeroes.filter((item) => item !== null).length === 5;

  useEffect(() => {
    localStorage.setItem("dire", JSON.stringify(direHeroes));
  }, [direHeroes]);

  useEffect(() => {
    localStorage.setItem("radiant", JSON.stringify(radiantHeroes));
  }, [radiantHeroes]);

  useEffect(() => {
    localStorage.setItem("bans", JSON.stringify(banHeroes));
  }, [banHeroes]);

  return (
    <div className="w-[1016px] flex justify-center flex-wrap gap-[8px] mb-[10px]">
      {HEROES.map((item) => (
        <Heroe
          heroe={item}
          chosen={
            radiantHeroes.includes(item.id) || direHeroes.includes(item.id)
          }
          ban={banHeroes.includes(item.id)}
          disabled={
            !item.localized_name
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
          }
          dFull={dFull}
          rFull={rFull}
        />
      ))}
    </div>
  );
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#1F1F1F",
    border: "1px solid #1976D2",
  },
});

const Heroe = ({
  heroe,
  disabled = false,
  chosen,
  ban,
  rFull,
  dFull,
}: { heroe: (typeof HEROES)[number] } & {
  disabled?: boolean;
  chosen: boolean;
  ban: boolean;
  rFull: boolean;
  dFull: boolean;
}) => {
  const setHeroe = useHeroesStore((store) => store.setHeroe);
  const addToBan = useHeroesStore((store) => store.addToBan);

  const handleSetRadiant = () => {
    setHeroe(heroe.id, "radiant");
  };
  const handleSetDire = () => {
    setHeroe(heroe.id, "dire");
  };
  const handleAddBan = () => {
    addToBan(heroe.id);
  };

  if (disabled) {
    return (
      <ProgressiveImg
        name={heroe.localized_name}
        placeholderSrc={"heroes/small/" + heroe.img}
        src={"heroes/" + heroe.img.replace("_sb", "_lg")}
        className="opacity-30"
      />
    );
  }
  if (chosen || ban) {
    return (
      <div className="relative overflow-hidden">
        <ProgressiveImg
          name={heroe.localized_name}
          placeholderSrc={"heroes/small/" + heroe.img}
          src={"heroes/" + heroe.img.replace("_sb", "_lg")}
        />
        <div
          className={`absolute h-[45px] w-[70px] ${
            ban ? "bg-[#d32f2f]" : "bg-[#2e7d32]"
          } opacity-60 left-[0px] top-[0px]`}
        />
      </div>
    );
  }
  return (
    <CustomTooltip
      title={
        <>
          <div className="flex items-center gap-[10px]">
            <img
              height={35}
              width={57}
              src={"heroes/small/" + heroe.img}
              alt={heroe.localized_name}
            />
            <span className="text-[16px]">{heroe.localized_name}</span>
          </div>
          <div className="flex mt-[12px] gap-[10px]">
            <Button
              title="pick radiant"
              variant="contained"
              onClick={handleSetRadiant}
              disabled={rFull}
            >
              PR
            </Button>
            <Button
              variant="outlined"
              onClick={handleSetDire}
              disabled={dFull}
              title="pick dire"
            >
              PD
            </Button>
            <Button variant="contained" color="error" onClick={handleAddBan}>
              BAN
            </Button>
          </div>
        </>
      }
    >
      <div>
        <ProgressiveImg
          name={heroe.localized_name}
          placeholderSrc={"heroes/small/" + heroe.img}
          src={"heroes/" + heroe.img.replace("_sb", "_lg")}
          className="cursor-pointer hover:scale-125"
        />
      </div>
    </CustomTooltip>
  );
};

const ProgressiveImg = ({
  placeholderSrc,
  src,
  name,
  className = "",
}: {
  placeholderSrc: string;
  src: string;
  name: string;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    setTimeout(() => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
      };
    }, 4000);
  }, [src]);

  return (
    <img height={45} width={70} src={imgSrc} alt={name} className={className} />
  );
};

export default Heroes;
