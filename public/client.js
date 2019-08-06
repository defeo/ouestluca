(async () => {
  // Center on l'observatoire
  const map = L.map('map', {
      center: [48.836, 2.336],
      zoom: 12
  });
  // OSM Mapnik bw, let's be kind
  L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  }).addTo(map);
  
  const waypts = await (await fetch('waypts.json')).json();
  
  let now = new Date();
  let maxt = 0;
  let maxpt = null;
  for (let pt of waypts.waypts) {
    let time = new Date(parseInt(pt.time) * 1000);
    if (time > maxt) {
      maxt = time;
      maxpt = pt;
    }
    let fade = Math.min(255, Math.floor((now - time)/(1000*60*3)));
    let mk = L.circleMarker([pt.lat, pt.lon], {
      radius: 4,
      color: `rgb(255,${fade},${fade})`,
    });
    mk.bindTooltip(`lat: ${pt.lat}, lon: ${pt.lon}, time: ${time.toLocaleString()}, ↑: ${pt.altitude}m`);
    mk.addTo(map);
  }
  
  map.setView([maxpt.lat, maxpt.lon]);
})();
