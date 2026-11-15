
const submitBtn = document.getElementById('submit-btn');
const btnContent = document.getElementById('btn-content');
const formSpinner = document.getElementById('form-spinner');
const landingForm = document.getElementById('landing-form');
const messageContainerEls = document.querySelectorAll('.message');
const hiddenContainerEls = document.querySelectorAll('.hidden-container');
const loadingEls = document.querySelectorAll('.loading');
const sunlightDuration = document.getElementById('sunlight-duration');
const darknessDuration = document.getElementById('darkness-duration');
const sunlightElevation = document.getElementById('sunlight-elevation');
const sunlightPercent = document.getElementById('sunlight-percent');
const sunlightBar = document.getElementById('sunlight-bar');
const earthVisibilityDuration = document.getElementById('earth-visibility-duration');
const earthBlackoutDuration = document.getElementById('earth-blackout-duration');
const earthCommNumber = document.getElementById('earth-comm-number');
const earthPercent = document.getElementById('earth-percent');
const earthBar = document.getElementById('earth-bar');
const commDuration = document.getElementById('comm-duration');

const comparisonForm = document.getElementById('comparison-form');
const comparisonMessageContainer = document.querySelector('.comparison-message');
const comparisonContainer = document.querySelector('.comparison');
const comparisonLoading = document.querySelector('.comparison-loading');

const theadEl = document.querySelector('thead');
const theadRow = theadEl.querySelector('tr');
const tbodyEl = document.getElementById('comparison-body');

