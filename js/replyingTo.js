export const replyingTo = (content, users) => {
  let regex = /^@/;
  let words = content.split(" ");
  console.log(content);

  //checks if has @ and user and styles it if it does
  for (let i = 0; i < words.length; i++) {
    if (regex.test(words[i]) && users.includes(words[i].slice(1).trim())) {
      console.log(words.slice(0, i).join(" "));
      console.log(words[i]);
      return `${words
        .slice(0, i)
        .join(" ")} <span class="comment-content-replyTo">${
        words[i]
      }</span> ${words.slice(i + 1).join(" ")}`;
    }
  }

  return content;
};
