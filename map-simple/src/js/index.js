window.onload = (e) => {
    let option = {
        center: [106.695775, 10.775355],
        zoom: 15,
        controls: true,
    }
    option = updateOption(option)
    const map = new map4d.Map(document.getElementById("map"), option)

    map.addListener("idle", (args) => {
        var timer
        clearTimeout(timer)
        timer = setTimeout(() => {
            updateUri(map.getCamera(), map.is3dMode() ? "3d" : "2d")
        }, 50)
    })
}

function updateOption(option) {
    let searchs = document.location.search.split("/")

    let parameters = []
    for (let path of searchs) {   
        if (path[0] == "?") {
            parameters = path.substr(1).split(",")
        }
    }

    var mode = "2d"
    if (parameters.length == 6) {
        option.center[0] = parseFloat(parameters[1])
        option.center[1] = parseFloat(parameters[0])
        option.zoom = parseFloat(parameters[2])
        option.tilt = parseFloat(parameters[3])
        option.bearing = parseFloat(parameters[4])
        mode = parseInt(parameters[5]) == 0 ? "2d" : "3d"
    }

    return option
}

function updateUri(option, mode) {
    let cameraParams = `?${option.getTarget().lat.toFixed(6)},${option.getTarget().lng.toFixed(6)},` +
        `${option.getZoom().toFixed(2)},` +
        `${option.getTilt().toFixed(1)},` +
        `${option.getBearing().toFixed(1)},` +
        `${mode == "3d" ? 1 : 0}`

    let pathName = document.location.pathname

    let pathNames = pathName.split("/")

    for (let path of pathNames) {
        if (path[0] == "?") {
            pathName = pathName.replace(path, cameraParams)
        }
    }
    if (pathName.indexOf("?") == -1) {
        pathName += cameraParams
    }

    history.replaceState(null, null, encodeURI(pathName))
}
