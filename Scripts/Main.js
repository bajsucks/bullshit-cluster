const UpgradeInfo = {
    "InsanityShop": {
        "UpgradeStats": [
            "Adds 1 to your per click income", 
            "Multiplies your per click income by 1.25x", 
            "Adds 2 to your passive income", 
            "Multiplies your passive income by 1.5x"
        ],
        "Cost": [
            [
                "Balance", // currency (0)
                [10, 100, 30, 250], // cost init (1)
                [2, 3, 4, 8] // cost multi (2)
            ]
        ],
        "MaxUpgrades": [50, 10, 50, 10]
    },
    "PrestigeShop": {
        "UpgradeStats": [
            "Adds 5 to your per click income", 
            "Halves passive income time", 
            "Adds 10 to your passive income", 
            "Multiplies your passive income by 2x"
        ],
        "Cost": [
            [
                "Balance", // currency (0)
                [5000, 20000, 20000, 50000], // cost init (1)
                [3, 1, 5, 10] // cost multi (2)
            ]
        ],
        "Requirements": [
            [
                "Prestige", // currency (0)
                [1, 3, 8, 15], // requirement (1)
                [1, 1, 1, 1] // multi (2)
            ]
        ],
        "MaxUpgrades": [10, 1, 10, 3]
    }
}
const CurrencyAbb = {
    "Balance": "Bal",
}
const DataTemplate = {
    "Balance": 0,
    "Prestige": 0,
    "Upgrades": {
        "InsanityShop": [0, 0, 0, 0],
        "PrestigeShop": [0, 0, 0, 0]
    },
    "Theme": "light",
    "Stats": {
        "TotalBalance": 0,
        "TimeInGame": 0,
        "IsPrestigeUnlocked": false
    },
    "Goals": 0,
    "DataVersion": 0
}
const Goals = [
    {
        "Desc": "Collect 5K Balance",
        "Unlocks": "Prestige",
        "Requirements": [
            [
                "Balance",
                5000
            ]
        ]
    },
    // {
    //     "Desc": "Prestige 5 times",
    //     "Unlocks": "Permanent shop",
    //     "Requirements": [
    //         [
    //             "Prestige",
    //             5
    //         ]
    //     ]
    // },
];

// turn numbers into human readable
function abbreviateNum(num)
{
    function f()
    {
        num = Math.round(num*10)/10
        return num
    }
    if (typeof num !== 'number') {
      return num;
    }

    if (Math.abs(num) < 1000) {
      return parseFloat(f().toString());
    }
  
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Qui', 'Sx', 'Sp', 'Oc', "No", 'Dec', "Und", "Duod", "Tred"];
    let magnitude = 0;
  
    while (Math.abs(num) >= 1000 && magnitude < suffixes.length - 1) {
      num /= 1000;
      magnitude++;
    }
  
    return parseFloat(f()) + suffixes[magnitude];
}

