import { setCaret } from "./setCaret.js";
import { getCaretPosition } from "./getCaret.js";
import { replyingTo } from "./replyingTo.js";
import { fetchDataSync } from "./fetchDataSync.js";
import { renderCard } from "./renderCard.js";
import { findParent } from "./findParentComment.js";
import { insertAfter } from "./insertAfter.js";

//get all usernames

export const changeCommentCard = (isReply, content) => {
  console.log(content);
  const data = fetchDataSync();
  const comments = data.comments;
  const currentUser = data.currentUser;

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

  const commentCard = document.createElement("div");
  commentCard.classList.add("addComments-container", "addComments-change");

  commentCard.innerHTML = `
    <img
    src="./images/avatars/image-juliusomo.png"
    class="addComment-profile profile-image"
    />
    <div contenteditable=true
      class="addComment changeComment-input"
      placeholder="Add a comment..."
      id="addComment-input"
    >${
      content.replyTo
        ? `<span class="comment-content-replyTo">@${content.replyTo}</span> ${content.content}`
        : `${content.content}`
    }
    </div>
    <div class="buttons">
    <button class="cancel-button addComment-button" id="cancel-button">
      CANCEL
    </button>
    <button class="send-button addComment-button changeComment-button" id="send-button-${
      isReply ? "reply" : "edit"
    }">
      SEND
    </button>
    </div>
  `;

  commentCard.addEventListener("input", (e) => {
    const carotPos = getCaretPosition(e.target);

    const c = window.getSelection().getRangeAt(0).startOffset;

    e.target.innerHTML = replyingTo(e.target.innerText, users);
    setCaret(e.target, carotPos);
  });
  console.log(isReply);
  if (isReply) {
    commentCard
      .querySelector("#send-button-reply")
      .addEventListener("click", (e) => {
        //making comment Data

        const clicked = e.target.closest(".comment-card");

        let parentEl = findParent(clicked.dataset.id, data);

        const isReplyingTo = commentCard.children[1].getElementsByClassName(
          "comment-content-replyTo"
        )[0];

        const replyIndex = isReplyingTo
          ? commentCard.innerText.split(" ").indexOf(isReplyingTo.innerText)
          : -1;
        console.log(replyIndex);
        const content = isReplyingTo
          ? commentCard.children[1].innerText
              .split(" ")
              .filter((e, i) => i !== replyIndex)
              .join(" ")
          : commentCard.children[1].innerText;

        console.log(commentCard.innerText);
        console.log(content);

        console.log(data.comments);
        console.log(data.comments.reduce((a, b) => a + b.replies.length, 0));

        console.log(content);
        console.log(isReplyingTo ? isReplyingTo.innerText.slice(1) : "");
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
        commentCard.remove();

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

    commentCard
      .querySelector("#cancel-button")
      .addEventListener("click", (e) => {
        commentCard.remove();
      });
  } else {
    commentCard
      .querySelector("#send-button-edit")
      .addEventListener("click", () => {
        const isReplyingTo = commentCard.children[1].getElementsByClassName(
          "comment-content-replyTo"
        )[0];

        const replyIndex = isReplyingTo
          ? commentCard.innerText.split(" ").indexOf(isReplyingTo.innerText)
          : -1;
        console.log(replyIndex);
        const contentText = isReplyingTo
          ? commentCard.children[1].innerText
              .split(" ")
              .filter((e, i) => i !== replyIndex)
              .join(" ")
          : commentCard.children[1].innerText;
        console.log(contentText);

        console.log("edit");
        const commentData = {
          content: contentText,
          createdAt: "now",
          id:
            data.comments.reduce((a, b) => a + b.replies.length, 0) +
            data.comments.length +
            1,
          replies: content.replies,
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

        const editedCard = renderCard(commentData, currentUser);

        insertAfter(editedCard, commentCard);
        console.log(content);
        for (let i = 0; i < comments.length; i++) {
          console.log(comments[i].id);
          console.log(content.id);
          if (comments[i].id === content.id) {
            comments[i].content = contentText;
            console.log(" content changed");

            break;
          }
          for (let e = 0; e < comments[i].replies.length; e++) {
            if (comments[i].replies[e].id === content.id) {
              comments[i].replies[e].content = contentText;
              console.log("replies content changed");
              break;
            }
          }
        }
        console.log(comments);
        localStorage.setItem("data", JSON.stringify(data));

        commentCard.remove();
      });
    commentCard
      .querySelector("#cancel-button")
      .addEventListener("click", (e) => {
        const isReplyingTo = commentCard.children[1].getElementsByClassName(
          "comment-content-replyTo"
        )[0];

        const replyIndex = isReplyingTo
          ? commentCard.innerText.split(" ").indexOf(isReplyingTo.innerText)
          : -1;
        console.log(replyIndex);
        const contentText = isReplyingTo
          ? commentCard.children[1].innerText
              .split(" ")
              .filter((e, i) => i !== replyIndex)
              .join(" ")
          : commentCard.children[1].innerText;
        console.log(contentText);

        console.log("edit");
        const commentData = {
          content: contentText,
          createdAt: "now",
          id:
            data.comments.reduce((a, b) => a + b.replies.length, 0) +
            data.comments.length +
            1,
          replies: content.replies,
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

        const editedCard = renderCard(commentData, currentUser);

        insertAfter(editedCard, commentCard);
        commentCard.remove();
      });
  }

  return commentCard;
};
