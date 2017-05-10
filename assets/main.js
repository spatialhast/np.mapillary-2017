// inspired by @jesolem, https://github.com/jesolem/mytown
$("#list-btn").click(function () {
    $("#aboutModal").modal("show");
    return false;
});

$("#updInfo").load("data/upd.json");

function placeNumber(value, row, index) {
    return 1 + index;
};

function linkUserName(value, row) {
    return '<a target="_blank" href="https://www.mapillary.com/app/user/' + value + '">' + value + '</a>';
};

function panameReplace(value, row, index) {
    var pacontent = '';
    for (key in value) {
        var paname = key;
        var osmid = value[key];

        var osmtype = 'way';

        if (parseInt(osmid) < 0) {
            osmtype = 'relation';
            osmid = parseInt(osmid) * (-1);
        };

        var paurl = '<a target="_blank" href="http://www.openstreetmap.org/' + osmtype + '/' + osmid + '">' + paname + '</a>, ';
        pacontent = pacontent + paurl;
    };

    return pacontent.slice(0, -2);
};

//mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzdCIsImEiOiJjaW8yb2J5b3kwMHg3dnZseTNoZ2JkbXllIn0.bd3CWy4tlOrSgX3g_PPi_w';
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzdCIsImEiOiJIclZtZW1zIn0.iuIxiFsi-Am4bCEBzjFQaQ';

if (!mapboxgl.supported()) {
    $("#warningModal").modal("show");
} else {
    console.log('Your browser supported Mapbox GL');
    //$("#aboutModal").modal("show");
};

var pLocation = {
    "1": {
        center: [30.4637, 50.4504],
        p_key: '-ufEmeSAixaqJ9LZpFymiA'
    },
    "2": {
        center: [30.4216, 50.4740],
        p_key: '2GDRafBmQYuHK7rtcFYlGA'
    },
    "3": {
        center: [36.2433, 50.0742],
        p_key: '8jrMyxOBgUhkmZodkd0WGA'
    },
    "4": {
        center: [35.1921, 50.1210],
        p_key: 'k2zzEGm8S7Zqis491VzQYw'
    }
};

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

var locNumber = randomInteger(1, 3);

var center = pLocation[locNumber].center,
    p_key = pLocation[locNumber].p_key;

var map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/mapbox/light-v8',
    style: 'mapbox://styles/hast/cj2jd5hz6001p2snpz7ayq0bi',
    center: center,
    zoom: 4
});

map.addControl(new mapboxgl.NavigationControl({
    position: 'top-left'
}));

var markerSource = {
    type: 'geojson',
    data: {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: center
        },
        properties: {
            title: 'You\'re here!',
            'marker-symbol': 'marker'
        }
    }
};


map.on('style.load', function () {
    initLayers();
});


function initLayers() {

    // var mapillaryCoverage = {
    //     type: 'vector',
    //     tiles: ['https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt'],
    //     minzoom: 2,
    //     maxzoom: 14
    // };

    // Mapillary coverage
    // map.addSource("mapillaryCoverage", mapillaryCoverage);
    // var mapillaryCoverageLine = {
    //     "id": "mapillaryCoverageLine",
    //     "type": "line",
    //     "source": "mapillaryCoverage",
    //     "source-layer": "mapillary-sequences",
    //     "filter": [">", "captured_at", 1483221600000],
    //     "layout": {
    //         "visibility": "visible"
    //     },
    //     "paint": {
    //         'line-opacity': 0.7,
    //         'line-color': '#E88D00',
    //         'line-width': 3
    //     }
    // };

    // Mapillary coverage labels
    // map.addSource("mapillaryCoverageLabels", mapillaryCoverage);
    // var mapillaryCoverageLabels = {
    //     'id': 'mapillaryCoverageLabels',
    //     'type': 'symbol',
    //     'source': 'mapillaryCoverage',
    //     'source-layer': 'mapillary-sequences',
    //     'layout': {
    //         "visibility": "visible",
    //         'text-field': '{userkey}',
    //         'symbol-placement': 'line',
    //         'text-size': 12
    //     },
    //     'minzoom': 10,
    //     'maxzoom': 21,
    //     "filter": [">", "captured_at", 1483221600000],
    //     'paint': {
    //         'text-color': '#3D30A9',
    //         'text-halo-color': '#FFFFFF',
    //         'text-halo-width': 1.5
    //     }
    // };

    //map.addLayer(mapillaryCoverageLine, 'sequences');
    //map.addLayer(mapillaryCoverageLabels, 'sequencesLabels');

    // GeoJSON PZF layer
    // map.addSource('pzf', {
    //     'type': 'geojson',
    //     'data': 'data/pzf.geojson'
    // });
    // map.addLayer({
    //     'id': 'pzfId',
    //     'type': 'fill',
    //     'source': 'pzf',
    //     'layout': {
    //         "visibility": "visible"
    //     },
    //     'paint': {
    //         'fill-color': '#9ace00',
    //         'fill-opacity': 0.3,
    //         'fill-outline-color': '#AED540',
    //     }
    // });


    // GeoJSON photos layer
    // map.addSource('photos', {
    //     'type': 'geojson',
    //     'data': 'data/photo_point.geojson'
    // });
    // map.addLayer({
    //     'id': 'photos',
    //     'type': 'circle',
    //     'source': 'photos',
    //     'layout': {
    //         "visibility": "visible"
    //     },
    //     'paint': {
    //         "circle-radius": 3,
    //         "circle-color": "#004C00",
    //         "circle-opacity": 0.2
    //     }
    // });

    // photo position marker    
    map.addSource('markers', markerSource);
    map.addLayer({
        'id': 'markers',
        'type': 'symbol',
        'source': 'markers',
        'layout': {
            'icon-image': '{marker-symbol}-15',
            'text-field': '{title}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'

        },
        'paint': {
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1.5
        }
    });


    /*
            // label http://stackoverflow.com/questions/30531006/centering-text-label-in-mapbox-gl-js
            map.addSource('label', {
                'type': 'geojson',
                'data': 'data/point.geojson'
            });
    
            map.addLayer({
                'id': 'label-style',
                'type': 'symbol',
                'source': 'label',
                'layout': {
                    'text-field': '{name}',
                    'text-size': 8
                },
                'minzoom': 10,
                'maxzoom': 21
                //'filter': 18,
                'paint': {
                    'text-color': 'red'
                }
            });
        */



    /*
            
            // mapillary sequences label
            map.addLayer({
                'id': 'mapillary-label-style',
                'type': 'symbol',
                'source': 'mapillary',
                'source-layer': 'mapillary-sequences',
                'layout': {
                    'text-field': '{username}',
                    'symbol-placement': 'line'
                    //'text-size': 12
                },
                'minzoom': 10,
                'maxzoom': 21,
                'filter': [">", 'captured_at', '1451606400000'],
                'paint': {
                    'text-color': '#3D30A9',
                    'text-halo-color': '#FFFFFF',
                    'text-halo-width': 1.5
                }
            });
    
        */



};

var mly = new Mapillary.Viewer('mly', 'WTlZaVBSWmxRX3dQODVTN2gxWVdGUTowNDlmNDBhNjRhYmM3ZmVl', p_key, {
    component: {
        cover: false,
    }
});

mly.on('nodechanged', function (node) {
    var lnglat = [node.latLon.lon, node.latLon.lat];
    var data = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: lnglat
        },
        properties: {
            title: 'You\'re here!',
            'marker-symbol': 'marker'
        }
    };

    map.getSource('markers').setData(data);
    map.flyTo({
        center: lnglat,
        zoom: 15
    });
});

map.on('click', function (e) {
    mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
});