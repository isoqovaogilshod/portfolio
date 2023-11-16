const maxSnowflakes = 1000,
  snowflakes = [],
  container = document.getElementById("snow");

console.clear();

let isRunning = true;

const generatesnowFlake = (timeout = 0, init = false) => {
  const duration = 3000 + Math.random() * 7000,
    flake = document.createElement("div"),
    id = crypto.randomUUID(),
    delay = init ? Math.random() * duration : 0;
  snowflakes.push(id);
  setTimeout(() => {
    flake.setAttribute("id", id);
    flake.setAttribute(
      "style",
      `
			animation-delay: -${delay}ms;
			--fallDuration: ${duration}ms;
			--fallSlideStrength: ${Math.random()};
			--size: ${Math.random() * 0.7 + 0.3};
			--position: ${Math.random() * 120}%;
			`
    );
    container.appendChild(flake);
    setTimeout(() => {
      const index = snowflakes.findIndex((e) => e === id);
      snowflakes.splice(index, index);
      container.removeChild(flake);
    }, duration - delay);
  }, timeout);
};

container.setAttribute("style", `--cWidth: ${container.clientWidth}px`);
addEventListener("resize", () =>
  container.setAttribute("style", `--cWidth: ${container.clientWidth}px`)
);

const loop = async () => {
    while (1) {
      await new Promise(async (resolve) => {
        if (
          isRunning &&
          snowflakes.length < maxSnowflakes &&
          !document.hidden
        ) {
          requestAnimationFrame(() => {
            generatesnowFlake(Math.random() * 50);
            resolve();
          });
        } else {
          setTimeout(resolve, 50);
        }
      });
    }
  },
  init = () => {
    for (let i = 0; i < (maxSnowflakes - snowflakes.length) / 2; i++) {
      generatesnowFlake(Math.random() * 50, true);
    }
  };

init();
loop();

document.onvisibilitychange = (e) => {
  isRunning = !document.hidden;
  if (isRunning) init();
};

///////////////////////////////////////////////////
/*--------------------
lets
--------------------*/
let progress = 50;
let startX = 0;
let active = 0;
let isDown = false;

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  );

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll(".carousel-item");
const $cursors = document.querySelectorAll(".cursor");

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index];
  item.style.setProperty("--zIndex", zIndex);
  item.style.setProperty("--active", (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100));
  active = Math.floor((progress / 100) * ($items.length - 1));

  $items.forEach((item, index) => displayItems(item, index, active));
};
animate();

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener("click", () => {
    progress = (i / $items.length) * 100 + 10;
    animate();
  });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = (e) => {
  const wheelProgress = e.deltaY * speedWheel;
  progress = progress + wheelProgress;
  animate();
};

const handleMouseMove = (e) => {
  if (e.type === "mousemove") {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }
  if (!isDown) return;
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const mouseProgress = (x - startX) * speedDrag;
  progress = progress + mouseProgress;
  startX = x;
  animate();
};

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
  isDown = false;
};

/*--------------------
Listeners
--------------------*/
document.addEventListener("mousewheel", handleWheel);
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchstart", handleMouseDown);
document.addEventListener("touchmove", handleMouseMove);
document.addEventListener("touchend", handleMouseUp);
////////

let menu = document.querySelector(".icons .menu");
let x = document.querySelector(".icons .x");
let icons = document.querySelector(".icons");
let hide = document.querySelector(".hide");
menu.addEventListener("click", () => {
  menu.style.display = "none";
  hide.style.display = "inline-block";
});

hide.addEventListener("click", () => {
  menu.style.display = "inline-block";
  hide.style.display = "none";
});
