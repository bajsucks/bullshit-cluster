// cookie wrapper
const UpgradeStats = [
    "Adds 1 to your per click income", 
    "Multiplies your per click income by 1.25x", 
    "Adds 1 to your passive income", 
    "Multiplies your passive income by 1.2x"
];
const UpgradeCostInit = [10, 100, 30, 300];
const UpgradeCostMulti = [3, 3, 10, 30];
const MaxUpgrades = [50, 10, 50, 10]

// turn numbers into human readable
function abbreviateNum(num)
{
    if (typeof num !== 'number') {
      return num;
    }

    if (num < 1000) {
      return parseFloat(num.toFixed(1).toString());
    }
  
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Qui'];
    let magnitude = 0;
  
    while (num >= 1000 && magnitude < suffixes.length - 1) {
      num /= 1000;
      magnitude++;
    }
  
    return parseFloat(num.toFixed(1)) + suffixes[magnitude];
}

function SaveCookie()
{
    removeCookie("Balance");
    removeCookie("Upgrades")
    createCookie("Balance", Balance, 120);
    createCookie("Upgrades", JSON.stringify(Upgrades))
}
var CBalance = readCookie("Balance")
var CUpgrades = readCookie("Upgrades")

// Update balance visually
function UpdateBalance(){ document.getElementById("balance").innerHTML = "Balance: "+abbreviateNum(Balance); }

// Notification for the user
function Disappear(){ document.getElementById("usernotifBox").style.opacity = 0; }
var PendingTimeout = null;
function Notif(text, t)
{
    if (t == null)
    {t = 7000}
    clearTimeout(PendingTimeout)
    document.getElementById("usernotifBox").style.opacity = 1;
    document.getElementById("usernotif").innerHTML = text;
    PendingTimeout = setTimeout(Disappear, t)
}

if (CBalance != ""){ Notif("Welcome back!", 12000) }


// main statistics, cookie load
var Balance = 0;
if (CBalance != "" && parseInt(CBalance))
{
    Balance = parseInt(CBalance);
}
window.addEventListener("beforeunload", SaveCookie);
setInterval(SaveCookie, 1000)
var Increment = 1;
var IncrementButton = 1;
var IncrementButtonMultiplier = 1;
var IncrementTime = 1000;
var IncrementMultiplier = 1;
var LastCheckTime = performance.now();
var LastCheckBalance = Balance;
var Upgrades = [0, 0, 0, 0];
var ShopButtons = [
    document.getElementById("shop0"), 
    document.getElementById("shop1"), 
    document.getElementById("shop2"), 
    document.getElementById("shop3")
];
if (CUpgrades != "" && JSON.parse(CUpgrades) != null)
    {
        Upgrades = JSON.parse(CUpgrades);
        IncrementButton = Upgrades[0] + 1;
        IncrementButtonMultiplier = 0.25 * Upgrades[1] + 1;
        Increment = Upgrades[2] + 1;
        IncrementMultiplier = 0.2 * Upgrades[3] + 1;
    }
function BuyUpgrade(i)
{
    var UpgradeCount = Upgrades[i]
    if (UpgradeCount == null)
    {
        UpgradeCount = 0;
    }
    var Cost = UpgradeCostInit[i] * Math.pow(UpgradeCostMulti[i], UpgradeCount)
    if (Balance < Cost)
    {
        Notif("Purchase failed: Not enough balance!")
        return;
    }
    if (UpgradeCount >= MaxUpgrades[i])
    {
        Notif("Purchase failed: This upgrade is already maxed out!")
        return;
    }
    Balance -= Cost
    Upgrades[i] += 1
    switch(i){
        case 0:
            IncrementButton += 1
            break;
        case 1:
            IncrementButtonMultiplier += 0.25
            break;
        case 2:
            Increment += 1
            break;
        case 3:
            IncrementMultiplier += 0.2
            break;
    }
    Notif("Upgrade was successfully bought!")
    UpdateUpgrades()
}
for (let i = 0; i < ShopButtons.length; i++)
{
    ShopButtons[i].setAttribute("onclick", "BuyUpgrade("+i+")")
}
function UpdateUpgrades()
{
    for (let i = 0; i < ShopButtons.length; i++)
    {
        ShopButtons[i].innerHTML = UpgradeStats[i]+"<br/>"+"Cost: "+abbreviateNum(UpgradeCostInit[i] * Math.pow(UpgradeCostMulti[i], Upgrades[i]));
    }
    if (IncrementButtonMultiplier > 1)
    {
    document.getElementById("incomepc").innerHTML = "Income (per click): "+abbreviateNum(IncrementButton * IncrementButtonMultiplier)+" ("+IncrementButtonMultiplier+"x multiplier)"
    }
    else
    {
        document.getElementById("incomepc").innerHTML = "Income (per click): "+abbreviateNum(IncrementButton * IncrementButtonMultiplier)
    } 
}
UpdateUpgrades()

function psIncomeCalc() // TODO: Remake to constant calculation, and only real time calculate the mouse clicks
{
    let TimeDifference = (performance.now() - LastCheckTime); // ms
    let ExpectedIncome = Increment * IncrementMultiplier * 1000 / IncrementTime;
    let ActualIncome = Balance - LastCheckBalance;
    let ClickIncome = (ActualIncome-ExpectedIncome) * 1000 / TimeDifference;
    if (IncrementMultiplier > 1)
    {
        document.getElementById("incomeps").innerHTML = "Income (per second): "+abbreviateNum(ExpectedIncome * IncrementMultiplier + ClickIncome)+" ("+IncrementMultiplier+"x passive multiplier)"
    }
    else
    {
        document.getElementById("incomeps").innerHTML = "Income (per second): "+abbreviateNum(ExpectedIncome * IncrementMultiplier + ClickIncome);
    }
    LastCheckTime = performance.now();
    LastCheckBalance = Balance;
}

function TimeIncrement()
{
    Balance += Increment * IncrementMultiplier;
    setTimeout(TimeIncrement, IncrementTime);
    UpdateBalance();
}

function ButtonIncrement()
{
    Balance += IncrementButton * IncrementButtonMultiplier;
    UpdateBalance();
}

function WipeData()
{
    Balance = 0;
    Increment = 1;
    IncrementButton = 1;
    IncrementButtonMultiplier = 1;
    IncrementTime = 1000;
    IncrementMultiplier = 1;
    LastCheckTime = performance.now();
    LastCheckBalance = Balance;
    LastCheckIncome = 0
    Upgrades = [0, 0, 0, 0];
    SaveCookie();
    location.reload(true);
}
setTimeout(TimeIncrement, IncrementTime);
setInterval(psIncomeCalc, 1000);