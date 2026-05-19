# [NoNonsense.cooking](https://nononsense.cooking)

NoNonsenseCooking is a static site for curated recipes, built with [Hugo](https://gohugo.io/). It keeps pages fast and free of the usual recipe-site bloat.

## Why?

A place to share favorite recipes without overwhelming ads and trackers.

## Requirements

- [Hugo](https://gohugo.io/installation/) Extended **0.161.1+** (or build with the `Dockerfile`, which uses `ghcr.io/gohugoio/hugo:v0.161.1`)

## Local development

```bash
hugo server
```

Open the URL Hugo prints (usually `http://localhost:1313/`).

## Adding a recipe

Recipes are page bundles under `content/r/<slug>/`:

- `index.en.md` — English (with matching `index.de.md` for German)
- Shared `translationKey` in front matter (typically the folder name)
- Optional image file beside the markdown (e.g. `my-dish.jpg` referenced as `image: my-dish.jpg`)

Use `hugo new content/r/<slug>/index.en.md` and edit the front matter; see an existing bundle for the full shape (`ingredients` in front matter, numbered steps in the markdown body).

If the image is not in the bundle, place a **3:2** image under `static/img/recipes/` and reference its filename in `image`.

## “Most popular” recipes (Plausible)

Homepage ordering can use `data/popular.yaml` (`en` / `de` lists of **recipe folder slugs**).

Refresh from your self-hosted Plausible instance:

```bash
export PLAUSIBLE_API_KEY=...
# optional: PLAUSIBLE_BASE_URL, SITE_ID, PERIOD, LIMIT
./scripts/fetch-popular.sh
```

This writes `data/popular.yaml` and runs `hugo --minify --gc`.

## Production build

```bash
hugo --minify --gc
```

Output is in `public/`.

## Docker + Traefik

The image serves the static `public/` tree with **Caddy** on port **8080** (TLS terminates at Traefik).

```bash
docker build -t nononsensecooking .
docker run --rm -p 8080:8080 nononsensecooking
```

Example `docker-compose.yml` (external `traefik` network) is in the repo root—adjust host / cert resolver labels to match your setup.

## License

- **Recipes and images** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — content under `content/r/` and files in `static/img/recipes/`. See `LICENSE-recipes`.
- **Site source** — MIT. See `LICENSE-code`.

_Please don't copy recipes from the internet or cookbooks without significant modifications. Use only images you took yourself._
