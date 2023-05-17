import fs from "fs";

const URL = "https://api.opendota.com/api/heroes";

const addImages = (images) => {
  images.forEach((item) => {
    item.img = item.name.replace("npc_dota_hero_", "") + "_lg.png";
  });
  return images;
};

fetch(URL)
  .then((result) => result.json())
  .then((result) => {
    fs.writeFile("./heroes3.json", JSON.stringify(addImages(result)), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
