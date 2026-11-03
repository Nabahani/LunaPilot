proj4.defs(
    'IAU2000:30120',
    '+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs'
);

ol.proj.proj4.register(proj4);

const lunarProjection = ol.proj.get('IAU2000:30120');

const lunarMap = new ol.Map({

    controls: ol.control.defaults.defaults().extend([
        new ol.control.FullScreen()
    ]),

    target: 'lunar-map',

    layers: [

        new ol.layer.Image({
            title: 'Moon Surface',
            visible: true,

            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_wac_global',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            })
        }),

        new ol.layer.Image({
            title: 'Sunlight Map',
            visible: true,

            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_polar_illumination_pct',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            }),
            opacity: 0.65
        }),

        new ol.layer.Image({
            title: 'Permanently Shadowed Regions',
            visible: true,

            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_nac_pole_psr_south',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            }),
            opacity: 0.8
        }),

        new ol.layer.Image({
            title: 'Crater Names',
            visible: true,

            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_nomenclature',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            })
        }),

        new ol.layer.Image({
            title: 'Terrain and Elevation',
            visible: false,

            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_wac_dtm',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            }),
            opacity: 0.7
        })

    ],

    view: new ol.View({
        projection: lunarProjection,
        center: [0, 0],
        resolution: 3000
    })
});

const craterMarkerSource = new ol.source.Vector();

const craterMarkerLayer = new ol.layer.Vector({
    source: craterMarkerSource,

    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#3D8BFF'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFFFF',
                width: 2
            })
        })
    })
});

// Add the marker layer to the map
lunarMap.addLayer(craterMarkerLayer);

const coordinateDisplay = document.getElementById('lunar-coordinates');

lunarMap.on('pointermove', function (event) {

    const mapCoordinates = event.coordinate;

    const geographicCoordinates = proj4(
        'IAU2000:30120',
        'EPSG:4326',
        mapCoordinates
    );

    const longitude = geographicCoordinates[0];
    const latitude = geographicCoordinates[1];

    coordinateDisplay.textContent =
        `Latitude: ${latitude.toFixed(4)}° | Longitude: ${longitude.toFixed(4)}°`;
});

const mapLayers = lunarMap.getLayers().getArray();

const layerControls = [
    ['toggle-basemap', 0],
    ['toggle-illumination', 1],
    ['toggle-psr', 2],
    ['toggle-nomenclature', 3],
    ['toggle-terrain', 4]
];

layerControls.forEach(([checkboxId, layerIndex]) => {
    const checkbox = document.getElementById(checkboxId);
    const layer = mapLayers[layerIndex];

    checkbox.addEventListener('change', function () {
        layer.setVisible(this.checked);
    });
});

const opacityControls = [
    ['opacity-illumination', 1],
    ['opacity-psr', 2]
];

opacityControls.forEach(([sliderId, layerIndex]) => {
    const slider = document.getElementById(sliderId);
    const layer = mapLayers[layerIndex];

    slider.addEventListener('input', function () {
        layer.setOpacity(Number(this.value));
    });
});

document.getElementById('reset-lunar-view').addEventListener('click', function () {
    lunarMap.getView().animate({
        center: [0, 0],
        resolution: 3000,
        duration: 500
    });
});

const lunarFeatures = [
    {
        name: 'Shackleton',
        latitude: -89.67,
        longitude: 129.78
    },
    {
        name: 'Slater',
        latitude: -88.0792,
        longitude: 111.2881
    },
    {
        name: 'Faustini',
        latitude: -87.3,
        longitude: 77.0
    },
    {
        name: 'de Gerlache',
        latitude: -88.5,
        longitude: -87.1
    }
];

function searchLunarFeature() {
    const searchInput = document.getElementById('search');
    const message = document.getElementById('search-message');

    const searchName = searchInput.value.trim().toLowerCase();

    if (!searchName) {
        message.textContent = 'Please enter a crater name.';
        return;
    }

    const feature = lunarFeatures.find(item =>
        item.name.toLowerCase() === searchName
    );

    if (!feature) {
        message.textContent = 'Feature not found. Select a suggested name.';
        return;
    }

    const coordinates = proj4(
        'EPSG:4326',
        'IAU2000:30120',
        [feature.longitude, feature.latitude]
    );

    craterMarkerSource.clear();

    const craterMarker = new ol.Feature({
        geometry: new ol.geom.Point(coordinates)
    });

    craterMarkerSource.addFeature(craterMarker);

    lunarMap.getView().animate({
        center: coordinates,
        resolution: 250,
        duration: 1000
    });

    message.textContent = `Showing ${feature.name} Crater.`;
}

document.getElementById('search-btn')
    .addEventListener('click', searchLunarFeature);

document.getElementById('search')
    .addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            searchLunarFeature();
        }
    });