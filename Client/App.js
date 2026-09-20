const Content = document.getElementsByClassName("Content")[0];
const Title = document.getElementById("Title");

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
    "oh how i hate shockwaves 🤓"
];

async function Initialize() {
    const response = await fetch(MetadataPath);
    Metadata = await response.json();

    for (var i = 0; Metadata["Games"].length > i; i++) {
        for (var tag = 0; tag < Metadata["Games"][i]["Tags"].length; tag++) {
            if (!Tags.includes(Metadata["Games"][i]["Tags"][tag])) Tags.push(Metadata["Games"][i]["Tags"][tag]);
        }
    }
    
    LoadHome();

    console.log(Metadata["Games"].length + " games loaded")
    console.log(VeryMeaningfulMessages[Math.floor(Math.random() * VeryMeaningfulMessages.length)]);
}

function LoadHome() {
    ClickerEasteregg++;
    if (ClickerEasteregg > 24)
    {
        Title.innerText = `TOSWG [ ${ClickerEasteregg-25} ]`;
        if (ClickerEasteregg == 25) alert("Do you want a clicker?");
    }

    Content.textContent = "hey, man"
    TempContent = "";
    for (var i = 0; Metadata["Games"].length > i; i++) {
        AddGameTemp(Metadata["Games"][i].Base, Metadata["Games"][i].Index, Metadata["Games"][i].Title, Metadata["Games"][i].Icon)
    }

    Content.innerHTML = TempContent;
}

async function LoadGame(ContentBase, IndexName) {
    const response = await fetch(GameRoot + ContentBase + "/" + IndexName);
    const text = await response.text();

    let finalText;

    if (!text.includes("<base") && !text.includes("<!-- Don't generate base -->")) {
        finalText = `<base href="${GameRoot + ContentBase}/">${text}`;
    } else {
        finalText = text;
    }

    if (ClickerEasteregg < 25) ClickerEasteregg = 0;
    Content.innerHTML = `<iframe srcdoc="${finalText.replace(/"/g, '&quot;')}"></iframe>`;
}

function AddGameTemp(ContentBase, IndexName, Title, Icon){
    TempContent += `
<div onclick="LoadGame('${ContentBase}', '${IndexName}')" class="game">
    <img src="${GameRoot + Icon}">
    <div>${Title}</div>
</div>`;
}

window.onload = ()=> Initialize();