// =========================
// 📦 Импорт на зависимости
// =========================
const express = require('express');
const path = require('path');
const useragent = require('express-useragent');
const helmet = require('helmet');
const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');

// =========================
// ⚙️ Зареждане на .env
// =========================
dotenv.config();

const port = process.env.PORT || 3000;
const GTM_ID = process.env.GTM_ID;
const GA_ID = process.env.GA_ID;
const CLARITY_ID = process.env.CLARITY_ID;
const isProd = process.env.NODE_ENV === 'production';

const app = express();

// =========================
// 🛡️ Nonce + CSP Middleware
// =========================
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms`,
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.clarity.ms",
    "frame-src 'self' https://www.googletagmanager.com https://www.clarity.ms",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  res.setHeader("Content-Security-Policy", csp);
  next();
});

// =========================
// 🧰 Основни middlewares
// =========================
app.use(useragent.express());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'pug');
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://www.clarity.ms",
        (req, res) => `'nonce-${res.locals.nonce}'`
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      frameSrc: ["'self'", "https://www.googletagmanager.com", "https://www.clarity.ms"],
    },
    reportOnly: true,
  })
);

// =========================
// 🧾 manifest.json endpoint
// =========================
const isDesktop = (userAgent) => /Windows|Macintosh|Linux/.test(userAgent);

app.get('/manifest.json', function (req, res) {
  const iconUrl = isDesktop(req.useragent.platform)
    ? '/static/fonts/fontawesome-webfont.svg'
    : '/static/fonts/fontawesome-webfont.svg';

  const manifest = {
    name: "My Resume Site",
    short_name: "Resume",
    description: "This is a Resume site on my portfolio.",
    version: "1.0.0",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: [
      "*://cookieinfoscript.com/*",
      "*://google-analytics.com/*",
      "*://tagmanager.google.com/*",
      "*://fonts.googleapis.com/*"
    ],
    content_security_policy:
      "script-src 'self' 'nonce-randomNonceValue' https://www.googletagmanager.com https://google-analytics.com https://www.clarity.ms; object-src 'none';",
    background_color: "#3367D6",
    theme_color: "#3367D6",
    icons: [
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(manifest, null, 2));
});

// =========================
// 🏠 Главна страница
// =========================
app.get('/', (req, res) => {
  const nonce = res.locals.nonce;

  const analyticsScripts = isProd
    ? `
      <!-- ✅ Google Tag Manager -->
      <script nonce="${nonce}">
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          var n=d.querySelector('[nonce]');
          if(n) j.setAttribute('nonce', n.nonce || n.getAttribute('nonce'));
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      </script>

      <!-- ✅ Google Analytics -->
      <script nonce="${nonce}" async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
      <script nonce="${nonce}">
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      </script>

      <!-- ✅ Microsoft Clarity -->
      <script nonce="${nonce}">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            var n=l.querySelector('[nonce]');
            if(n) t.setAttribute('nonce', n.nonce || n.getAttribute('nonce'));
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      </script>
    `
    : `
      <!-- ⚠️ Development Mode -->
      <script nonce="${nonce}">
        console.warn('Analytics scripts are disabled in development mode.');
      </script>
    `;


    // Serve the HTML file
    res.sendFile(__dirname + '/index.html');
});


// =========================
// 🚀 Стартиране на сървъра
// =========================
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌍 Mode: ${isProd ? 'Production' : 'Development'}`);
  console.log(`📊 GTM: ${GTM_ID || 'Not set'}`);
  console.log(`📈 GA: ${GA_ID || 'Not set'}`);
  console.log(`🧠 Clarity: ${CLARITY_ID || 'Not set'}`);
});
