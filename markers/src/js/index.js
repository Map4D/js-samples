const center = [106.695775, 10.775355]
const iconView = `<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20viewBox%3D%220%200%2027%2043%22%3E%3Cdefs%3E%3Cpath%20id%3D%22a%22%20d%3D%22M12.5%200C5.5961%200%200%205.5961%200%2012.5c0%201.8859.54297%203.7461%201.4414%205.4617%203.425%206.6156%2010.216%2013.566%2010.216%2022.195%200%20.46562.37734.84297.84297.84297s.84297-.37734.84297-.84297c0-8.6289%206.7906-15.58%2010.216-22.195.89844-1.7156%201.4414-3.5758%201.4414-5.4617%200-6.9039-5.5961-12.5-12.5-12.5z%22/%3E%3C/defs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20transform%3D%22translate%281%201%29%22%3E%3Cuse%20fill%3D%22%23EA4335%22%20xlink%3Ahref%3D%22%23a%22/%3E%3Cpath%20d%3D%22M12.5-.5c7.18%200%2013%205.82%2013%2013%200%201.8995-.52398%203.8328-1.4974%205.6916-.91575%201.7688-1.0177%201.9307-4.169%206.7789-4.2579%206.5508-5.9907%2010.447-5.9907%2015.187%200%20.74177-.6012%201.343-1.343%201.343s-1.343-.6012-1.343-1.343c0-4.7396-1.7327-8.6358-5.9907-15.187-3.1512-4.8482-3.2532-5.01-4.1679-6.7768-.97449-1.8608-1.4985-3.7942-1.4985-5.6937%200-7.18%205.82-13%2013-13z%22%20stroke%3D%22%23fff%22/%3E%3C/g%3E%3Ctext%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20x%3D%2214%22%20y%3D%2215%22%20font-family%3D%22Roboto%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2216px%22%20fill%3D%22%23FFF%22%3EA%3C/text%3E%3C/g%3E%3C/svg%3E" style="width:27px;height:43px;">`

window.onload = (e) => {
    const map = initMap()
    const positions = generatePositions()
    console.log('markers count:', positions.length)

    for (const position of positions) {
        let marker = new map4d.Marker({
            position: position,
            iconView: iconView,
          })
          marker.setMap(map)
    }
}

function initMap() {
    console.log('initMap')
    let map = new map4d.Map(document.getElementById("map"), {
        center: center,
        zoom: 18,
        controls: true,
    })
    return map
}

function generatePositions() {
    let positions = []
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        positions.push({lat: (center[1] + 0.0003 * i), lng: (center[0] + 0.0003 * j)})
      }
    }
    return positions
}
