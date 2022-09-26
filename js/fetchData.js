export async function fetchData() {
  let data = JSON.parse(localStorage.getItem("data"));
  if (!data) {
    data = await fetch(
      "http://127.0.0.1:5500/interactive-comments-section-main/data.json"
    );

    const res = await data.json();

    localStorage.setItem("data", JSON.stringify(res));

    return res;
  }
  return data;
}
