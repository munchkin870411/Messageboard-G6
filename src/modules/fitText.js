// fitText.js
export function fitTextToContainer(wrapperElement, minFontSize = 6) {
    const container = wrapperElement.parentElement;
    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;
  
    let fontSize = parseFloat(getComputedStyle(wrapperElement).fontSize);
    let lineHeightRatio = 1;
  
    wrapperElement.style.wordBreak = 'break-word';
    wrapperElement.style.overflowWrap = 'break-word';
    wrapperElement.style.boxSizing = 'border-box';
    wrapperElement.style.whiteSpace = 'normal';
    wrapperElement.style.maxHeight = '100%';
    wrapperElement.style.display = 'block';
  
    const MAX_ATTEMPTS = 100;
    let attempts = 0;
  
    while (
      (wrapperElement.scrollHeight > containerHeight || wrapperElement.scrollWidth > containerWidth) &&
      fontSize > minFontSize &&
      attempts < MAX_ATTEMPTS
    ) {
      fontSize -= 1.2;
      attempts++;
  
      wrapperElement.style.fontSize = `${fontSize}px`;
      wrapperElement.style.lineHeight = `${fontSize * lineHeightRatio}px`;
  
      wrapperElement.childNodes.forEach(child => {
        if (child.style) {
          child.style.fontSize = `${fontSize}px`;
          child.style.lineHeight = `${fontSize * lineHeightRatio}px`;
        }
      });
  
      wrapperElement.offsetHeight;
    }
  }