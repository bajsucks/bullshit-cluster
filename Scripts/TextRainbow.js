// just the rainbow
var CurrentVal = 0;
var s = false;
var title = document.getElementById("title")
function TimedRainbow()
{
    s = !s
    if (s)
    {
        title.style.opacity = 1;
    }
    else
    {
        title.style.opacity = 0;
    }
}
setInterval(TimedRainbow, 1300)