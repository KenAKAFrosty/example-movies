import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { GitHubLogo, QwikLogo } from "~/components/icons";

export default component$(() => {
  useStylesScoped$(`
    main { 
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      min-height 100dvh;
    }
    div { 
      flex-grow: 1;
    }
  `);

  return (
    <main>
      <Header />
      <div>
        <Content />
      </div>
      <Footer />
    </main>
  );
});

const Content = component$(() => {
  useStylesScoped$(`
    
  `);

  return (
    <main>
      <h1>Movies!</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
    </main>
  );
});

const Header = component$(() => {
  useStylesScoped$(`
    header { 
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 12px;
    }
    a svg { 
      height: 1em;
      width: 1em;
      margin-bottom: -2px;
    }
  `);
  return (
    <header>
      <a href="https://github.com/KenAKAFrosty/example-movies">
        <GitHubLogo />
        Code
      </a>
    </header>
  );
});

const Footer = component$(() => {
  useStylesScoped$(`
    footer { 
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      font-size: 12px;
    }
    div { 
      display: flex;
      align-items: center;
    }
    .qwik a { 
      color: inherit;
    }
    .qwik a svg { 
      height: 2em;
      margin-bottom: -5px;
      margin-right: -12px;
    }
    .qwik { 
      font-size: 18px;
    }
    .others a { 
      min-width: 180px;
      text-align: center;
    }
  `);
  return (
    <footer>
      <div class="qwik">
        <p>Powered by </p>
        <a href="https://qwik.dev">
          <QwikLogo />
        </a>
      </div>
      <div class="others">
         <a href="https://remix-movies.pages.dev/">Ryan's Original Remix Example</a><a href="https://sveltekit-movies-demo.vercel.app/">Rich's SvelteKit Example</a>
      </div>
    </footer>
  );
});

export const head: DocumentHead = {
  title: "Qwik | Example Movies",
  meta: [
    {
      name: "Qwik | Example Movies",
      content: "Inspired by Ryan from Remix's original example using Remix",
    },
  ],
};
