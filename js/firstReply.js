export function firstReply(newNode, existingNode) {
  const replyContainer = document.createElement("div");

  replyContainer.classList.add("reply-container");

  replyContainer.append(newNode);
  existingNode.parentNode.insertBefore(
    replyContainer,
    existingNode.nextSibling
  );
}
