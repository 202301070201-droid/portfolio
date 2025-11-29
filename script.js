document.addEventListener("click", function (event) {
  if (event.target.hasAttribute("data-theme")) {
    const themeFile = event.target.getAttribute("data-theme");
    const themeButtons = document.querySelectorAll("[data-theme]");
    themeButtons.forEach((btn) => btn.classList.remove("active-theme"));
    event.target.classList.add("active-theme");
    document.getElementById("themeStylesheet").setAttribute("href", themeFile);
  }
});

// Initialize Repository modal logic
document.addEventListener('DOMContentLoaded', function () {
  const initBtn = document.getElementById('init-repo-btn');
  const initModal = document.getElementById('init-repo-modal');
  const closeModalBtn = document.getElementById('init-repo-close');
  const closeModalBtn2 = document.getElementById('init-repo-close-2');
  const copyBtn = document.getElementById('init-repo-copy');
  const downloadBtn = document.getElementById('init-repo-download');
  const remoteInput = document.getElementById('init-repo-remote');
  const branchInput = document.getElementById('init-repo-branch');
  const commandsArea = document.getElementById('init-repo-commands');

  if (!initBtn || !initModal || !commandsArea) return;

  function buildCommands() {
    const remote = (remoteInput && remoteInput.value.trim()) || '';
    const branch = (branchInput && branchInput.value.trim()) || 'main';
    let cmds = [];
    cmds.push('git init');
    cmds.push('git add .');
    cmds.push('git commit -m "Initial commit"');
    cmds.push(`git branch -M ${branch}`);
    if (remote) cmds.push(`git remote add origin ${remote}`);
    cmds.push('echo "Repository initialized."');
    const text = cmds.join('\n');
    commandsArea.value = text;
    return text;
  }

  initBtn.addEventListener('click', function () {
    initModal.style.display = 'flex';
    buildCommands();
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', () => (initModal.style.display = 'none'));
  if (closeModalBtn2) closeModalBtn2.addEventListener('click', () => (initModal.style.display = 'none'));

  window.addEventListener('click', function (e) {
    if (e.target === initModal) initModal.style.display = 'none';
  });

  if (remoteInput) remoteInput.addEventListener('input', buildCommands);
  if (branchInput) branchInput.addEventListener('input', buildCommands);

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      commandsArea.select();
      try {
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1400);
      } catch (err) {
        copyBtn.textContent = 'Copy Failed';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1400);
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      const text = buildCommands();
      // Create a PowerShell script for Windows users
      const psContent = text.replace(/\n/g, '\r\n');
      const blob = new Blob([psContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'init-repo.ps1';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
});
