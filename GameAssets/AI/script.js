const StorageKey = "TOSWGAI";

let CurrentChat = null;
let IsSending = false;

function GetChats() {
    return JSON.parse(localStorage.getItem(StorageKey) || "{}");
}

function SaveChats(chats) {
    localStorage.setItem(StorageKey, JSON.stringify(chats));
}

function NewChat() {
    const chats = GetChats();
    const id = crypto.randomUUID();

    chats[id] = {title: "New Chat", messages: []};

    SaveChats(chats);
    CurrentChat = id;

    RenderChats();
    RenderMessages();

    document.getElementById("SendMessage").focus();
}

function LoadChat(id) {
    const chats = GetChats();

    CurrentChat = id;

    RenderChats();
    RenderMessages();
}

function RenderChats() {
    const container = document.getElementById("Chats");
    const chats = GetChats();

    container.replaceChildren();

    Object.entries(chats).reverse().forEach(([id, chat]) => {
        const button = document.createElement("button");

        button.className = "chat-entry";
        button.textContent = chat.title || "New Chat";

        if (id === CurrentChat) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => LoadChat(id));
        container.appendChild(button);
    });
}

function RenderMessages() {
    const container = document.getElementById("Chat");
    const chats = GetChats();
    const chat = chats[CurrentChat];

    container.replaceChildren();

    if (!chat || chat.messages.length === 0) {
        const welcome = document.createElement("div");
        welcome.className = "welcome";
        welcome.textContent = "Welcome to TOSWG AI! Ask anything, be responsible.";
        container.appendChild(welcome);
        return;
    }

    chat.messages.forEach(message => {
        const bubble = document.createElement("div");
        bubble.className = `message ${message.role}`;

        const label = document.createElement("strong");
        label.textContent = message.role === "user" ? "You" : "TOSWG AI";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = message.content;

        bubble.append(label, content);
        container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
}


async function SaySmth(input) {
    if (!CurrentChat) {
        NewChat();
    }

    const chatId = CurrentChat;
    const chats = GetChats();
    const chat = chats[chatId];

    chat.messages.push({role: "user", content: input});

    if (chat.title === "New Chat") {
        chat.title = input.slice(0, 35) + (input.length > 35 ? "..." : "");
    }

    SaveChats(chats);
    RenderChats();
    RenderMessages();

    try {
        const res = await fetch(
            `${CurrentBackend}/AI`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: chat.messages
                })
            }
        );

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error?.message || JSON.stringify(data.error || data) || `HTTP ${res.status}`);
        }

        const reply = data.choices?.[0]?.message?.content;
        const latestChats = GetChats();

        latestChats[chatId].messages.push({role: "assistant", content: reply});

        SaveChats(latestChats);

        if (CurrentChat === chatId) {
            RenderMessages();
        }

        return reply;
    } catch (error) {
        throw error;
    }
}

async function SendMessage(event) {
    event.preventDefault();

    if (IsSending) return;

    const input = document.getElementById("SendMessage");
    const sendButton = document.getElementById("SendButton");
    const text = input.value.trim();

    if (!text) return;

    IsSending = true;
    input.value = "";
    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";

    try {
        await SaySmth(text);
    } catch (error) {
        const chats = GetChats();
        const chat = chats[CurrentChat];

        if (chat) {
            const notice = document.createElement("p");
            notice.className = "error";
            notice.textContent = `Request failed: ${error.message}`;
            document.getElementById("Chat").appendChild(notice);
        }

        input.value = text;
    } finally {
        IsSending = false;
        sendButton.disabled = false;
        sendButton.textContent = "Send";
        input.focus();
    }
}

document.getElementById("NewChat").addEventListener("click", NewChat);
document.getElementById("Composer").addEventListener("submit", SendMessage);

const savedChats = GetChats();
const existingChat = Object.keys(savedChats).at(-1);

if (existingChat) {
    LoadChat(existingChat);
} else {
    NewChat();
}