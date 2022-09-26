export const findComment = (id, data) => {
  const comments = data.comments;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      return comments[i].id;
    }
    for (let e = 0; e < comments[i].replies.length; e++) {
      if (comments[i].replies[e].id == id) {
        return comments[i].replies[e].id;
      }
    }
  }
};
