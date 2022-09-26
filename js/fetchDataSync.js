export function fetchDataSync() {
  let data = JSON.parse(localStorage.getItem("data"));
  if (!data) {
    data = fetch(
      "http://127.0.0.1:5500/interactive-comments-section-main/data.json"
    ).then((data) => data.json());

    localStorage.setItem("data", JSON.stringify(data));
  }
  return data;
}
