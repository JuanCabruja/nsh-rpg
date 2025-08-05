# ⇢ Instalar dependencias
!pip install -q requests beautifulsoup4 pandas tqdm

import re, time
from urllib.parse import urljoin
import requests, pandas as pd
from bs4 import BeautifulSoup
from tqdm.auto import tqdm


# ────────────────────────────────────────────────
# 1) PEGAR AQUÍ TUS COOKIES (desde navegador)
# ────────────────────────────────────────────────
MEMBER_ID = userdata.get('member_id')
PASS_HASH = userdata.get('pass_hash')

# ────────────────────────────────────────────────
# 2) Crear sesión con cookies ya activas
# ────────────────────────────────────────────────
s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Colab scraper)"})
s.cookies.set("member_id", MEMBER_ID, domain=".forumcommunity.net")
s.cookies.set("pass_hash", PASS_HASH, domain=".forumcommunity.net")

BASE = "https://nsh.forumcommunity.net/"
THREAD_ID = "63293962"
POSTS_PER_PAGE = 15
URL_TPL = f"?t={THREAD_ID}&st={{offset}}"
MAX_PAGES = 200

regex = re.compile(
    r"Nombre en Hobba:\s*(?P<hobba>.*?)\s+"
    r"Nombre del personaje:\s*(?P<personaje>.*?)\s+"
    r"Ficha:\s*(?P<ficha>\S+)\s+"
    r"Compra y experiencia gastada:\s*(?P<compra>.*?)(?:\n|$)",
    re.I | re.S
)

rows = []
offset = 0
page_count = 0

# ────────────────────────────────────────────────
# 2) Recorrer páginas dinámicamente
# ────────────────────────────────────────────────
with tqdm(desc="Páginas") as pbar:
    while True:
        url = f"{BASE}?t={THREAD_ID}&st={offset}"
        print(url)
        r = s.get(url, timeout=30)
        if r.status_code == 404:
            print(f"Página {page_count} no encontrada")
            break
        soup = BeautifulSoup(r.text, "html.parser")

        found_posts = 0
        # Filtrar contenido limpio sin firmas ni HTML raro
        for li in soup.select("li.post"):
          author = li.select_one("div.nick a").get_text(strip=True)
          date   = li.select_one("span.when")["title"]  # formato: "12/5/2025, 06:04:10"

          cell = li.select_one("td.right.Item > table.color > td")
          if not cell:
              continue
          sig = cell.find("div", class_="signature")
          if sig:
              sig.decompose()

          text = cell.get_text(separator="\n", strip=True)
          m = regex.search(text)
          if m:
              row = m.groupdict()
              row["autor"] = author
              row["fecha"] = date
              rows.append(row)



        if rows == 0:
            print("No se encontraron posts en esta página")
            break

        next_btn = soup.select_one("a.paginate_right")
        if not next_btn:
            print("No hay más páginas")
            break

        offset += POSTS_PER_PAGE
        page_count += 1
        pbar.update(1)
        time.sleep(1.5)


# ────────────────────────────────────────────────
# 4) Mostrar y guardar resultados
# ────────────────────────────────────────────────
df = pd.DataFrame(rows).drop_duplicates()
print(f"Posts capturados: {len(df)}")
df.head()

# Guardar a archivo
df.to_csv("posts_nsh.csv", index=False)
