# PlaygroundAI — manuale per agenti (Codex, Claude, umani)

Portale di giochi browser in italiano, live su **https://playgroundai.space**.
Statico puro: niente build, niente framework, niente dipendenze. Quello che c'è nel repo è quello che va online.

## Pubblicazione
- Hosting: **GitHub Pages** dal branch `main`, cartella root di questo repo (`ManusTheGallicPlague/playgroundai`).
- **Pubblicare = fare push su `main`**. Il deploy è automatico in ~30-60 secondi. Nessun altro passaggio.
- DNS: gestiti su Cloudflare (apex → 4 A record GitHub Pages, DNS-only). **Non serve toccarli mai da qui.**

## Struttura
- `index.html` — home: griglia dei 6 giochi, slot pubblicitari, sezioni. CSS/JS inline.
- `games/*.html` — 12 giochi, **ognuno un singolo file autonomo** (CSS+JS inline, canvas/DOM, audio sintetizzato via WebAudio). Nessun asset esterno tranne Google Fonts.
- `privacy.html` — informativa privacy/cookie (richiesta da AdSense).
- `sw.js` — service worker (PWA): stale-while-revalidate stesso dominio + cache font.
- `manifest.json`, `icon-*.png`, `apple-touch-icon.png` — PWA.
- `ads.txt`, `CNAME`, `.nojekyll`.

## REGOLE VITALI (violarle rompe il sito)
1. **MAI cancellare o modificare `CNAME`** (contiene `playgroundai.space`: è l'aggancio del dominio).
2. **MAI rimuovere** lo snippet AdSense (`ca-pub-3368917580765134`) dagli `<head>` né il file `ads.txt`: account in verifica presso Google.
3. **Se aggiungi una pagina nuova**, aggiungila anche all'array `CORE` in `sw.js` (altrimenti non va offline). Se modifichi pagine esistenti non serve: lo SWR le aggiorna al secondo caricamento.
4. I giochi devono restare **file singoli autosufficienti**: niente CDN, niente librerie esterne, niente fetch. Unica eccezione ammessa: Google Fonts.
5. **Non intercettare mai le richieste pubblicitarie nel service worker** (googlesyndication/adsbygoogle devono viaggiare fresche).
6. Ogni gioco ha in fondo la pillola `<a class="pgai-back">` per tornare alla home: mantienila.

## Ottimizzazioni mobile da preservare
- `touch-action:manipulation` + tap-highlight trasparente su html/body di ogni gioco (evita lo zoom da doppio tap).
- Blocco del `contextmenu` sui canvas (long-press Android).
- `eco.html` e `microlabirinto.html`: il puntatore ha un **offset verticale sopra il dito** su touch (-44/-56 px) e uno shim che propaga `pointerType` al primo tocco. Non rimuoverli: senza, i giochi sono ingiocabili al telefono.
- `sisifo.html`: hint touch visibile solo su `pointer:coarse`.

## Convenzioni di qualità
- Lingua: **italiano**, tono giocoso ma pulito.
- Prima di pushare, valida il JS di ogni file toccato: estrai i blocchi `<script>` e passali a `node --check`.
- Record e progressi dei giochi vivono in `localStorage`: non cambiare le chiavi esistenti (`bastioneBest`, `ecoBest`, `palazzoBest`, `sisifoBest`, `skibidiBest`) o gli utenti perdono i record.
- Slot pubblicitari nella home: `.ad-slot` (2 rail verticali desktop + 2 banner). Quando AdSense approva, le unità vanno incollate lì dentro (commenti segnaposto presenti).

## Stato monetizzazione
- AdSense: sito in verifica (richiesta 26/08/2026). Dopo l'approvazione: unità display negli slot, "Privacy e messaggi" per il consenso UE, e in prospettiva H5 Games Ads (interstitial/rewarded nei giochi).

## Copia di test interna
- Sulla N40 (rete interna) gira una copia in Docker su :8090 — è solo uno specchio manuale, non fa parte del deploy. Il canale ufficiale è il push su main.

## Immagini e coordinamento (aggiunto 26/08 dopo il redesign)
- **Immagini sempre in WebP** (quality ~82, max 1200px di lato lungo, idealmente < 150 KB l'una). Niente PNG da 700 KB+ in produzione: il sito deve restare sotto il mezzo MB totale.
- Sul repo lavorano più agenti: **`git pull --rebase` prima di ogni push**. Non forzare mai il push.
- La cartella `assets/` può contenere artwork per home e anteprime giochi; i giochi restano comunque file singoli senza asset esterni.
