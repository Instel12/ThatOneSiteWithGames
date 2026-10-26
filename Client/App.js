const PageContent = document.documentElement.innerHTML;

const Content = document.getElementsByClassName("Content")[0];
const Title = document.getElementById("Title");
const Options = document.getElementsByClassName("Options")[0];

let TempContent = "";
let Tags = [];
let Metadata = [];
let Agreed = false;

let ClickerEasteregg = 0;

const TabMode = true; // I prolly wont release this but you can use it on your link if you want.

if (!localStorage.getItem("TOSWG Ticket")) {
    localStorage.setItem("TOSWG Ticket", crypto.randomUUID());
}
const Ticket = localStorage.getItem("TOSWG Ticket");
let Visitors = -1;

const BackendURL = "https://suzuki-royal-mountains-intended.trycloudflare.com";

const VeryMeaningfulMessages = [
    "hi",
    "ngl ima take a nap lmk",
    "who do you think you are, i am",
    "oh how i hate shockwaves 🤓",
    "ngl, ur pretty cool",
    "999",
    "please speed i need this",
    "im top admin in the furry roleplay discord (I'm joking)",
    "i guess bro",
    "what is a \"bool\"",
    "ima say a really some really bad words: heck, stupid, darn, dang, idiot, shoot. i bet you didnt know i knew those words",
    "stay sober",
    "the following are unfunny to joke about:\n9/11\nWorld War II\nCancer\nDisabilities",
    "funkey ehh",
    "yuh"
];

async function Initialize() {
    window.addEventListener("scroll", () => {
        document.getElementById("Background").style.backgroundPosition = `0px ${window.scrollY * 0.25}px`;
    });

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
            <!-- <br><button onclick="LoadNickEh30(); Agreed = true;">Accept (With Nick Eh 30 Intro)</button> -->
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

let AlreadyPreloaded = false;
async function LoadHome() {
    if (!Agreed) return;

    if (AlreadyPreloaded) {
        DisplayHome();
        AlreadyPreloaded = true;
        return;
    }

    const message = VeryMeaningfulMessages[Math.floor(Math.random() * VeryMeaningfulMessages.length)];

    Content.innerHTML = `
        <div class="InfoUI" id="PreloadScreen">
            <h1 style="color:yellow;">[ Preloading ]</h1>
            <p id="PreloadStatus">Preparing icons...</p>
            <progress id="PreloadProgress" value="0" max="100"></progress>
            <button onclick="DisplayHome();" style="margin-top: 25px;">Skip</button>
        </div>
    `;

    const games = Metadata["Games"].filter(game => !game.Unlisted);
    const total = games.length;
    let loaded = 0;

    const status = document.getElementById("PreloadStatus");
    const progress = document.getElementById("PreloadProgress");

    await Promise.all(games.map(game => {
        return new Promise(resolve => {
            const img = new Image();

            img.onload = () => {
                loaded++;
                progress.value = (loaded / total) * 100;
                status.textContent = `${message} [ ${loaded}/${total} ]`;
                resolve();
            };

            img.onerror = () => {
                loaded++;
                progress.value = (loaded / total) * 100;
                status.textContent = `${message} [ ${loaded}/${total} ] (failed)`;
                resolve();
            };

            img.src = GameRoot + game.Icon;
        });
    }));

    // this makes it feel more official
    // oh and if you have faster speeds than for what this loading screen is designed for, you can actually read the message
    await new Promise(resolve => setTimeout(resolve, 1500));

    DisplayHome();
}

function DisplayHome() {
    if (!Agreed) return;

    AlreadyPreloaded = true;
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