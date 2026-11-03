
const lunarMap = new ol.Map({
    target: 'lunar-map',

    layers: [
        new ol.layer.Image({
            source: new ol.source.ImageWMS({
                url: 'https://wms.im-ldi.com/',
                params: {
                    'LAYERS': 'luna_wac_global',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'SRS': 'EPSG:4326'
                },
                crossOrigin: 'anonymous'
            })
        })
    ],

    view: new ol.View({
        projection: 'EPSG:4326',
        center: [0, -85],
        zoom: 2
    })
});
