export function setCaret(e, c) {
  // Get caret position
  // Update innerHTML
  console.log(e.childNodes);

  // loop through nodelist to find right childNodes
  let caretLength = c[1];
  let totalLength = 0;
  let lengthArr = [];
  let index = 0;

  //   for (let i = 0; i < e.childNodes.length; i++) {
  //     totalLength += e.childNodes[i].length || e.childNodes[i].innerText.length;
  //   }

  console.log(caretLength);

  if (e.childNodes.length > 1) {
    for (let i = 0; i < e.childNodes.length; i++) {
      let childLength;
      let childValue;

      if (e.childNodes[i].nodeValue) {
        childLength = e.childNodes[i].nodeValue.length;
        childValue = e.childNodes[i].nodeValue;
      } else {
        console.log(e.childNodes[i].innerText);
        childLength = e.childNodes[i].innerText.length;
        childValue = e.childNodes[i].innerText;
      }

      index = i;
      totalLength += childLength;

      if (totalLength >= caretLength) {
        if (childValue.split("").indexOf(" ")) {
          index = i + 1;
          caretLength = 0;
          break;
        }
        index = i;
        caretLength -= totalLength;

        caretLength = childLength + caretLength;
        break;
      }
    }
  }

  if (caretLength > e.childNodes[e.childNodes.length - 1].length) {
    caretLength = e.childNodes[e.childNodes.length - 1].length;
  }

  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(e.childNodes[index], caretLength);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
