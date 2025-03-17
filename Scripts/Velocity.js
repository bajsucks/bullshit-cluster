function applyImpluse(element, X, Y)
{

}
function createNewClick(value)
{
    var elem = document.createElement("p");
    elem.innerHTML = "+"+value;
    elem.style.width = "100px";
    elem.style.transition = "opacity 2s";
    elem.style.height = "50px";
    elem.style.position = "absolute";
    // elem.style.position = "absolute";
    elem.style.top = "120px";
    elem.style.left = (Math.floor(Math.random()*50+50))+"px";

    const parent = document.getElementById("mainFrame");
    document.body.insertBefore(elem, parent);
}
//createNewClick(1000)
// this will be used later for click animations