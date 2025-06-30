const versionUrl = "https://raw.githubusercontent.com/tobywomack04/tobywomack.com/main/version.txt";

fetch(versionUrl)
  .then(res => res.text())
  .then(ver => {
    const versionElement = document.getElementById("versionText");
    if (versionElement) {
      versionElement.textContent = `Version: ${ver.trim()}`;
    }
  })
  .catch(() => {
    const versionElement = document.getElementById("versionText");
    if (versionElement) {
      versionElement.textContent = "Version: Unknown";
    }
  });