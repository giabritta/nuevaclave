# Sito vetrina – Dance Academy Nueva Clave (Gradisca d'Isonzo)

Sito statico generato con **Jekyll** e pubblicato gratis su **GitHub Pages**. Gli eventi si gestiscono con **Pages CMS**.

## Perché questa tecnologia
- **Vetrina, nessun e-commerce**: un sito statico è veloce, sicuro (niente database da attaccare né plugin da aggiornare) e costa zero di hosting.
- **Ogni evento ha la sua pagina** (`/eventi/<nome>/`) con i meta tag Open Graph: quando il link viene condiviso su Facebook o WhatsApp compare la locandina in anteprima.
- **Pannello senza codice**: lo staff carica la locandina da [app.pagescms.org](https://app.pagescms.org) e compila un modulo. Pages CMS salva il file nel repository e GitHub Pages ripubblica il sito in circa un minuto.
- **Dominio personalizzato**: si può collegare `danceacademynuevaclave.it` da *Settings → Pages → Custom domain*. In quel caso in `_config.yml` vanno impostati `url: "https://www.danceacademynuevaclave.it"` e `baseurl: ""`.

## Struttura
| Percorso | Contenuto |
|---|---|
| `index.html` | Home: hero, corsi, chi siamo, eventi, galleria, contatti |
| `eventi/index.html` | Elenco eventi; quelli passati finiscono da soli in archivio |
| `_eventi/*.md` | Un file per evento (front matter: title, date, data_fine, orario, luogo, citta, locandina, descrizione) |
| `_layouts/evento.html` | Pagina evento con i pulsanti di condivisione (Facebook, Instagram, WhatsApp, link, calendario) |
| `carica/` | Guida per lo staff al caricamento delle locandine |
| `.pages.yml` | Configurazione del pannello Pages CMS |
| `assets/` | CSS, JS, foto e locandine |

## Abilitare il pannello per lo staff della scuola
1. Accedi ad [app.pagescms.org](https://app.pagescms.org) con l'account GitHub proprietario del repository e installa l'app GitHub di Pages CMS sul repository `nuevaclave`.
2. In *Settings → Collaborators* del progetto su Pages CMS invita l'email della scuola: lo staff accede tramite un link via email, senza bisogno di un account GitHub.
