import { deleteData } from "./deleteData.js";
import { fetchDataSync } from "./fetchDataSync.js";

export const deleteButton = (el) => {
  el.addEventListener("click", (e) => {
    const data = fetchDataSync();

    console.log(el);
    console.log(el.parentNode.parentNode.dataset.id);
    const newData = deleteData(el.parentNode.parentNode.dataset.id, data);

    el.parentNode.parentNode.remove();
    console.log(newData);
    localStorage.setItem("data", JSON.stringify(newData));
  });
};