// to hourse:minutes:seconds
function toHHMMSS(str)
{
    var sec_num = parseInt(str, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function SaveData()
{
    var jsonData = JSON.stringify(Data);
    localStorage.setItem("GameData", jsonData);
}

function ReadData()
{
    var jsonData = localStorage.getItem("GameData")
    var GameData = JSON.parse(jsonData)
    if (typeof GameData == "Array" || GameData?.DataVersion != 0)
    {
        WipeData()
        return null;
    }
    return GameData;
}
var Data = ReadData() || DataTemplate // local saved data, this will be rebuilt

// Update balance visually
function UpdateBalance()
{
    document.getElementById("balance").innerHTML = "Balance: "+abbreviateNum(Data.Balance);
    CheckLayers()
    UpdateGoal()
}

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

if (Data != DataTemplate){ Notif("Welcome back!", 12000) }


// main statistics, cookie load

var IncrementGameTime
var IncrementButton
var IncrementButtonMultiplier
var IncrementTime
var IncrementMultiplier
var LastCheckTime = performance.now();
var LastCheckBalance = Data.Balance;

function ReStat()
{
    // last num is base value
    Increment = (Data.Upgrades.InsanityShop[2] * 2) + (Data.Upgrades.PrestigeShop[2] * 10) + 1;
    IncrementButton = (Data.Upgrades.InsanityShop[0]) + (Data.Upgrades.PrestigeShop[0] * 5) + 1;
    IncrementButtonMultiplier = 0.25 * Data.Upgrades.InsanityShop[1] + 1;
    IncrementTime = 1000 / (Data.Upgrades.PrestigeShop[1]+1);
    IncrementMultiplier = (0.5 * Data.Upgrades.InsanityShop[3]) + (1 * Data.Upgrades.PrestigeShop[3]) + 1;
}
ReStat()

window.addEventListener("beforeunload", SaveData);
setInterval(SaveData, 1000)

const UpgradeButtons = {
    "InsanityShop": [
        document.getElementById("shop0"), 
        document.getElementById("shop1"), 
        document.getElementById("shop2"), 
        document.getElementById("shop3")
    ],
    "PrestigeShop": [
        document.getElementById("Prestigeshop0"), 
        document.getElementById("Prestigeshop1"), 
        document.getElementById("Prestigeshop2"), 
        document.getElementById("Prestigeshop3")
    ]
}
const UpgradeDescs = {
    "InsanityShop": [
        document.getElementById("descshop0"),
        document.getElementById("descshop1"),
        document.getElementById("descshop2"),
        document.getElementById("descshop3")
    ],
    "PrestigeShop": [
        document.getElementById("descPrestigeshop0"),
        document.getElementById("descPrestigeshop1"),
        document.getElementById("descPrestigeshop2"),
        document.getElementById("descPrestigeshop3")
    ]
}

function UpdateShopDescs()
{
    for (let Shop in UpgradeInfo)
    {
        if (UpgradeDescs[Shop] == null)
        {
            continue;
        }
        for (let i=0; i<UpgradeInfo[Shop].UpgradeStats.length; i++)
        {
            UpgradeDescs[Shop][i].innerHTML = Data.Upgrades[Shop][i]+"/"+UpgradeInfo[Shop].MaxUpgrades[i]
            if (UpgradeInfo[Shop].Requirements != null)
            {
                UpgradeDescs[Shop][i].innerHTML += "<br>Requires:<br>"
                for (let key in UpgradeInfo[Shop].Requirements)
                {
                    UpgradeDescs[Shop][i].innerHTML += UpgradeInfo[Shop].Requirements[key][0] + " " + UpgradeInfo[Shop].Requirements[key][1][i]
                }
            }
        }
    }
}
function BuyUpgradeOf(Shop, index)
{
    var UpgradeCount = Data.Upgrades[Shop][index]
    if (UpgradeCount == null) {UpgradeCount = 0;}
    for (let i in UpgradeInfo[Shop].Cost)
    {
        var Cost = UpgradeInfo[Shop].Cost[i][1][index] * Math.pow(UpgradeInfo[Shop].Cost[i][2][index], UpgradeCount)
        if (Data[UpgradeInfo[Shop].Cost[i][0]] < Cost)
        {
            Notif("Purchase failed: Not enough " + UpgradeInfo[Shop].Cost[i][0] + "!")
            return;
        }
        if (UpgradeCount >= UpgradeInfo[Shop].MaxUpgrades[index])
        {
            Notif("Purchase failed: This upgrade is already maxed out!")
            return;
        }
    }
    for (let i in UpgradeInfo[Shop].Requirements)
    {
        if (Data[UpgradeInfo[Shop].Requirements[i][0]] < UpgradeInfo[Shop].Requirements[i][1][index] * Math.pow(UpgradeInfo[Shop].Requirements[i][2][index], UpgradeCount))
        {
            Notif("Purchase failed: Requirements are not met!")
            return;
        }
    }
    for (let i in UpgradeInfo[Shop].Cost)
    {
        var Cost = UpgradeInfo[Shop].Cost[i][1][index] * Math.pow(UpgradeInfo[Shop].Cost[i][2][index], UpgradeCount)
        Data[UpgradeInfo[Shop].Cost[i][0]] -= Cost
    }
    Data.Upgrades[Shop][index] += 1
    ReStat()
    Notif("Upgrade was successfully bought!")
    UpdateUpgrades()
}

for (let Shop in UpgradeButtons) // prob done
{
    for (let i = 0; i < UpgradeButtons[Shop].length; i++)
    {
        UpgradeButtons[Shop][i].setAttribute("onclick", 'BuyUpgradeOf('+'\"'+Shop+'\"'+','+i+')')
    }
}
function UpdateGoalText()
{
    if (Goals[Data.Goals] == null)
    {
        document.getElementById("GoalText").innerHTML = "More goals will be added soon!"
    }
    else
    {
        document.getElementById("GoalText").innerHTML = "Goal "+(Data.Goals+1)+": "+Goals[Data.Goals].Desc+"<br>"+"Unlocks: "+Goals[Data.Goals].Unlocks
    }
}
function UpdateGoal()
{
    if (Goals[Data.Goals] == null) {UpdateGoalText(); return}
    function CheckGoalCompletion(i)
    {
        if (Data[Goals[Data.Goals].Requirements[i][0]] >= Goals[Data.Goals].Requirements[i][1])
        {
            return true;
        }
        return false;
    }
    UpdateGoalText()
    for (let i = 0; i < Goals[Data.Goals].Requirements.length; i++)
    {
        if (CheckGoalCompletion(i) == false)
        {
            return;
        }
    }
    Data.Goals += 1
    UpdateGoalText()
}
function UpdateUpgrades() // <--- this todo
{
    for (let Shop in UpgradeButtons)
    {
        for (let i = 0; i < UpgradeButtons[Shop].length; i++)
        {
            if (Data.Upgrades[Shop][i] >= UpgradeInfo[Shop].MaxUpgrades[i])
            {
                UpgradeButtons[Shop][i].innerHTML = UpgradeInfo[Shop].UpgradeStats[i]+"<br><br>MAX"
            }
            else
            {
                UpgradeButtons[Shop][i].innerHTML = UpgradeInfo[Shop].UpgradeStats[i]+"<br><br>"+"Cost:"
                for (let num = 0; num < UpgradeInfo[Shop].Cost.length; num++)
                {
                    UpgradeButtons[Shop][i].innerHTML += " " +
                    abbreviateNum(UpgradeInfo[Shop].Cost[num][1][i] * Math.pow(UpgradeInfo[Shop].Cost[num][2][i], Data.Upgrades[Shop][i])) + " " + CurrencyAbb[UpgradeInfo[Shop].Cost[num][0]];
                }
            }
        }
    }

    if (IncrementButtonMultiplier > 1)
    {
    document.getElementById("incomepc").innerHTML = "Income (per click): "+abbreviateNum(IncrementButton * IncrementButtonMultiplier)+" ("+IncrementButtonMultiplier+"x multiplier)"
    }
    else
    {
        document.getElementById("incomepc").innerHTML = "Income (per click): "+abbreviateNum(IncrementButton * IncrementButtonMultiplier)
    }
    UpdateShopDescs()
    UpdateStatistics()
    UpdateBalance()
    UpdateGoal()
}
var LastIncrementUpdate = performance.now()
function IncrementGameTime()
{
    var LiterallyNow = performance.now()
    var Delta = LiterallyNow - LastIncrementUpdate
    LastIncrementUpdate = LiterallyNow
    Data.Stats.TimeInGame += Delta/1000;
}
IncrementGameTime()
function UpdateStatistics()
{
    function NewLine(t)
    {
        StatInfo.innerHTML += "<br>"+t
    }
    var StatInfo = document.getElementById("StatisticsInfo")
    StatInfo.innerHTML = ""
    NewLine("Current balance: "+abbreviateNum(Math.floor(Data.Balance)))
    NewLine("Lifetime balance: "+abbreviateNum(Math.floor(Data.Stats.TotalBalance)))
    NewLine("Raw passive income: "+abbreviateNum(Increment))
    NewLine("Passive income multiplier: "+abbreviateNum(IncrementMultiplier))
    NewLine("Total passive income: "+abbreviateNum(Increment * IncrementMultiplier))
    NewLine("Passive income time: "+Math.floor(IncrementTime)+"ms")
    NewLine("Raw per click income: "+abbreviateNum(IncrementButton))
    NewLine("Per click income multiplier: "+abbreviateNum(IncrementButtonMultiplier))
    NewLine("Total per click income: "+abbreviateNum(IncrementButton * IncrementButtonMultiplier))
    NewLine("Prestige: "+abbreviateNum(Data.Prestige))
    NewLine("Goal: "+Data.Goals)
    NewLine("")
    NewLine("Time spent in game: "+toHHMMSS(Data.Stats.TimeInGame))
}
UpdateUpgrades()

function psIncomeCalc()
{
    let TimeDifference = (performance.now() - LastCheckTime); // ms
    let ExpectedIncome = Increment * IncrementMultiplier * 1000 / IncrementTime;
    let ActualIncome = Data.Balance - LastCheckBalance;
    let ClickIncome = (ActualIncome-ExpectedIncome) * 1000 / TimeDifference;
    if (IncrementMultiplier != 1)
    {
        document.getElementById("incomeps").innerHTML = "Income (per second): "+abbreviateNum(ExpectedIncome * IncrementMultiplier + ClickIncome)+" ("+IncrementMultiplier+"x passive multiplier)"
    }
    else
    {
        document.getElementById("incomeps").innerHTML = "Income (per second): "+abbreviateNum(ExpectedIncome * IncrementMultiplier + ClickIncome);
    }
    document.getElementById("incomepassive").innerHTML = "Income (passive per tick): "+abbreviateNum(Increment * IncrementMultiplier)
    LastCheckTime = performance.now();
    LastCheckBalance = Data.Balance;
}

function TimeIncrement()
{
    var toget = Increment * IncrementMultiplier
    Data.Balance += toget;
    Data.Stats.TotalBalance += toget;
    setTimeout(TimeIncrement, IncrementTime);
    UpdateBalance();
}
var LastClickT = performance.now()
function ButtonIncrement()
{
    var rn = performance.now()
    var difference = rn - LastClickT
    if (difference < 50) {Notif("Hey! Chill! Slow down!", 3000); return;}
    LastClickT = rn
    var toget = IncrementButton * IncrementButtonMultiplier
    Data.Balance += toget;
    Data.Stats.TotalBalance += toget;
    UpdateBalance();
}

function WipeData()
{
    Data = DataTemplate;
    SaveData();
    location.reload(true);
}

var StatsElems = document.querySelectorAll(".Stats")
var GameElems = document.querySelectorAll(".Game")
var SettingsElems = document.querySelectorAll(".Settings")
function on(thing)
{
    thing.classList.remove("hidden")
    // thing.style.visibility = "visible";
}
function off(thing)
{
    thing.classList.add("hidden")
    // thing.style.visibility = "hidden";
}
var CurrentWindow = null;
function SwitchTo(To)
{
    switch (To)
    {
        case CurrentWindow:
            CurrentWindow = "Game"
            StatsElems.forEach(off)
            SettingsElems.forEach(off)
            GameElems.forEach(on)
            break;
        case "Stats":
            CurrentWindow = "Stats"
            StatsElems.forEach(on)
            SettingsElems.forEach(off)
            GameElems.forEach(off)
            break;
        case "Settings":
            CurrentWindow = "Settings"
            StatsElems.forEach(off)
            SettingsElems.forEach(on)
            GameElems.forEach(off)
            break;
        default:
            CurrentWindow = "Game"
            StatsElems.forEach(off)
            SettingsElems.forEach(off)
            GameElems.forEach(on)
    }
}
var texts = document.querySelectorAll("button")
var divs = document.querySelectorAll("div")
var body = document.querySelectorAll("body")
function DarkMode(tag, notransition)
{
    var taglist = [
        "dark-mode",
        "dark-mode-green",
        "dark-mode-purple"
    ];
    function foreachon(thing)
    {
        thing.offsetHeight;
        thing.classList.remove('notransition')
    }
    function foreachoff(thing)
    {
        thing.classList.add('notransition')
    }
    if (notransition)
    {
        body.forEach(foreachoff)
    }
    if (tag == 'light')
    {
        function sw(thing)
        {
            for (let i = 0; i < taglist.length; i++)
            {
                thing.classList.toggle(taglist[i], false) 
            }
        }
        body.forEach(sw)
    }
    else
    {
        function sw(thing)
        {
            for (let i = 0; i < taglist.length; i++)
            {
                thing.classList.toggle(taglist[i], false) 
            }
            thing.classList.toggle(tag)
        }
        body.forEach(sw)
    }
    Data.Theme = tag
    if (notransition)
    {
        body.forEach(foreachon)
        return
    }
    Notif("Dark mode switched successfully!", 3000)
}
StatsElems.forEach(off)
SettingsElems.forEach(off)
function CheckLayers()
{
    if (Data.Prestige >= 1)
    {
        document.getElementById("Prestige2").style.visibility = "visible"
    }
    else
    {
        document.getElementById("Prestige2").style.visibility = "hidden"
    }
    if (Data.Goals >= 1)
    {
        document.getElementById("PrestigeCount").innerHTML = "You currently have " + Data.Prestige + " Prestige"
        if (Data.Balance > 5000)
        {
            Data.Stats.IsPrestigeUnlocked = true
            document.getElementById("PrestigeReq").style.visibility = "hidden"
            console.warn("this")
            document.getElementById("Prestige1").style.visibility = "visible"
        }
        else if (Data.Stats.IsPrestigeUnlocked == true)
        {
            document.getElementById("Prestige1").style.visibility = "hidden"
            document.getElementById("PrestigeReq").style.visibility = "visible"
            document.getElementById("PrestigeReq").innerHTML = "5K Balance required to unlock Prestige.<br>Current Prestige: "+Data.Prestige
        }
        else
        {
            document.getElementById("Prestige1").style.visibility = "hidden"
            document.getElementById("PrestigeReq").style.visibility = "hidden"
        }
    }
    UpdateGoal()
}
function Prestige()
{
    Data.Balance = 0,
    Data.Upgrades.InsanityShop = [0, 0, 0, 0]
    Data.Prestige += 1
    Data.Stats.IsPrestigeUnlocked = true
    ReStat()
    CheckLayers()
    UpdateUpgrades()
}

DarkMode(Data.Theme, true)
UpdateStatistics()
CheckLayers()
setTimeout(TimeIncrement, IncrementTime);
setInterval(psIncomeCalc, 1000);
setInterval(UpdateStatistics, 1000);
setInterval(IncrementGameTime, 1000);