// just the rainbow
var CurrentVal = 0;
var s = false;
function TimedRainbow()
{
    if (s)
    {
        CurrentVal += 10;
        if (CurrentVal > 200)
        {
            CurrentVal = 200;
            s = !s;
        }  
    }
    else
    {
        CurrentVal -= 10;
        if (CurrentVal < 10)
        {
            CurrentVal = 0;
            s = !s;
        } 
    }
    document.getElementById("title").style.color = "rgb("+CurrentVal+","+CurrentVal+","+CurrentVal+")";
    setTimeout(TimedRainbow, 50);
}
setTimeout(TimedRainbow, 50);