function formatDuration(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours}h ${minutes}m`;
}

function renderSunlightTimeline(sunlight) {

    const container = document.getElementById('sunlight-timeline');

    container.innerHTML = '';

    const start = new Date(sunlight.analysis_start);
    const end = new Date(sunlight.analysis_end);

    const totalDuration = end - start;

    const numberOfBlocks = 24;
    const blockDuration = totalDuration / numberOfBlocks;

    for (let i = 0; i < numberOfBlocks; i++) {

        const blockStart = start.getTime() + (i * blockDuration);
        const blockEnd = blockStart + blockDuration;
        const midpoint = (blockStart + blockEnd) / 2;

        const interval = sunlight.timeline.find(item => {

            const intervalStart = new Date(item.start).getTime();
            const intervalEnd = new Date(item.end).getTime();

            return midpoint >= intervalStart && midpoint < intervalEnd;
        });

        const block = document.createElement('div');

        block.classList.add('timeline-block');

        if (interval) {
            block.classList.add(interval.status);

            block.title = `
                Status: ${interval.status}
                Start: ${new Date(blockStart).toLocaleString()}
                End: ${new Date(blockEnd).toLocaleString()}
            `;
        }

        container.appendChild(block);
    }
}

function renderCommWindowsTimeline(earth) {

    const container = document.getElementById('comm-windows-timeline');

    container.innerHTML = '';

    const start = new Date(earth.analysis_start);
    const end = new Date(earth.analysis_end);

    const totalDuration = end - start;

    const numberOfBlocks = 24;
    const blockDuration = totalDuration / numberOfBlocks;

    for (let i = 0; i < numberOfBlocks; i++) {

        const blockStart = start.getTime() + (i * blockDuration);
        const blockEnd = blockStart + blockDuration;
        const midpoint = (blockStart + blockEnd) / 2;

        const window = earth.comm_windows.find(item => {

            const windowStart = new Date(item.start).getTime();
            const windowEnd = new Date(item.end).getTime();

            return midpoint >= windowStart && midpoint < windowEnd;
        });

        const block = document.createElement('div');

        block.classList.add('timeline-block');

        if (window) {

            block.classList.add('comm-available');

            block.title = `
                Communication Available
                Start: ${new Date(blockStart).toLocaleString()}
                End: ${new Date(blockEnd).toLocaleString()}
            `;

        } else {

            block.title = 'Communication Unavailable';
        }

        container.appendChild(block);
    }
}

function updateComparisonTable(results) {

    tbodyEl.querySelectorAll('tr').forEach(row => {
        row.querySelectorAll('td').forEach(td => td.remove());
    });

    results.forEach((result) => {

        const analysisValues = {
            'sun-elevation': `${result.sun_analysis.elevation}°`,
            'sunlight-duration': formatDuration(result.sun_analysis.visibility),
            'darkness-duration': formatDuration(result.sun_analysis.darkness),
            'solar-availability': `${result.sun_analysis.availability}%`,
            'communication-windows': result.earth_analysis.communication_windows_count,
            'communication-duration': formatDuration(result.earth_analysis.communication_duration),
            'communication-availability': `${result.earth_analysis.visibility_percentage}%`
        };

        Object.entries(analysisValues).forEach(([analysis, value]) => {

            const row = tbodyEl.querySelector(
                `[data-analysis="${analysis}"]`
            );

            if (!row) return;

            const td = document.createElement('td');

            td.textContent = value ?? 'N/A';

            row.appendChild(td);
        });

    });
}


landingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    messageContainerEls.forEach(element => {
        element.classList.add('d-none');
    });

    loadingEls.forEach(element => {
        element.classList.remove('d-none');
    });

    hiddenContainerEls.forEach(element => {
        element.style.display = 'none';
    });

    submitBtn.classList.add('disabled');
    btnContent.classList.add('d-none');
    formSpinner.classList.remove('d-none');

    const formData = new FormData(landingForm);

    const response = await fetch('result/landing-site-analysis.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    console.log(result);

    if (result.status === 'Error') {

        messageContainerEls.forEach(element => {
            element.classList.remove('d-none');

            const paragraph = document.createElement('p');

            if (result.message === 'The analysis end must be after the analysis start.') {
                paragraph.textContent = 'The analysis end must be after the analysis start.';
            } else {

                paragraph.textContent = 'Please choose a landing site in the Moon’s South Pole region. The latitude should be between -90° and about -80°. The longitude should be between -180° and 180°.';
            }

            element.innerHTML = '';
            element.appendChild(paragraph);
        });
    } else {

        sunlightDuration.textContent = formatDuration(result.sun_analysis.visibility);
        darknessDuration.textContent = formatDuration(result.sun_analysis.darkness);
        sunlightPercent.textContent = result.sun_analysis.availability;
        sunlightBar.style.width = `${result.sun_analysis.availability}%`;
        sunlightElevation.textContent = `${result.sun_analysis.elevation}°`;
        earthVisibilityDuration.textContent = formatDuration(result.earth_analysis.visibility_duration);
        earthBlackoutDuration.textContent = formatDuration(result.earth_analysis.blackout_duration);
        earthCommNumber.textContent = `${result.earth_analysis.communication_windows_count}`;
        earthPercent.textContent = result.earth_analysis.visibility_percentage;
        earthBar.style.width = `${result.earth_analysis.visibility_percentage}%`;
        commDuration.textContent = formatDuration(result.earth_analysis.communication_duration);

        renderSunlightTimeline(result.sun_analysis.sunlight);
        renderCommWindowsTimeline(result.earth_analysis);

        hiddenContainerEls.forEach(element => {
            element.style.display = 'block';
        });
    }

    loadingEls.forEach(element => {
        element.classList.add('d-none');
    });

    formSpinner.classList.add('d-none');
    btnContent.classList.remove('d-none');
    submitBtn.classList.remove('disabled');
});


const comparisonData = [];
const comparisonResult = [];
let sites = [];


comparisonForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(comparisonForm);

    comparisonData.push({
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        analysis_start: formData.get('analysis_start'),
        analysis_end: formData.get('analysis_end'),
    });

    if (comparisonData.length >= 2) {

        comparisonMessageContainer.classList.add('d-none');
        comparisonContainer.classList.add('d-none');
        comparisonLoading.classList.remove('d-none');

        try {

            const results = await Promise.all(
                comparisonData.map(async (data) => {

                    console.log(Object.entries(data));
                    console.log(data);

                    const response = await fetch('result/landing-site-analysis.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error(`Analysis failed: ${response.status}`);
                    }

                    return await response.json();
                })
            );

            comparisonResult.length = 0;
            comparisonResult.push(...results);

            sites = results.map((_, index) =>
                `Site ${String.fromCharCode(65 + index)}`
            );

            comparisonChart.data.labels = sites;

            comparisonChart.data.datasets[0].data =
                results.map(item => item.sun_analysis.availability);

            comparisonChart.data.datasets[1].data =
                results.map(item => item.earth_analysis.visibility_percentage);

            comparisonChart.update();

            updateComparisonTable(results);

            theadRow.querySelectorAll('[data-comparison-site]').forEach(th => {
                th.remove();
            });

            sites.forEach((site) => {
                const thEl = document.createElement('th');
                thEl.textContent = site;
                thEl.dataset.comparisonSite = 'true';
                theadRow.appendChild(thEl);
            });

            comparisonLoading.classList.add('d-none');
            comparisonContainer.classList.remove('d-none');

            console.log(comparisonResult);

        } catch (error) {

            console.error('Comparison error:', error);
            comparisonLoading.classList.add('d-none');

            if (comparisonResult.length > 0) {
                comparisonContainer.classList.remove('d-none');
            }
        }
    }
});



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

const selectedSiteSource = new ol.source.Vector();

const selectedSiteLayer = new ol.layer.Vector({
    source: selectedSiteSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 9,
            fill: new ol.style.Fill({
                color: '#00E5FF'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFFFF',
                width: 2
            })
        })
    })
});

lunarMap.addLayer(selectedSiteLayer);

const selectedSiteInfo = document.getElementById('selected-site-info');

lunarMap.on('click', function (event) {

    const mapCoordinates = event.coordinate;

    const geographicCoordinates = proj4(
        'IAU2000:30120',
        'EPSG:4326',
        mapCoordinates
    );

    const longitude = geographicCoordinates[0];
    const latitude = geographicCoordinates[1];

    selectedSiteSource.clear();

    const selectedMarker = new ol.Feature({
        geometry: new ol.geom.Point(mapCoordinates)
    });

    selectedSiteSource.addFeature(selectedMarker);

    selectedSiteInfo.textContent = `Selected Site — Latitude: ${latitude.toFixed(4)}° | Longitude: ${longitude.toFixed(4)}°`;

    document.getElementById('latitude').value = +latitude.toFixed(4);
    document.getElementById('longitude').value = +longitude.toFixed(4);
});


// comaprison map
const comparisonMap = new ol.Map({

    target: 'comparison-map',

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
        })

    ],

    view: new ol.View({
        projection: lunarProjection,
        center: [0, 0],
        resolution: 3000
    })

});

const siteModal = document.getElementById('site-modal');

siteModal.addEventListener('shown.bs.modal', function () {
    comparisonMap.updateSize();
});

const comparisonSelectedSiteSource = new ol.source.Vector();

const comparisonSelectedSiteLayer = new ol.layer.Vector({
    source: comparisonSelectedSiteSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 9,
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

comparisonMap.addLayer(comparisonSelectedSiteLayer);

comparisonMap.on('click', function (event) {

    const mapCoordinates = event.coordinate;

    const geographicCoordinates = proj4(
        'IAU2000:30120',
        'EPSG:4326',
        mapCoordinates
    );

    const longitude = geographicCoordinates[0];
    const latitude = geographicCoordinates[1];

    comparisonSelectedSiteSource.clear();

    const selectedMarker = new ol.Feature({
        geometry: new ol.geom.Point(mapCoordinates)
    });

    comparisonSelectedSiteSource.addFeature(selectedMarker);

    document.getElementById('comparison-latitude').value = +latitude.toFixed(4);
    document.getElementById('comparison-longitude').value = +longitude.toFixed(4);
});


const coordinateDisplay2 = document.getElementById('lunar-coordinates-2');

comparisonMap.on('pointermove', function (event) {

    const mapCoordinates = event.coordinate;

    const geographicCoordinates = proj4(
        'IAU2000:30120',
        'EPSG:4326',
        mapCoordinates
    );

    const longitude = geographicCoordinates[0];
    const latitude = geographicCoordinates[1];

    coordinateDisplay2.textContent =
        `Latitude: ${latitude.toFixed(4)}° | Longitude: ${longitude.toFixed(4)}°`;
});


const chartContainer = document.getElementById('comparison-chart');

const comparisonChart = new Chart(chartContainer, {
    type: 'bar',

    data: {
        labels: [],

        datasets: [
            {
                label: 'Sunlight',
                data: [],
                backgroundColor: '#c69843',
                borderRadius: 6,
                maxBarThickness: 40,
                barPercentage: 0.9,
                categoryPercentage: 0.5
            },
            {
                label: 'Communication',
                data: [],
                backgroundColor: '#3D8BFF',
                borderRadius: 6,
                maxBarThickness: 40,
                barPercentage: 0.9,
                categoryPercentage: 0.5
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                labels: {
                    color: '#8E9BB8',
                    boxWidth: 12,
                    boxHeight: 12,
                    borderRadius: 3,

                    font: {
                        size: 14,
                        family: 'Arial',
                        weight: '400'
                    }
                }
            },

            title: {
                display: true,
                align: 'start',
                text: 'Sunlight availability (%) and Earth visibility (%)',
                color: '#8E9BB8',

                font: {
                    size: 12,
                    family: 'inherit',
                    weight: '400'
                },

                padding: {
                    bottom: 10
                }
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                max: 100,

                ticks: {
                    color: '#8E9BB8',

                    font: {
                        size: 20,
                        family: 'inherit',
                        weight: '400',
                    },

                    callback: value => value + '%'
                },

                grid: {
                    color: '#1B304B'
                },

                border: {
                    color: '#1B304B'
                }
            },

            x: {
                ticks: {
                    color: '#8E9BB8',

                    font: {
                        size: 20,
                        family: 'inherit',
                        weight: '400',
                    }
                },

                grid: {
                    display: false,
                    color: '#1B304B'
                },

                border: {
                    color: '#1B304B'
                }
            }
        }
    }
});
