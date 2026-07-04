export function ScaleText()
{
    const elements = document.querySelectorAll<HTMLElement>(".scalable-text");
    for (const element of elements)
    {
        const maxWidth = parseInt(getComputedStyle(element).maxWidth);
        const maxHeight = parseInt(getComputedStyle(element).maxHeight);

        if (!element.dataset.defaultFontSize) { element.dataset.defaultFontSize = getComputedStyle(element).fontSize; }
        element.style.fontSize = element.dataset.defaultFontSize;

        while ((maxWidth && element.scrollWidth >= maxWidth) ||
        (maxHeight && element.scrollHeight >= maxHeight))
        {
            element.style.fontSize = `${parseInt(element.style.fontSize) - 1}px`;
        }
    }

    console.log("scaling");
}

export function ObserveScalableText(): MutationObserver
{
    const observer = new MutationObserver(ScaleText);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return observer;
}