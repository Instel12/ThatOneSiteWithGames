const PageContent = document.documentElement.innerHTML;

const Content = document.getElementsByClassName("Content")[0];
const Title = document.getElementById("Title");
const Options = document.getElementsByClassName("Options")[0];

let TempContent = "";
let Tags = [];
let Metadata = [];
let Agreed = false;

let ClickerEasteregg = 0;

if (!localStorage.getItem("Ticket")) {
    localStorage.setItem("Ticket", crypto.randomUUID());
}
const Ticket = localStorage.getItem("Ticket");
let Visitors = -1;

const BackendURL = "https://receivers-documented-facing-decisions.trycloudflare.com";

const VeryMeaningfulMessages = [
    "ngl ima take a nap lmk",
    "who do you think you are, i am",
    "man, i just farted in the elevator",
    `that one guy in a song from 2 days ago's comments:\n"${new Date().getFullYear()}? Anyone?"\nlike, SHUT UP`,
    "I want my baby back baby back baby back I want my baby back baby back baby back CHILLIS BABY BACK RIBS barbaque sauce",
    "oh how i hate shockwaves 🤓",
    "999",
    "ngl, ur pretty cool"
];

async function Initialize() {
    const response = await fetch(MetadataPath);
    Metadata = await response.json();

    for (var i = 0; Metadata["Games"].length > i; i++) {
        for (var tag = 0; tag < Metadata["Games"][i]["Tags"].length; tag++) {
            if (!Tags.includes(Metadata["Games"][i]["Tags"][tag])) Tags.push(Metadata["Games"][i]["Tags"][tag]);
        }
    }
    
    Title.innerText = "[ TOSWG ]";

    LoadWarning();

    RenewVisitation();
    setInterval(RenewVisitation, 20000)

    console.log(Metadata["Games"].length + " games loaded")
    console.log(VeryMeaningfulMessages[Math.floor(Math.random() * VeryMeaningfulMessages.length)]);
}

function LoadWarning() { // ignore that this is kinda cursed looking
    Content.innerHTML = `
        <div class="InfoUI">
            <h1 style="color:yellow;">[ Warning! ]</h1>
            NOTHING that happens related to this service is on me.
            <br>
            Also, please obey rules, however, I can't really stop you.
            <p></p>
            <button onclick="Agreed = true; LoadHome();">Agree</button>
            <button onclick="LoadDisagree();">Disagree</button>
        </div>
    `;
}

function LoadDisagree() {
    Content.innerHTML = `
        <div class="InfoUI">
            <h1 style="color:yellow;">[ Gochu ]</h1>
            <p>If you change your mind later, you can come back and agree.</p>
        </div>
    `;
}

function LoadHome() {
    if (!Agreed) return;

    ClickerEasteregg++;
    if (ClickerEasteregg > 24)
    {
        Title.innerText = `[ TOSWG ] [ ${ClickerEasteregg-25} ]`;
        if (ClickerEasteregg == 25) alert("Do you want a clicker?");
    }

    Content.textContent = "hey, man"
    TempContent = "";
    for (var i = 0; Metadata["Games"].length > i; i++) {
        if (!Metadata["Games"][i].Unlisted) AddGameTemp(Metadata["Games"][i].Base, Metadata["Games"][i].Index, Metadata["Games"][i].Title, Metadata["Games"][i].Icon)
    }

    Content.classList.add("GridLayout");
    if (typeof TemporaryLink !== "undefined") Options.innerHTML = TemporaryLink ? `[ ${Visitors} Users ] <a onclick='alert("Temporary links may shut down without notice!")'>[ Temporary Link ]</a>` : `[ ${Visitors} Users ]`;
    else Options.innerHTML = "";
    Content.innerHTML = TempContent;
}

async function LoadGame(ContentBase, IndexName) {
    if (!Agreed) return;
    const response = await fetch(GameRoot + ContentBase + "/" + IndexName);
    const text = await response.text();

    let finalText;

    if (!text.includes("<base") && !text.includes("<!-- Don't generate base -->")) {
        finalText = `<base href="${GameRoot + ContentBase}/">${text}`;
    } else {
        finalText = text;
    }

    if (ClickerEasteregg < 25) ClickerEasteregg = 0;

    Options.innerHTML = "<a onclick='document.getElementById(`RealIframe`).requestFullscreen();'>[ Fullscreen ]</a>";
    Content.innerHTML = `<iframe id="RealIframe" srcdoc="${finalText.replace(/"/g, '&quot;')}"></iframe>`;
}

function AddGameTemp(ContentBase, IndexName, Title, Icon){
    TempContent += `
<div onclick="LoadGame('${ContentBase}', '${IndexName}')" class="game">
    <img src="${GameRoot + Icon}">
    <div>${Title}</div>
</div>`;
}

function CloakSite() { // ill use this later
    const NewTab = window.open("about:blank", "_blank");
    
    NewTab.document.open();
    NewTab.document.write(PageContent);
    NewTab.document.close();
}

async function RenewVisitation() {
    const response = await fetch(BackendURL + "/Visit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Session: Ticket
        })
    });

    const data = await response.json();
    Visitors = data.online;
}

window.onload = ()=> Initialize();