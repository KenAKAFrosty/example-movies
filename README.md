Easily one-click host this same project on Railway!
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/_Me6-6)



# Qwik Movies Example
This was a Qwik version of Ryan's original Remix example
[Demo](https://remix-movies.pages.dev/)
[Repo](https://github.com/remix-run/example-movies)

The focus was on data loading patterns, especially in a world of mixed SSR/CSR
For this Qwik version I wanted to try an approach that relied heavily on caching. ([See Tweet])[https://twitter.com/KenAKAFrosty/status/1767075551133478957]



## Possible TODO/ good PR Contributions:
- 📃 Implement a No-JS working version using forms/actions 
- 🖼 More thoughtful ideas on image loading / cool ways to preload small images in a sane way
- 🧙‍♂️ Simple solution to the browser showing empty image even when the image source is loaded from disk cache? It's incredibly fast, but there's still a slight flicker.  Wonder if there's some relatively simple html/css wizardry we could use there
- 👆 A better "excuse" to have a more standard `server$` call in there. 
    - Ideally it's optional data, like maybe upvoting or favoriting a movie or something. I just wanted to make sure that the use of the very powerful `server$` wasn't overlooked in a public demo. My current choice of doing a preview of the movie description is dumb.
    


Original / standard README for a Qwik app below:
---
# Qwik City App ⚡️

- [Qwik Docs](https://qwik.builder.io/)
- [Discord](https://qwik.builder.io/chat)
- [Qwik GitHub](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/guides/static-site-generation/).

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## Bun Server

This app has a minimal [Bun server](https://bun.sh/docs/api/http) implementation. After running a full build, you can preview the build using the command:

```
bun run serve
```

Then visit [http://localhost:3000/](http://localhost:3000/)
