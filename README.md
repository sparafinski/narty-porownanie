# Porównanie wyjazdów narciarskich 2027

Interaktywne porównanie zimowych wyjazdów SnowShow i Feel The Flow (styczeń–marzec 2027): sortowanie po koszcie, długości tras i cenie za kilometr, filtry organizatora i miesiąca, przełącznik autokar / własne auto oraz edytowalne kursy EUR i CHF.

Strona jest w pełni statyczna (HTML + CSS + JS, bez budowania i zależności), więc działa od razu na GitHub Pages.

## Publikacja na GitHub Pages

1. Utwórz nowe repozytorium na GitHubie, np. `narty-porownanie` (może być publiczne).
2. Wgraj zawartość tego folderu, przez stronę („Add file → Upload files”) albo z terminala:
   ```bash
   git init
   git add .
   git commit -m "Pierwsza wersja porównania"
   git branch -M main
   git remote add origin https://github.com/TWOJ-LOGIN/narty-porownanie.git
   git push -u origin main
   ```
3. W repozytorium wejdź w **Settings → Pages**.
4. W sekcji **Build and deployment** wybierz **Source: Deploy from a branch**, gałąź **main** i folder **/ (root)**, potem **Save**.
5. Po minucie lub dwóch strona będzie pod adresem `https://TWOJ-LOGIN.github.io/narty-porownanie/`.

## Podgląd lokalny

Wystarczy otworzyć `index.html` w przeglądarce. Możesz też uruchomić prosty serwer:
```bash
python3 -m http.server 8000
```
i wejść na http://localhost:8000.

## Struktura

```
index.html        – układ strony
assets/style.css  – wygląd (jasny i ciemny motyw)
assets/data.js    – dane ofert: tu dopisujesz lub zmieniasz wyjazdy i ceny
assets/app.js     – logika: liczenie kosztów, sortowanie, filtry
.nojekyll         – wyłącza przetwarzanie Jekyll na GitHub Pages
```

## Jak zaktualizować ceny lub dodać ofertę

Edytuj `assets/data.js`. Każdy ośrodek to obiekt z polami m.in. `name`, `km`, `fees`, `cur`, `ins`, `ownCut`, `busAdd` oraz listą `dates`, w której każdy termin ma postać:

```js
["05.03–14.03", "https://link-do-oferty", 2540, "03"]
```

czyli etykieta, link, cena „od” w złotych i miesiąc. Koszt łączny liczy się sam:
cena + ubezpieczenie + opłaty na miejscu × kurs ± transport.

Dane pochodzą ze stron organizatorów (stan na 3 listopada 2026). Ceny się zmieniają, więc przed rezerwacją sprawdź aktualną ofertę.
