import { fetchData } from "./fetchData.js";
import { renderCard } from "./renderCard.js";
import { replyingTo } from "./replyingTo.js";
import { changeCommentCard } from "./changeCommentCard.js";
import { insertAfter } from "./insertAfter.js";
import { setCaret } from "./setCaret.js";
import { getCaretPosition } from "./getCaret.js";
import { findParent } from "./findParentComment.js";
import { firstReply } from "./firstReply.js";
import { deleteButton } from "./deleteButton.js";

const commentsContainer = document.getElementById("comments-container");
const sendButton = document.getElementById("send-button");
const text = document.getElementById("addComment-input");

//fetch data.json()

console.log("hello world");

const main = async () => {
  //get data
  console.log("fetching data");
  const data = await fetchData();
  console.log("data fetched");
  let comments = data.comments;
  let currentUser = data.currentUser;
  console.log(currentUser);
  console.log(comments);

  //change data
  const scorePlus = () => {};

  //get all usernames
  let users = [];
  for (let i = 0; i < comments.length; i++) {
    if (!users.includes(comments[i].user.username)) {
      users.push(comments[i].user.username);
    }
    for (let e = 0; e < comments[i].replies.length; e++) {
      if (!users.includes(comments[i].replies[e].user.username)) {
        users.push(comments[i].replies[e].user.username);
      }
    }
  }
  console.log(users);
  //render comments
  for (let i = 0; i < comments.length; i++) {
    const comment = renderCard(comments[i], currentUser);

    commentsContainer.appendChild(comment);

    // render replies
    if (comments[i].replies.length) {
      //create container for reply cards
      const replyContainer = document.createElement("div");
      replyContainer.classList.add("reply-container");

      commentsContainer.appendChild(replyContainer);

      for (let e = 0; e < comments[i].replies.length; e++) {
        const reply = renderCard(
          comments[i].replies[e],
          currentUser,
          "reply-card"
        );
        replyContainer.appendChild(reply);
      }
    }
  }

  //add comment
  sendButton.addEventListener("click", (e) => {
    console.log(text.value);
    console.log(e);

    const commentData = {
      content: text.value,
      createdAt: "now",
      id:
        data.comments.reduce((a, b) => a + b.replies.length, 0) +
        data.comments.length +
        1,
      replies: [],
      replyingTo: "",
      score: 0,
      user: {
        image: {
          png: "./images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
      },
    };

    const comment = renderCard(commentData, currentUser);
    commentsContainer.appendChild(comment);

    data.comments.push(commentData);
    console.log(data);
    localStorage.setItem("data", JSON.stringify(data));
  });

  //reply to comment
  document.querySelectorAll(".reply-button").forEach((el) => {
    console.log(el);

    el.addEventListener("click", (e) => {
      const clicked = e.target.closest(".comment-card");

      let parentEl = findParent(clicked.dataset.id, data);

      const parentUser = clicked.children[0].children[1].innerHTML;
      console.log(parentUser);

      const comment = changeCommentCard(true, {
        replyTo: parentUser,
        content: "",
      });

      insertAfter(comment, clicked);

      document
        .querySelector("#send-button-reply")
        .addEventListener("click", (e) => {
          //making comment Data

          const isReplyingTo = comment.children[1].getElementsByClassName(
            "comment-content-replyTo"
          )[0];

          const replyIndex = isReplyingTo
            ? comment.innerText.split(" ").indexOf(isReplyingTo.innerText)
            : -1;
          console.log(replyIndex);
          const content = isReplyingTo
            ? comment.children[1].innerText
                .split(" ")
                .filter((e, i) => i !== replyIndex)
                .join(" ")
            : comment.children[1].innerText;

          console.log(comment.innerText);
          console.log(content);

          console.log(data.comments);
          console.log(data.comments.reduce((a, b) => a + b.replies.length, 0));

          //object for rendering card
          const commentData = {
            content: content,
            createdAt: "now",
            id:
              data.comments.reduce((a, b) => a + b.replies.length, 0) +
              data.comments.length +
              1,
            replies: [],
            replyingTo: isReplyingTo ? isReplyingTo.innerText.slice(1) : "",
            score: 0,
            user: {
              image: {
                png: "./images/avatars/image-juliusomo.png",
                webp: "./images/avatars/image-juliusomo.webp",
              },
              username: "juliusomo",
            },
          };
          comment.remove();

          const reply = renderCard(commentData, currentUser, "reply-card");

          for (let i = 0; i < comments.length; i++) {
            if (
              parentEl.id == clicked.dataset.id &&
              parentEl.replies.length > 0
            ) {
              console.log("insert first in a reply");
              comments[i].replies.splice(0, 0, commentData);

              clicked.nextSibling.insertBefore(
                reply,
                clicked.nextSibling.childNodes[0]
              );
              break;
            }
            if (parentEl.id == clicked.dataset.id) {
              comments[i].replies.splice(0, 0, commentData);
              firstReply(reply, clicked);
              break;
            } else {
              for (let e = 0; e < comments[i].replies.length; e++) {
                if (comments[i].replies[e].id == clicked.dataset.id) {
                  comments[i].replies.splice(e + 1, 0, commentData);
                  insertAfter(reply, clicked);

                  break;
                }
              }
            }
          }
          console.log(data);
          localStorage.setItem("data", JSON.stringify(data));
        });

      document
        .querySelector("#cancel-button")
        .addEventListener("click", (e) => {
          comment.remove();
        });
    });
  });

  //remove button

  //edit comment

  //check if replying to
};

main();
console.log;
