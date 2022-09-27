export async function fetchData() {
  console.log("fetching data");
  let data = JSON.parse(localStorage.getItem("data"));

  if (!data) {
    data = await fetch(
      "https://itsjustdaniel.github.io/interactive-comment-section-main/data.json"
    );

    const res = await data.json();

    localStorage.setItem("data", JSON.stringify(res));

    return res;
  }

  console.log("data fetched");

  return data;
}
