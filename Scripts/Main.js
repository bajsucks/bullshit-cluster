// cookie wrapper
const daysToExpire = new Date(2147483647 * 1000).toUTCString();
function SaveCookie()
{
    removeCookie("Balance");
    createCookie("Balance", Balance, 120);
}

var CBalance = readCookie("Balance")

// Update balance visually

function UpdateBalance()
{
    document.getElementById("balance").innerHTML = "Balance: "+Balance;
}

// Notification for the user

function Disappear()
{
    document.getElementById("usernotifBox").style.opacity = 0;
}

function Notif(text)
{
    clearTimeout(Disappear)
    document.getElementById("usernotifBox").style.opacity = 1;
    document.getElementById("usernotif").innerHTML = text;
    setTimeout(Disappear, 10000)
}
if (CBalance != "")
{
    setTimeout(Notif("Welcome back!"), 10000)
}

// Load cookie

// Balance management
var Balance = 0;
if (CBalance != "" && parseInt(CBalance))
{
    Balance = parseInt(CBalance);
}
window.addEventListener("beforeunload", SaveCookie);
setInterval(SaveCookie, 1000)
var Increment = 1;
var IncrementButton = 1;
var IncrementTime = 1000;
var LastCheckTime = performance.now();
var LastCheckBalance = 0;
var LastCheckIncome = 0

function UpdateIncome()
{
    let Difference = (performance.now() - LastCheckTime)/1000;
    let ResultIncome = (Balance-LastCheckBalance)/Difference;
    document.getElementById("income").innerHTML = "Income (per second): "+Math.floor(ResultIncome*100)/100;
    LastCheckTime = performance.now();
    LastCheckBalance = Balance;
    LastCheckIncome = ResultIncome;
}

function TimeIncrement()
{
    Balance += Increment;
    setTimeout(TimeIncrement, IncrementTime);
    UpdateBalance();
}

function ButtonIncrement()
{
    Balance += IncrementButton;
    UpdateBalance();
}
setTimeout(TimeIncrement, IncrementTime);
setInterval(UpdateIncome, 1000);