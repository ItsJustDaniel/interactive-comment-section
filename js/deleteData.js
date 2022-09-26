export const deleteData = (id, data) => {
  const comments = data.comments;
  console.log(comments);
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      comments.splice(i, 1);
      data.comments = comments;
      return data;
    }
    for (let e = 0; e < comments[i].replies.length; e++) {
      if (comments[i].replies[e].id == id) {
        comments[i].replies.splice(e, 1);
        data.comments = comments;
        return data;
      }
    }
  }
  return "fail";
};
