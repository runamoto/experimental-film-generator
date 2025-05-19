import {
  mounted,
  render,
  mut,
  sig,
  mem,
  eff_on,
  each,
  if_then,
} from "./chowk/monke.js";
import { hdom } from "./chowk/hdom/index.js";
import { drag } from "./drag.js";

let data = await fetch("./data.json").then((res) => res.json());

let selectedvideo = sig(undefined);
let selectedaudio = sig(undefined);
let audios = [];

let audiostrs = mut([]);
let windows = mut([]);
let blendmodes = ["multiply", "difference", "exclusion", "blend", "lighten"];

function window(src) {
  let top = sig(Math.random() * 400);
  let left = sig(Math.random() * 400);

  let ref;
  let setref = (e) => (ref = e);
  let videoref = (e) => (videoref = e);
  let setvideoref = (e) => (videoref = e);
  let play = () => videoref.play();
  let blend = sig(blendmodes[Math.floor(Math.random() * blendmodes.length)]);
  let oninput = (e) => blend(e.target.value);

  mounted(() => {
    drag(ref, { set_left: left, set_top: top });
    play();
  });

  return hdom([
    ".window",
    {
      style: mem(
        () =>
          `position: fixed; top: ${top()}px; left: ${left()}px; mix-blend-mode: ${blend()};`
      ),
      ref: setref,
    },
    [
      "button.tl",
      {
        onclick: () => {
          let index = windows.findIndex((e) => e == src);
          windows.splice(index, 1);
        },
      },
      "close",
    ],
    [
      "select.tll",
      { oninput },
      ...blendmodes.map((e) => ["option", { value: e }, e]),
    ],
    ["video", { loop: true, muted: true, ref: setvideoref, src }],
  ]);
}

function Root() {
  function playvideo(src) {
    aboutshow(false);
    //selectedvideo("./" + src)
    let index = Math.floor(Math.random() * data.audiofiles.length);
    let audiosrc = "./" + data.audiofiles[index];
    playaudio(audiosrc);
    windows.push("./" + src);
  }

  function playaudio(src) {
    aboutshow(false);
    audiostrs.push(src);
    let audio = new Audio();
    audio.src = src;
    audios.push(audio);
    setTimeout(() => {
      audio.play();
    }, 100);
  }

  eff_on(selectedaudio, () => {
    let selects = document.querySelectorAll("p.audio");

    selects.forEach((e) => {
      if (e.getAttribute("selection") == "true") {
        e.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  let clear = () => {
    windows.splice(0, 999);
    audios.forEach((e) => e.pause());
    audiostrs.splice(0, 999);
  };

  let aboutshow = sig(false);

  return hdom([
    ".container",
    [
      ".videos",
      data.videofiles.reverse().map((src) => [
        "p.video",
        {
          onclick: () => playvideo(src),
          selection: mem(() =>
            windows.includes("./" + src) ? "true" : "false"
          ),
        },
        src.replace("clips/", "").replace("clips2/", ""),
      ]),
    ],

    [
      ".audios",
      data.audiofiles.map((src) => [
        "p.audio",
        {
          onclick: () => playaudio("./" + src),
          selection: mem(() =>
            audiostrs.includes("./" + src) ? "true" : "false"
          ),
        },
        src.replace("audio/", ""),
      ]),
    ],

    () => each(windows, window),

    [
      ".about",
      {
        style: mem(() => (aboutshow() ? "right: 1em;" : "right: -100vw;")),
      },
      [
        ["h4", "About"],
        [
          "p",
          `This website is the speculative afterplace of `,
          [
            "a",
            { href: "https://zaid-irfan-portfolio.vercel.app/" },
            "Zaid Irfan",
          ],
          ` and `,
          ["a", { href: "https://omama.garden/" }, "Omama Mahmood"],
          `'s audio visual experimentation project carried out in February 2025. This project was an attempt to invoke inspiriation for a fictional screenplay written by Zaid, and then turned into a website that seeks to archive as well as host as a place of cocreation of audio visual exploration.`,
        ],
        [
          "p",
          `Think of it as a "poster generator" but instead of images, you're overlapping sounds and video footage to realize your own experimental film. `,
        ],
      ],
    ],

    [
      "button.about-btn",
      {
        onclick: () => {
          aboutshow(!aboutshow());
        },
      },
      "About",
    ],
    ["button.clear.topright", { onclick: clear }, "x"],
    ["button.clear.topleft", { onclick: clear }, "x"],
    ["button.clear.bottomright", { onclick: clear }, "x"],
    ["button.clear.bottomleft", { onclick: clear }, "x"],
  ]);
}

render(Root, document.body);
