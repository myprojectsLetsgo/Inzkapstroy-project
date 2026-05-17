const fs = require("fs");
const path = "public/landing.html";
let html = fs.readFileSync(path, "utf8");

html = html.replace(
  /<motion-dot /><label class="form-lbl" for="ft">Тип объекта<\/label>[\s\S]*?<\/select>\s*<\/motion-dot>\s*/,
  "",
);
html = html.replace(
  /<div class="form-grp"><label class="form-lbl" for="ft">Тип объекта<\/label>[\s\S]*?<\/select>\s*<\/motion-dot>\s*/,
  "",
);
html = html.replace(
  /<div class="form-grp"><label class="form-lbl" for="ft">Тип объекта<\/label>[\s\S]*?<\/select>\s*<\/div>\s*/,
  "",
);

const consentBlock = `<motion-dot />
          <label class="form-consent-lbl">
            <input type="checkbox" id="consent" required>
            <span>Согласен(на) с <a href="/privacy" target="_blank" rel="noopener">политикой конфиденциальности</a> и обработкой персональных данных *</span>
          </label>
        </motion-dot>
        <motion-dot />
          <label for="website_hp">Не заполнять</label>
          <input type="text" id="website_hp" name="website" tabindex="-1" autocomplete="off">
        </motion-dot>
        `;

const consentFixed = consentBlock
  .replace(/<motion-dot \/>/g, '<motion-dot />')
  .split("\n")
  .map((line, i) => {
    if (line.includes("<motion-dot />")) {
      if (i === 0) return '<div class="form-grp form-consent">';
      if (line.trim() === "<motion-dot />") return "";
    }
    if (line.includes("</motion-dot>")) return "</div>";
    return line;
  })
  .filter(Boolean)
  .join("\n        ");

// Manual clean consent HTML
const consentHtml = `        <div class="form-grp form-grp--hp" aria-hidden="true" style="position:absolute;left:-9999px;height:0;overflow:hidden">
          <label for="website_hp">Не заполнять</label>
          <input type="text" id="website_hp" name="website" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-grp form-consent">
          <label class="form-consent-lbl">
            <input type="checkbox" id="consent" required>
            <span>Согласен(на) с <a href="/privacy" target="_blank" rel="noopener">политикой конфиденциальности</a> и обработкой персональных данных *</span>
          </label>
        </div>
`;

if (!html.includes('id="consent"')) {
  html = html.replace(
    '<div class="form-grp"><label class="form-lbl" for="fd">',
    consentHtml + '        <div class="form-grp"><label class="form-lbl" for="fd">',
  );
}

if (!html.includes('src="/js/landing.js"')) {
  html = html.replace(
    /<script>[\s\S]*?<\/script>\s*(?=<\/body>)/,
    '<script src="/js/landing.js" defer></script>\n',
  );
}

html = html.replace(
  'href="#">Политика конфиденциальности</a>',
  'href="/privacy">Политика конфиденциальности</a>',
);

fs.writeFileSync(path, html);
console.log("landing.html patched");
