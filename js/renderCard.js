import { findComment } from "./findCommentID.js";
import { fetchDataSync } from "./fetchDataSync.js";
import { deleteButton } from "./deleteButton.js";
import { insertAfter } from "./insertAfter.js";
import { changeCommentCard } from "./changeCommentCard.js";

export const renderCard = (comment, currentUser, className = "normal") => {
  const commentCard = document.createElement("div");
  commentCard.classList.add("comment-card", className);
  console.log(comment);
  console.log(comment.replyingTo);
  commentCard.innerHTML = `
  <div class="comment-header">
      <img src=${
        comment.user.image.png
      } class="comment-header-image header-item profile-image"/>
      <h5 class="comment-username header-item">${comment.user.username}</h5>
      ${
        comment.user.username === currentUser.username
          ? "<h6 class='profile-you'>YOU</h6>"
          : ""
      }
      <small class="header-item"> ${comment.createdAt}</small>
  </div>
  <div class="comment-content">
  <p>
  <span class="comment-content-replyTo">${
    comment.replyingTo ? `@${comment.replyingTo}` : ""
  }</span>
      ${comment.content}
  </p>
  </div>
      <div class="score__board">
          <img src="./images/icon-plus.svg" class="score-button" id="score-plus"/>
          <div class="score" id="score">${comment.score}</div>
          <img src="./images/icon-minus.svg" class="score-button" id="score-minus"/>
      </div>
      ${
        comment.user.username === currentUser.username
          ? `
          <div class='change-post buttons'>
              <button class='delete_post button' id="delete-button">
                  <img src='./images/icon-delete.svg' class="delete_post-image" />
                  <span class="delete_post-text">Delete </span>
              </button>
              <button class='edit_post button' id="edit-button">
                  <img src='./images/icon-edit.svg' class="edit_post-image" />
                  <span class="edit_post-text">Edit</span>
              </button>
          </div>`
          : `
          <button class="reply-button button buttons" id="reply"> 
              <img src="./images/icon-reply.svg" class="reply-image"> 
              <span class="reply-text">Reply</span>
          </button>`
      }

`;

  if (comment.isLiked === true) {
    commentCard
      .querySelector("#score-plus")
      .classList.add("store-button-active");
    commentCard
      .querySelector("#score-minus")
      .classList.remove("store-button-active");
  } else if (comment.isLiked === false) {
    commentCard
      .querySelector("#score-minus")
      .classList.add("store-button-active");

    commentCard
      .querySelector("#score-plus")
      .classList.remove("store-button-active");
  } else {
    commentCard
      .querySelector("#score-plus")
      .classList.remove("store-button-active");
    commentCard
      .querySelector("#score-minus")
      .classList.remove("store-button-active");
  }
  console.log(currentUser);
  commentCard.dataset.id = comment.id;
  console.log(comment.id);

  if (comment.user.username === currentUser.username) {
    deleteButton(commentCard.querySelector(".delete_post"));

    console.log(commentCard.querySelector("#edit-button"));

    commentCard
      .querySelector("#edit-button")
      .addEventListener("click", (el) => {
        const element = el.target.closest(".comment-card");

        const data = fetchDataSync();

        const content = comment.content;
        console.log(comment.id);
        const changeComment = changeCommentCard(false, {
          replyTo: comment.replyingTo,
          content: comment.content,
          replies: comment.replies,
          user: {
            image: comment.user.image,
            username: comment.user.username,
          },
          id: comment.id,
          score: comment.score,
        });

        insertAfter(changeComment, element.previousSibling);

        element.remove();
      });
  }

  commentCard.querySelector("#score-plus").addEventListener("click", (el) => {
    const data = fetchDataSync();

    console.log("plus");
    let score = commentCard.querySelector("#score");
    console.log(score);

    const id = el.target.parentNode.parentNode.dataset.id;

    const comments = data.comments;

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id == id) {
        console.log(comments[i].hasOwnProperty("isLiked"));
        console.log(comments[i].isLiked);

        if (comments[i].isLiked === false) {
          comments[i].score = parseInt(comments[i].score) + 1;
        }

        if (!comments[i].hasOwnProperty("isLiked") || !comments[i].isLiked) {
          comments[i].score = parseInt(comments[i].score) + 1;
          console.log(comments[i].score);
          comments[i].isLiked = true;
          el.target.classList.add("store-button-active");

          commentCard
            .querySelector("#score-minus")
            .classList.remove("store-button-active");
        } else if (comments[i].isLiked === true) {
          comments[i].score = parseInt(comments[i].score) - 1;
          comments[i].isLiked = null;
          el.target.classList.remove("store-button-active");
        }

        console.log(comments[i].isLiked);
        console.log(comments[i].score);
        data.comments = comments;
        localStorage.setItem("data", JSON.stringify(data));

        console.log(data);
        commentCard.querySelector("#score").innerText = comments[i].score;
        break;
      }
      for (let e = 0; e < comments[i].replies.length; e++) {
        if (comments[i].replies[e].id == id) {
          if (comments[i].replies[e].isLiked === false) {
            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) + 1;
          }

          if (
            !comments[i].replies[e].hasOwnProperty("isLiked") ||
            !comments[i].replies[e].isLiked
          ) {
            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) + 1;
            comments[i].replies[e].isLiked = true;
            el.target.classList.add("store-button-active");

            commentCard
              .querySelector("#score-minus")
              .classList.remove("store-button-active");
          } else if (comments[i].replies[e].isLiked === true) {
            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) - 1;
            comments[i].replies[e].isLiked = null;
            el.target.classList.remove("store-button-active");
          }

          data.comments = comments;
          localStorage.setItem("data", JSON.stringify(data));
          console.log(comments[i].replies[e].score);
          commentCard.querySelector("#score").innerText =
            comments[i].replies[e].score;

          break;
        }
      }
    }

    data.comments = comments;
    console.log(data);
  });

  commentCard.querySelector("#score-minus").addEventListener("click", (el) => {
    const data = fetchDataSync();

    console.log("plus");
    let score = commentCard.querySelector("#score");
    console.log(score);

    const id = el.target.parentNode.parentNode.dataset.id;

    const comments = data.comments;

    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id == id) {
        console.log(comments[i].hasOwnProperty("isLiked"));
        console.log(comments[i].isLiked);

        if (comments[i].isLiked === true) {
          comments[i].score = parseInt(comments[i].score) - 1;
        }

        if (
          !comments[i].hasOwnProperty("isLiked") ||
          comments[i].isLiked !== false
        ) {
          comments[i].score = parseInt(comments[i].score) - 1;
          console.log(comments[i].score);
          comments[i].isLiked = false;
          el.target.classList.add("store-button-active");

          commentCard
            .querySelector("#score-plus")
            .classList.remove("store-button-active");
        } else if (comments[i].isLiked === false) {
          comments[i].score = parseInt(comments[i].score) + 1;
          comments[i].isLiked = null;
          el.target.classList.remove("store-button-active");
        }

        console.log(comments[i].isLiked);
        console.log(comments[i].score);
        data.comments = comments;
        localStorage.setItem("data", JSON.stringify(data));

        console.log(data);
        commentCard.querySelector("#score").innerText = comments[i].score;
        break;
      }
      for (let e = 0; e < comments[i].replies.length; e++) {
        if (comments[i].replies[e].id == id) {
          if (comments[i].replies[e].isLiked === true) {
            console.log(comments[i].replies[e].score);

            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) - 1;
            console.log(comments[i].replies[e].score);
          }

          if (
            !comments[i].replies[e].hasOwnProperty("isLiked") ||
            comments[i].replies[e].isLiked !== false
          ) {
            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) - 1;
            comments[i].replies[e].isLiked = false;
            el.target.classList.add("store-button-active");
            console.log(comments[i].replies[e].score);

            commentCard
              .querySelector("#score-plus")
              .classList.remove("store-button-active");
          } else if (comments[i].replies[e].isLiked === false) {
            comments[i].replies[e].score =
              parseInt(comments[i].replies[e].score) + 1;
            comments[i].replies[e].isLiked = null;
            el.target.classList.remove("store-button-active");
          }

          data.comments = comments;
          localStorage.setItem("data", JSON.stringify(data));
          console.log(comments[i].replies[e].score);
          commentCard.querySelector("#score").innerText =
            comments[i].replies[e].score;

          break;
        }
      }
    }

    data.comments = comments;
    console.log(data);
  });

  return commentCard;
};
