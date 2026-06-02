const SUB_URL = "https://pk.spk123456.workers.dev/sub/raw/STEeZxHJd9GMUqm%40?app=xray";

document.getElementById("copySubBtn").onclick = () => {
    navigator.clipboard.writeText(SUB_URL);
    alert("Subscription copied");
};

const container = document.getElementById("configsContainer");

for(let i=1;i<=6;i++){

    const card=document.createElement("div");
    card.className="server-card";

    card.innerHTML=`
        <div class="server-name">🇩🇪 Germany ${i}</div>

        <div class="card-actions">
            <button class="copy-btn">Copy</button>
            <button class="qr-btn">QR</button>
            <button class="import-btn">Import</button>
        </div>
    `;

    container.appendChild(card);
}

document.getElementById("configCount").innerText="6";
