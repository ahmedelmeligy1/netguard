(() => {
  const form = document.getElementById("scan-form");
  const input = document.getElementById("target");
  const wrap = input.closest(".input-wrap");
  const btn = document.getElementById("scan-btn");
  const label = btn.querySelector(".btn-label");
  const msg = document.getElementById("scan-msg");
  const progress = document.getElementById("progress");
  const bar = progress.querySelector("span");

  // IPv4 (192.168.1.100) أو CIDR (192.168.1.0/24)
  const octet = "(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
  const ipv4 = `${octet}\\.${octet}\\.${octet}\\.${octet}`;
  const pattern = new RegExp(`^${ipv4}(\\/(3[0-2]|[12]?\\d))?$`);

  // placeholder أقصر على الموبايل عشان ما يتقطعش
  const mq = window.matchMedia("(max-width: 520px)");
  const setPlaceholder = () => { input.placeholder = mq.matches ? "192.168.1.0/24" : "e.g. 192.168.1.100 or 192.168.1.0/24"; };
  setPlaceholder();
  mq.addEventListener("change", setPlaceholder);

  const setMsg = (text, type = "") => {
    msg.textContent = text;
    msg.className = "scan-msg " + type;
  };

  input.addEventListener("input", () => {
    wrap.classList.remove("invalid");
    if (!msg.classList.contains("ok")) setMsg("");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (!pattern.test(value)) {
      wrap.classList.add("invalid");
      setMsg("Enter a valid IP address (192.168.1.100) or range (192.168.1.0/24).", "error");
      input.focus();
      return;
    }
    startScan(value);
  });

  // محاكاة للمسح — اربطها بالـ Backend الحقيقي (انظر التعليق أسفل)
  function startScan(target) {
    const steps = [
      "Discovering hosts…",
      "Identifying services…",
      "Running ML analysis…",
      "Matching CVEs from NVD…",
      "Building report…",
    ];
    let i = 0;

    btn.disabled = true;
    label.textContent = "Scanning…";
    progress.hidden = false;
    bar.style.width = "0";
    setMsg(`${steps[0]} (${target})`);

    const timer = setInterval(() => {
      i++;
      bar.style.width = `${(i / steps.length) * 100}%`;
      if (i < steps.length) {
        setMsg(`${steps[i]} (${target})`);
      } else {
        clearInterval(timer);
        btn.disabled = false;
        label.textContent = "Start Scan";
        setMsg(`Scan complete for ${target}. Report is ready.`, "ok");
        setTimeout(() => { progress.hidden = true; }, 1200);
      }
    }, 900);

    /* لربطها بسيرفر حقيقي بدل المحاكاة:
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target }),
    }).then(r => r.json()).then(console.log);
    */
  }
})();
