let roverList = Immutable.List(["Curiosity", "Opportunity", "Spirit"]);

let store = {
  user: { name: "User" },
  rovers: roverList,
};

const END_POINT = "http://localhost:3000";

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  return `
        <header></header>
        <div id="main-dashboard">
            ${Greeting(store.user.name)}
            <form id="image-form">
                ${SelectRover(state.rovers)}
                <input id="form-btn" type="submit" value="Search" />
            </form>
            <div id="info"></div>
            <section id="image-grid" class="grid-container">
            </section>
        </div>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", async () => {
  await render(root, store);
  const imageForm = document.getElementById("image-form");
  const imageGrid = document.getElementById("image-grid");
  const info = document.getElementById("info");
  imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    imageGrid.innerHTML = "";
    info.innerHTML = "";
    const roverInput = document.getElementById("form-select").value;
    const res = await getRoverImage(roverInput);
    const { latest_photos } = res;
    const grid = ImageGrid(latest_photos);
    const recentPhotoSrc = latest_photos[0].img_src;
    const srcSplit = recentPhotoSrc.split("/");
    info.innerHTML += `
      <p><strong>Launch Date:</strong> ${latest_photos[0].rover?.launch_date ?? ""}</p>
      <p><strong>Landing Date:</strong> ${latest_photos[0].rover?.landing_date ?? ""}</p>
      <p><strong>Status:</strong> ${latest_photos[0].rover?.status ?? ""}</p>
      <p><strong>Most recently photo:</strong> ${srcSplit[srcSplit.length - 1] ?? ""}</p>
      <p><strong>Most recently photo's date:</strong> ${latest_photos[0].earth_date ?? ""}</p>`;
    for (let i = 0; i < grid.length; i++) {
      imageGrid.innerHTML += grid[i];
    }
  });
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};
const SelectRover = (rovers) => {
  return `<select id="form-select" value=${rovers.get(0).toLowerCase()}>
  ${rovers.map((e) => `<option value=${e.toLowerCase()}>${e}</option>`)}
  </select>`;
};

const RoverImage = (image) => `<img src="${image.img_src}" />`;

const ImageGrid = (images) =>
  images.map(
    (e, i) =>
      `<div class="grid-item" key=${`grid-item-${i + 1}`}>
      ${RoverImage(e)}
      <p>Date: ${e?.earth_date}</p>
      </div>`
  );
// ------------------------------------------------------  API CALLS

const getRoverImage = async (rover) => {
  const data = await fetch(`${END_POINT}/recent-image?rover=${rover}`).then(
    (res) => res.json()
  );
  return data;
};
