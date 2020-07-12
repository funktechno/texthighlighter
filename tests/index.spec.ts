import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights } from "../src/index";
describe("doHighlight", () => {
  test("mock test", () => {
    expect(true).toBe(true);// Set up our document body
    document.body.innerHTML =
      "<div id=\"sandbox\">" +
      `<h1>Lorem ipsum</h1>
      <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus malesuada sagittis. Morbi
          purus odio, blandit ac urna sed, <b>interdum pharetra</b> leo. Cras congue id est sit amet mattis.
          Sed in metus et orci eleifend commodo. Phasellus at odio imperdiet, efficitur augue in, pulvinar
          sapien. Pellentesque leo nulla, porta non lectus eu, ullamcorper semper est. Nunc <i>convallis</i>
          risus vel mauris accumsan, in rutrum odio sodales. Vestibulum <b>ante ipsum</b> primis in faucibus
          orci luctus et ultrices posuere cubilia Curae; Sed at tempus mauris. Fusce blandit felis sit amet
          magna lacinia blandit.
      </p>
      <img class="shadow" src="assets/img.jpg" />
      <p>
          Maecenas faucibus hendrerit lectus, in auctor felis tristique at. Pellentesque a felis ut nibh
          malesuada auctor. Ut <b>egestas elit</b> ac ultrices ullamcorper. Pellentesque enim est, varius
          ultrices velit eget, consectetur aliquam tortor. Aliquam sit amet nibh id tellus sollicitudin
          faucibus. Nunc euismod augue tempus, ornare justo interdum, consectetur lacus. Pellentesque a
          molestie tellus, eget convallis lectus.
      </p>
      <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nunc sed risus blandit convallis
          id id risus. Morbi tortor metus, imperdiet sed ipsum quis, condimentum mattis tellus. Fusce orci nisi,
          ultricies vel hendrerit id, egestas id turpis. Proin cursus diam tortor, sed ullamcorper eros commodo
          vitae. Aenean et maximus sapien. Nam felis velit, ullamcorper eu turpis ut, hendrerit accumsan augue.
          Nulla et purus sem. Ut at hendrerit purus. <b>Phasellus mollis commodo</b> ante eu mollis. In nec
          dui vel mauris lacinia vulputate id nec turpis. Aliquam vestibulum, elit sit amet fringilla
          malesuada, quam nunc eleifend nunc, id iaculis est neque pretium libero.
      </p>` +
      "</div>";

    const domEle: HTMLElement | null = document.getElementById("sandbox");
    // const d = deserializeHighlights(domEle, tmp);
    const result = serializeHighlights(domEle);
    console.log(result);
    // expect(Greeter("Carl")).toBe("Hello Carl");

  });
});