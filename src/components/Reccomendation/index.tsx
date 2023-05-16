import { Button, Skeleton } from "@mui/material";
import { useHeroesStore } from "../../App";

function Reccomendation() {
  const [isLoading, side, isError, setReccomendationPage] = useHeroesStore(
    (store) => [
      store.isLoading,
      store.side,
      store.isError,
      store.setReccomendationPage,
    ]
  );
  if (isLoading) {
    return (
      <div className="flex justify-center mt-[50px] w-full">
        <div className="w-[1036px] flex justify-center gap-[200px]">
          {side === "both sides" ? (
            <>
              <RecItemsSkeleton />
              <RecItemsSkeleton />
            </>
          ) : (
            <RecItemsSkeleton />
          )}
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full flex items-center mt-[40px] text-[#d32f2f] flex-col gap-[40px]">
        <div>Произошла ошибка на сервере. Повторите попытку позже.</div>
        <Button
          variant={"outlined"}
          className="w-[130px]"
          onClick={() => {
            setReccomendationPage(false);
          }}
        >
          На главную
        </Button>
      </div>
    );
  }
  return <div>Reccomendation</div>;
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

export default Reccomendation;
