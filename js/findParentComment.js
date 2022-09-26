// find the parent element

//search through all comments for the right id
export const findParent = (id, data) => {
  const comments = data.comments;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id == id) {
      return comments[i];
    }
    for (let e = 0; e < comments[i].replies.length; e++) {
      if (comments[i].replies[e].id == id) {
        return comments[i];
      }
    }
  }
};
