<!DOCTYPE html>
<html lang="en">


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LunaPilot</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
        crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css">

    <link rel="stylesheet" href="/LunaPilot/assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/proj4@2.19.10/dist/proj4.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.4.0/ol.css">

    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>


<body>

    <section class="hero" id="welcome">
        <div class="hero-bg" role="img"></div>
        <div class="hero-shade"></div>
        <div class="container">
            <div class="hero-topbar">
                <div class="d-flex justify-content-between align-items-center" style="height: 70px;">

                    <div class="hero-logo">
                        <img src="/LunaPilot/assets/images/lunapilot.png" alt="" class="logo-image">
                        Luna<span class="logo-text">Pilot</span>
                    </div>

                    <div class="hero-links">
                        <a href="#welcome">Home</a></li>
                        <a href="#map">Map</a></li>
                        <a href="#landing-site">Landing Sites</a></li>
                        <a href="#anlysis">Analysis</a></li>
                        <a href="#about">About</a></li>
                        <a href="#landing-site" class="btn-launch">Launch App</a>
                    </div>

                </div>
            </div>

            <div class="hero-content mb-3">
                <div class="row align-items-center">
                    <div class="col-lg-8 col-xl-6">
                        <div class="hero-copy">
                            <span class="hero-badge mt-5"><i class=""></i>Exploring the future of lunar missions</span>
                            <h1 class="welcome">Find Your <span class="grad-text">Next Landing Site</span> on the Moon.</h1>
                            <p class="paragraph">Explore the lunar South Pole, evaluate sunlight conditions, understand Earth's visibility, and discover promising locations for future lunar missions.</p>
                            <div class="d-flex flex-wrap gap-3">
                                <a href="#landing-site" class="btn btn-light-blue btn-hero">Explore Lunar Sites <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
                                <a href="#about" class="btn btn-discover btn-hero">Discover LunaPilot</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="about mb-4" style="padding: 60px 0;">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <div class="d-flex">
                        <i class="bi bi-geo-alt icon"></i>

                        <div class="ms-3">
                            <p class="title mb-0">Select Landing Site</p>
                            <p class="about-text">Explore potential landing locations across the lunar South Pole.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <div class="d-flex">
                        <i class="bi bi-calendar-event icon"></i>

                        <div class="ms-3">
                            <p class="title mb-0">Set Date & Time</p>
                            <p class="about-text">Choose a date and time to examine lunar conditions.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="d-flex">
                        <i class="bi bi-sun icon"></i>

                        <div class="ms-3">
                            <p class="title mb-0">Analyze Conditions</p>
                            <p class="about-text">Evaluate sunlight availability and Earth visibility.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="d-flex">
                        <i class="bi bi-bar-chart-line icon"></i>

                        <div class="ms-3">
                            <p class="title mb-0"><b>Compare Landing Sites</b></p>
                            <p class="about-text">Compare locations to identify suitable landing opportunities.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="landing-site" style="padding: 40px 0;">
        <div class="container">
            <div class="row g-4">

                <div class="col-12">
                    <div class="public-container rounded">
                        <h3 class="container-title">Landing Site Analysis</h3>

                        <form method="post">
                            <div class="row g-4">
                                <div class="col-md-6 col-lg-3">
                                    <label for="landing-site" class="form-label">Select Landing Region</label>
                                    <select name="landing_site" id="landing-site" class="form-select" required>
                                        <option value="">Choose...</option>
                                        <option value="Connecting Ridge">Connecting Ridge</option>
                                        <option value="Shackleton">Shackleton</option>
                                        <option value="Pear Near Shackleton">Pear Near Shackleton</option>
                                        <option value="de Gerlache Rim">de Gerlache Rim</option>
                                        <option value="Leibnitz Beta Plateau">Leibnitz Beta Plateau</option>
                                        <option value="Malapert Massif">Malapert Massif</option>
                                    </select>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <label for="date" class="form-label">Analysis Date</label>
                                    <input type="date" name="date" id="date" class="form-control" required>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <label for="time" class="form-label">Analysis Time</label>
                                    <input type="time" name="time" id="time" class="form-control" required>
                                </div>

                                <div class="col-md-6 col-lg-3 text-end">
                                    <button type="submit" class="btn btn-primary mt-4"><i class="bi bi-rocket-takeoff"></i> Analyze Site</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="public-container rounded">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h3 class="container-title mb-0">Lunar South Pole Map</h3>

                            <button type="button" class="btn btn-sm btn-outline-light" id="reset-lunar-view">
                                <i class="bi bi-crosshair"></i> Reset View
                            </button>
                        </div>

                        <p class="about-text fst-italic">Explore potential landing regions across the lunar South Pole.</p>

                        <div class="search-container mt-3 mb-3">
                            <label for="search" class="form-label">
                                Search Lunar Features
                            </label>

                            <div class="input-group">
                                <input
                                    type="search"
                                    class="form-control"
                                    id="search"
                                    list="lunar-feature-list"
                                    placeholder="Search e.g. Shackleton..."
                                    autocomplete="off">

                                <datalist id="lunar-feature-list">
                                    <option value="Shackleton">
                                    <option value="Slater">
                                    <option value="Faustini">
                                    <option value="de Gerlache">
                                </datalist>

                                <button class="btn btn-primary" type="button" id="search-btn">
                                    <i class="bi bi-search"></i> Search
                                </button>
                            </div>

                            <div id="search-message" class="about-text mt-2"></div>
                        </div>

                        <div class="map-layer-panel">
                            <h6 class="container-title2 mt-3">Map Layers</h6>

                            <div class="row">
                                <div class="col-md-6 col-lg-3">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" id="toggle-basemap" checked>
                                            Moon Surface
                                        </label>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" id="toggle-illumination" checked>
                                            Sunlight Map
                                        </label>

                                        <input
                                            type="range"
                                            id="opacity-illumination"
                                            min="0"
                                            max="1"
                                            class="form-range"
                                            step="0.05"
                                            value="0.65">
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" id="toggle-psr" checked>
                                            Permanently Shadowed Regions
                                        </label>

                                        <input
                                            type="range"
                                            id="opacity-psr"
                                            min="0"
                                            max="1"
                                            class="form-range"
                                            step="0.05"
                                            value="0.8">
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" id="toggle-nomenclature" checked>
                                            Crater Names
                                        </label>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-3">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" id="toggle-terrain">
                                            Terrain and Elevation
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div id="lunar-map" class="lunar-map-display"></div>
                            <div id="lunar-coordinates" class="lunar-coordinates">
                                Move your cursor over the map to see coordinates.
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="public-container mb-4 rounded">
                            <h3 class="container-title">Sunlight</h3>
                        </div>

                        <div class="public-container mb-4 rounded">
                            <h3 class="container-title">Earth Visibility</h3>
                        </div>
                    </div>
                </div>
            </div>
    </section>


    <script src="https://cdn.jsdelivr.net/npm/proj4@2.19.10/dist/proj4.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol@10.4.0/dist/ol.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
    <script src="/LunaPilot/assets/js/app.js"></script>

</body>

</html>