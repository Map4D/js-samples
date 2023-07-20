window.onload = (e) => {
    const map = new map4d.Map(document.getElementById("map"), {
        center: [106.695775, 10.775355],
        zoom: 18,
        tilt: 60,
        controls: true,
        mapType: "map3d",
    })
}