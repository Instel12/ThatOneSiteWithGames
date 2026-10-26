const PageContent = document.documentElement.innerHTML;

const Content = document.getElementsByClassName("Content")[0];
const Title = document.getElementById("Title");
const Options = document.getElementsByClassName("Options")[0];

let TempContent = "";
let Tags = [];
let Metadata = [];
let Agreed = false;

let ClickerEasteregg = 0;

if (!localStorage.getItem("TOSWG Ticket")) {
    localStorage.setItem("TOSWG Ticket", crypto.randomUUID());
}
const Ticket = localStorage.getItem("TOSWG Ticket");
let Visitors = -1;

const BackendURL = "https://suzuki-royal-mountains-intended.trycloudflare.com";

const VeryMeaningfulMessages = [
    // 1738, aye
    // I'm like
    "hey",
    "whats up",
    "hello",

    "ngl ima take a nap lmk",
    "who do you think you are, i am",
    "oh how i hate shockwaves 🤓",
    "ngl, ur pretty cool",
    "999",
    "please speed i need this",
    "im top admin in the furry roleplay discord",
    "i guess bro",
    "what is a \"bool\"",
    "ima say a really some really bad words: heck, stupid, darn, dang, idiot, shoot. i bet you didnt know i knew those words",
    "stay sober",
    "the following are unfunny to joke about:\n9/11\nWorld War II\nCancer\nDisabilities",
    "funkey ehh",
    "yuh"
];

async function Initialize() {
    Options.innerHTML = "";

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
            <br>
            <button onclick="LoadNickEh30(); Agreed = true;">Accept (With Nick Eh 30 Intro)</button>
        </div>
    `;
}

function LoadNickEh30() {
    Content.innerHTML = `
        <video src="nickeh30.mp4" autoplay style="width: 100%; height: 100%;"></video>
    `;

    const video = Content.querySelector("video");
    video.onended = () => {
        LoadHome();
    };
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
    if (typeof TemporaryLink !== "undefined") Options.innerHTML = TemporaryLink ? `[ ${Visitors} User${Visitors == 1 || Visitors == -1 ? "" : "s"} Online ] <a onclick='alert("Temporary links may shut down without notice!")'>[ Temporary Link ]</a>` : `[ ${Visitors} User${Visitors == 1 || Visitors == -1 ? "" : "s"} Online ]`;
    else Options.innerHTML = "";
    Content.innerHTML = TempContent;
}

function SetLoading() {
    Content.classList.remove("GridLayout");

    Content.innerHTML = `<div class="InfoUI">
        <h1 style="color:yellow;">[ Loading ]</h1>
        <p>${VeryMeaningfulMessages[Math.floor(Math.random() * VeryMeaningfulMessages.length)]}</p>
        <p>Loading the base file. Please wait...</p>
    </div>`;
}

async function LoadGame(ContentBase, IndexName) {
    SetLoading();
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

function download(filename, text) { // credits to @johnpyp on stack overflow
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function DumpStorage() {
    const data = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }

    const json = JSON.stringify(data, null, 2);
    download("TOSWG Backup.json", json);
}

window.onload = ()=> Initialize();