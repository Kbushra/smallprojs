export function Tabclick(ev: React.KeyboardEvent, click: (ev?: PointerEvent) => any)
{
    if (ev.key != "Enter") { return; }
    if (document.activeElement != ev.currentTarget) { return; }
    
    click();
}