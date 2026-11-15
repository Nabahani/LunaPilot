proj4.defs(
    'IAU2000:30120',
    '+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R=1737400 +units=m +no_defs'
);

ol.proj.proj4.register(proj4);

const lunarProjection = ol.proj.get('IAU2000:30120');

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
                    'SRS': 'IAU2000:30120'
                },
                crossOrigin: 'anonymous'
            })
        })
    ],

    view: new ol.View({
        projection: lunarProjection,
        center: [0, 0],
        resolution: 3000
    })
});