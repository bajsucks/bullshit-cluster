// lerp
function lerp(a, b, alpha) 
{
    return a + alpha * (b - a)
}

function Hook(url, text)
{
    var text = {content: text}

    fetch(url, 
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(text),
    }
    )
}