export const wrap = (toWrap, wrapper) => {
  wrapper = wrapper || document.createElement("span");
  toWrap.parentNode.appendChild(wrapper);
  return wrapper.appendChild(toWrap);
};
