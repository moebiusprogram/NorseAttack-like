import L from 'leaflet';
// import Proj4Leaflet from 'proj4leaflet';
import '../../../../node_modules/leaflet/dist/leaflet.css';

export default class Map {
    constructor(opts) {
        this.dom = opts.dom;
        this.mapType = opts.mapType || 'osm'; //默认是osm
        this.tileLayer = opts.tileLayer;
    }

    render() {
        let { width, height } = getComputedStyle(this.dom);
        let map = null;
        // 百度地图
        if(this.mapType == 'baidu') {
            let crs = new L.Proj.CRS('EPSG:3395',
                '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
                {
                    resolutions: function () {
                        let level = 19
                        let res = [];
                        res[0] = Math.pow(2, 10);

                        for(let i = 1; i < level; i++) {
                            res[i] = Math.pow(2, (10 - i));
                        }

                        return res;
                    }(),
                    origin: [0, 0],
                    bounds: L.bounds([0, 20037508.342789244], [20037508.342789244, 0])
                });


            map = L.map(this.dom, {
                renderer: 'canvas',
                minZoom: 2,
                crs: crs
            }).setView([40.416775, -3.703790], 3);

            L.tileLayer(this.tileLayer, {
                attribution: '&copy; 百度地图',
                maxZoom: 10,
                minZoom: 3,
                subdomains: '1234',
                tms: true
            }).addTo(map);
        }
        else {
            map = L.map(this.dom, {
                renderer: 'canvas',
                minZoom: 2,
            }).setView([40.416775, -3.703790], 3);

            L.tileLayer(this.tileLayer, {
                maxZoom: 10,
                minZoom: 3,
            }).addTo(map);
        }

        map.invalidateSize(true);

        return map;
    }
}