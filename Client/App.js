let agreed = true;

if (!confirm("wsp, im too lazy to add ui rn\n\nanyway, use this responsibly and don't be stupid\nif you do smth wrong, its not my fault")) {
    document.documentElement.innerHTML = "you can just leave now, if you change your mind and agree, go ahead and refresh the page";
    agreed = false;
}

const PageContent = document.documentElement.innerHTML;

const Content = document.getElementsByClassName("Content")[0];
const Title = document.getElementById("Title");
const Options = document.getElementsByClassName("Options")[0];

let TempContent = "";
let Tags = [];
let Metadata = [];

let ClickerEasteregg = 0;

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
    if (!agreed) return;
    const response = await fetch(MetadataPath);
    Metadata = await response.json();

    for (var i = 0; Metadata["Games"].length > i; i++) {
        for (var tag = 0; tag < Metadata["Games"][i]["Tags"].length; tag++) {
            if (!Tags.includes(Metadata["Games"][i]["Tags"][tag])) Tags.push(Metadata["Games"][i]["Tags"][tag]);
        }
    }
    
    Title.innerText = "[ TOSWG ]";

    LoadHome();

    console.log(Metadata["Games"].length + " games loaded")
    console.log(VeryMeaningfulMessages[Math.floor(Math.random() * VeryMeaningfulMessages.length)]);
}

function LoadHome() {
    if (!agreed) return;
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

    if (typeof TemporaryLink !== "undefined") Options.innerHTML = TemporaryLink ? "<a onclick='alert(`Temporary links may shut down without notice!`)'>[ Temporary Link ]</a>" : "";
    else Options.innerHTML = "";
    Content.innerHTML = TempContent;
}

async function LoadGame(ContentBase, IndexName) {
    if (!agreed) return;
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

window.onload = ()=> Initialize();