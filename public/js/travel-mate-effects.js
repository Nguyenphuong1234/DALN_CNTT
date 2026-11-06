(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function createBackground() {
        if (document.body.classList.contains('tm-resort-body') || document.body.classList.contains('tm-auth-resort')) return;
        if (document.querySelector('.tm-bg-system')) return;
        const bg = document.createElement('div');
        bg.className = 'tm-bg-system';
        bg.innerHTML = '<span class="tm-blob tm-blob-1"></span><span class="tm-blob tm-blob-2"></span><span class="tm-blob tm-blob-3"></span><div class="tm-particles"></div>';
        document.body.prepend(bg);

        const particleWrap = bg.querySelector('.tm-particles');
        const count = window.innerWidth < 768 ? 5 : 9;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'tm-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = -20 - Math.random() * 60 + 'px';
            p.style.animationDuration = 12 + Math.random() * 18 + 's';
            p.style.animationDelay = -Math.random() * 18 + 's';
            p.style.opacity = 0.10 + Math.random() * 0.18;
            p.style.transform = 'scale(' + (0.6 + Math.random() * 1.4) + ')';
            particleWrap.appendChild(p);
        }
    }

    function cursorGlow() {
        // Tắt hiệu ứng quầng sáng chạy theo chuột vì dễ gây rối mắt khi demo.
        return;
    }

    function revealEffects() {
        if (window.AOS) {
            AOS.init({ duration: 760, easing: 'ease-out-cubic', once: true, offset: 50 });
        } else {
            document.querySelectorAll('.tm-reveal, .card, .tm-card').forEach(el => el.classList.add('tm-visible'));
        }
    }

    function tiltEffects() {
        if (prefersReduced || !window.VanillaTilt) return;
        const items = document.querySelectorAll('.tm-tilt, .tm-hotel-card, .tm-stat-card, .tm-feature, .tm-auth-box');
        VanillaTilt.init(items, {
            max: 1.5,
            speed: 500,
            glare: false,
            'max-glare': 0,
            gyroscope: false
        });
    }

    function magneticButtons() {
        // Tắt hiệu ứng nút chạy theo chuột; giữ hover CSS nhẹ để giao diện vẫn mượt.
        return;
    }

    function confirmForms() {
        document.querySelectorAll('.js-confirm-form').forEach(form => {
            if (form.dataset.tmBound) return;
            form.dataset.tmBound = '1';
            form.addEventListener('submit', function (event) {
                if (!window.Swal) return;
                event.preventDefault();
                Swal.fire({
                    title: 'Xác nhận thao tác',
                    text: form.dataset.confirm || 'Bạn có chắc chắn muốn tiếp tục?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy',
                    confirmButtonColor: '#060daa',
                    cancelButtonColor: '#6b7280',
                    background: '#ffffff',
                    color: '#191817',
                    customClass: { popup: 'tm-swal-popup' }
                }).then(result => {
                    if (result.isConfirmed) form.submit();
                });
            });
        });
    }

    function animatedCounters() {
        const counters = document.querySelectorAll('[data-countup]');
        if (!counters.length) return;
        const run = (el) => {
            const target = Number(el.dataset.countup || 0);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = Number(el.dataset.duration || 1200);
            const start = performance.now();
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = prefix + value.toLocaleString('vi-VN') + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        };
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.counted) {
                        entry.target.dataset.counted = '1';
                        run(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(el => io.observe(el));
        } else counters.forEach(run);
    }

    function parallaxHero() {
        if (prefersReduced || window.innerWidth < 992) return;
        const hero = document.querySelector('.tm-hero, .tm-welcome');
        if (!hero) return;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            hero.style.setProperty('--tm-scroll-y', y * 0.08 + 'px');
        }, { passive: true });
    }

    function activeNavIndicator() {
        const links = document.querySelectorAll('.tm-sidebar-nav a, .tm-navbar a.nav-link');
        links.forEach(link => {
            if (link.href === window.location.href) link.classList.add('active');
        });
    }

    function hotelMaps() {
        const maps = document.querySelectorAll('.js-hotel-map');
        if (!maps.length || !window.L) return;

        const state = {
            lastRequestAt: 0,
            queue: Promise.resolve()
        };

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const scheduleNominatim = (fn) => {
            state.queue = state.queue.then(async () => {
                const elapsed = Date.now() - state.lastRequestAt;
                if (elapsed < 1100) await wait(1100 - elapsed);
                state.lastRequestAt = Date.now();
                return fn();
            }).catch(() => null);
            return state.queue;
        };

        maps.forEach(el => {
            if (el.dataset.tmMapBound) return;
            el.dataset.tmMapBound = '1';

            const latInput = el.dataset.latInput ? document.getElementById(el.dataset.latInput) : null;
            const lngInput = el.dataset.lngInput ? document.getElementById(el.dataset.lngInput) : null;
            const addressInput = el.dataset.addressInput ? document.getElementById(el.dataset.addressInput) : null;
            const wardInput = el.dataset.wardInput ? document.getElementById(el.dataset.wardInput) : null;
            const districtInput = el.dataset.districtInput ? document.getElementById(el.dataset.districtInput) : null;
            const provinceInput = el.dataset.provinceInput ? document.getElementById(el.dataset.provinceInput) : null;
            const geocodeButton = document.querySelector('.js-map-geocode[data-map-target="' + el.id + '"]');
            const resultsEl = document.querySelector('.js-map-results[data-map-target="' + el.id + '"]');
            const fallbackLat = Number(el.dataset.fallbackLat || 21.028511);
            const fallbackLng = Number(el.dataset.fallbackLng || 105.804817);
            const rawLat = String(el.dataset.lat || (latInput && latInput.value) || '').trim();
            const rawLng = String(el.dataset.lng || (lngInput && lngInput.value) || '').trim();
            const hasInitialPoint = rawLat !== '' && rawLng !== ''
                && Number.isFinite(Number(rawLat))
                && Number.isFinite(Number(rawLng));
            const lat = hasInitialPoint ? Number(rawLat) : fallbackLat;
            const lng = hasInitialPoint ? Number(rawLng) : fallbackLng;
            const draggable = el.dataset.draggable === 'true';

            const map = L.map(el, {
                scrollWheelZoom: false,
                zoomControl: true
            }).setView([lat, lng], hasInitialPoint ? 15 : 11);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            let marker = null;
            let reverseGeocode = null;
            const title = el.dataset.title || 'Travel Mate';
            const address = el.dataset.address || '';
            const escapeHtml = (value) => String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            const fold = (value) => String(value || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase()
                .trim();
            const firstFilled = (...values) => values.find(value => String(value || '').trim() !== '') || '';
            const samePlace = (left, right) => fold(left).replace(/\s+/g, ' ') === fold(right).replace(/\s+/g, ' ');
            const splitDisplayName = (displayName) => String(displayName || '')
                .split(',')
                .map(part => part.trim())
                .filter(Boolean);
            const findPart = (parts, patterns) => {
                return parts.find(part => {
                    const value = fold(part);
                    return patterns.some(pattern => pattern.test(value));
                }) || '';
            };
            const isCountryPart = (part) => ['viet nam', 'vietnam'].includes(fold(part));

            const writeInputs = (point) => {
                if (latInput) latInput.value = point.lat.toFixed(7);
                if (lngInput) lngInput.value = point.lng.toFixed(7);
            };

            const buildAddressQuery = () => {
                return [addressInput, wardInput, districtInput, provinceInput]
                    .map(input => input ? input.value.trim() : '')
                    .filter(Boolean)
                    .join(', ');
            };

            const stripAdminPrefix = (value) => fold(value)
                .replace(/^(phuong|xa|thi tran|quan|huyen|thi xa|thanh pho)\s+/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            const includesPlace = (needle, haystack) => {
                const cleanNeedle = stripAdminPrefix(needle);
                const cleanHaystack = stripAdminPrefix(haystack);
                if (!cleanNeedle) return true;
                return cleanHaystack.includes(cleanNeedle) || fold(haystack).includes(fold(needle));
            };
            const getInputParts = () => ({
                detail: addressInput ? addressInput.value.trim() : '',
                ward: wardInput ? wardInput.value.trim() : '',
                district: districtInput ? districtInput.value.trim() : '',
                province: provinceInput ? provinceInput.value.trim() : ''
            });
            const placeSearchText = (place) => [
                place.display_name,
                place.name,
                ...Object.values(place.address || {})
            ].filter(Boolean).join(', ');
            const uniquePlaces = (places) => {
                const seen = new Set();
                return places.filter(place => {
                    const key = place.place_id || [place.lat, place.lon, place.display_name].join('|');
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
            };
            const rankPlaces = (places, input) => {
                return uniquePlaces(places).map(place => {
                    const text = placeSearchText(place);
                    const hasProvince = !input.province || includesPlace(input.province, text);
                    const hasDistrict = !input.district || includesPlace(input.district, text);
                    const hasWard = !input.ward || includesPlace(input.ward, text);
                    let score = Number(place.importance || 0);

                    if (input.province && hasProvince) score += 8;
                    if (input.district && hasDistrict) score += 7;
                    if (input.ward && hasWard) score += 5;
                    if (input.detail && includesPlace(input.detail, text)) score += 3;

                    const hardMismatch = (input.province && !hasProvince)
                        || (input.district && !hasDistrict)
                        || (input.ward && !hasWard && input.district && input.province);

                    return { place, score, hardMismatch };
                }).filter(item => !item.hardMismatch)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map(item => item.place);
            };
            const fetchNominatimSearch = async (params) => {
                const result = await scheduleNominatim(() => fetch('https://nominatim.openstreetmap.org/search?' + params.toString()));
                if (!result || !result.ok) throw new Error('Geocode request failed');
                const data = await result.json();
                return Array.isArray(data) ? data : [];
            };

            const setButtonState = (label, isLoading) => {
                if (!geocodeButton) return;
                geocodeButton.disabled = !!isLoading;
                geocodeButton.innerHTML = isLoading
                    ? '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> ' + label
                    : '<i class="bi bi-search"></i> ' + label;
            };

            const extractAddressParts = (address = {}, displayName = '') => {
                const parts = splitDisplayName(displayName);
                const province = firstFilled(
                    address.state,
                    address.province,
                    address.region,
                    address.city && !address.city_district ? address.city : '',
                    parts.length >= 2 ? parts[parts.length - 2] : ''
                );
                const district = firstFilled(
                    address.city_district,
                    address.district,
                    address.county,
                    findPart(parts, [/^(quan|huyen|thi xa)\b/, /^thanh pho thu duc\b/])
                );
                const ward = firstFilled(
                    address.suburb,
                    address.quarter,
                    address.neighbourhood,
                    address.residential,
                    address.village,
                    address.hamlet,
                    address.municipality,
                    findPart(parts, [/^(phuong|xa|thi tran)\b/])
                );
                const roadLine = [
                    address.house_number,
                    firstFilled(address.road, address.pedestrian, address.footway, address.path, address.cycleway)
                ].filter(Boolean).join(' ');
                const fallbackDetail = parts
                    .filter(part => !isCountryPart(part))
                    .filter(part => ![ward, district, province].some(admin => admin && samePlace(part, admin)))
                    .filter(part => !/^(phuong|xa|thi tran|quan|huyen|thi xa)\b/.test(fold(part)))
                    .slice(0, 3)
                    .join(', ');

                return {
                    detail: firstFilled(roadLine, address.building, address.house, address.amenity, address.shop, address.tourism, fallbackDetail),
                    ward,
                    district,
                    province
                };
            };

            const writeAddress = (address, displayName) => {
                if (!address || !addressInput) return;
                const parts = extractAddressParts(address, displayName);
                addressInput.value = parts.detail || '';
                if (wardInput) wardInput.value = parts.ward || '';
                if (districtInput) districtInput.value = parts.district || '';
                if (provinceInput) provinceInput.value = parts.province || '';
            };

            const hideResults = () => {
                if (!resultsEl) return;
                resultsEl.hidden = true;
                resultsEl.innerHTML = '';
            };

            const renderResults = (places) => {
                if (!resultsEl) return;
                resultsEl.innerHTML = '';
                if (!places.length) {
                    resultsEl.hidden = false;
                    resultsEl.innerHTML = '<div class="tm-map-result-empty">Khong tim thay ket qua khop voi phuong/quan/tinh da nhap. Hay nhap ro hon khu vuc hoac click/keo marker tren ban do de chot vi tri.</div>';
                    return;
                }

                const title = document.createElement('div');
                title.className = 'tm-map-result-title';
                title.textContent = 'Chon ket qua phu hop voi dia chi da nhap';
                resultsEl.appendChild(title);

                places.forEach(place => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'tm-map-result-item';
                    const parts = extractAddressParts(place.address || {}, place.display_name || '');
                    const resultTitle = firstFilled(parts.detail, place.name, place.display_name, 'Dia diem');
                    const resultMeta = [parts.ward, parts.district, parts.province].filter(Boolean).join(', ') || place.display_name || '';
                    button.innerHTML = '<strong>' + escapeHtml(resultTitle) + '</strong><span>' + escapeHtml(resultMeta) + '</span>';
                    button.addEventListener('click', function () {
                        const nextLat = Number(place.lat);
                        const nextLng = Number(place.lon);
                        if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;
                        placeMarker([nextLat, nextLng], true);
                        map.flyTo([nextLat, nextLng], 16, { duration: 0.8 });
                        if (place.address) writeAddress(place.address, place.display_name);
                        hideResults();
                    });
                    resultsEl.appendChild(button);
                });

                resultsEl.hidden = false;
            };

            const placeMarker = (point, shouldWrite) => {
                if (!marker) {
                    marker = L.marker(point, { draggable }).addTo(map);
                    marker.bindPopup(address
                        ? '<strong>' + escapeHtml(title) + '</strong><br>' + escapeHtml(address)
                        : escapeHtml(title));
                    if (draggable) {
                        marker.on('dragend', function () {
                            writeInputs(marker.getLatLng());
                            if (reverseGeocode) reverseGeocode(marker.getLatLng());
                        });
                    }
                } else {
                    marker.setLatLng(point);
                }

                if (shouldWrite) writeInputs(marker.getLatLng());
            };

            if (hasInitialPoint) {
                placeMarker([lat, lng], false);
            }

            if (draggable) {
                map.on('click', function (event) {
                    placeMarker(event.latlng, true);
                });

                [latInput, lngInput].forEach(input => {
                    if (!input) return;
                    input.addEventListener('change', function () {
                        const nextLat = Number(latInput && latInput.value);
                        const nextLng = Number(lngInput && lngInput.value);
                        if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;
                        placeMarker([nextLat, nextLng], false);
                        map.setView([nextLat, nextLng], 15);
                        if (reverseGeocode && marker) reverseGeocode(marker.getLatLng());
                    });
                });

                const geocodeFromAddress = async () => {
                    const input = getInputParts();
                    const query = buildAddressQuery();
                    if (query.length < 6) return;
                    setButtonState('Dang tim...', true);
                    try {
                        const baseParams = () => new URLSearchParams({
                            format: 'jsonv2',
                            addressdetails: '1',
                            limit: '8',
                            countrycodes: 'vn',
                            'accept-language': 'vi'
                        });

                        const searches = [];
                        if (input.detail || input.district || input.province) {
                            const structured = baseParams();
                            if (input.detail) structured.set('street', input.detail);
                            if (input.district) {
                                structured.set('city', input.district);
                                structured.set('county', input.district);
                            }
                            if (input.province) structured.set('state', input.province);
                            structured.set('country', 'Vietnam');
                            searches.push(fetchNominatimSearch(structured));
                        }

                        const freeText = baseParams();
                        freeText.set('q', [query, 'Viet Nam'].filter(Boolean).join(', '));
                        searches.push(fetchNominatimSearch(freeText));

                        const batches = await Promise.all(searches);
                        const places = rankPlaces(batches.flat(), input);
                        renderResults(places);
                        setButtonState('Tim vi tri tu dia chi', false);
                    } catch (error) {
                        hideResults();
                        setButtonState('Loi tim vi tri', false);
                        setTimeout(() => setButtonState('Tim vi tri tu dia chi', false), 1800);
                    }
                };

                reverseGeocode = async (point) => {
                    try {
                        const params = new URLSearchParams({
                            lat: point.lat,
                            lon: point.lng,
                            format: 'jsonv2',
                            addressdetails: '1',
                            zoom: '18',
                            'accept-language': 'vi'
                        });
                        const result = await scheduleNominatim(() => fetch('https://nominatim.openstreetmap.org/reverse?' + params.toString()));
                        if (!result || !result.ok) return;
                        const place = await result.json();
                        if (place && place.address) writeAddress(place.address, place.display_name);
                    } catch (error) {
                        // Reverse geocoding is optional; keeping the selected coordinates is enough.
                    }
                };

                if (geocodeButton) {
                    geocodeButton.addEventListener('click', geocodeFromAddress);
                }

                [addressInput, wardInput, districtInput, provinceInput].forEach(input => {
                    if (!input) return;
                    input.addEventListener('keydown', function (event) {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        geocodeFromAddress();
                    });
                });

                map.on('click', function (event) {
                    hideResults();
                    reverseGeocode(event.latlng);
                });
            }

            setTimeout(() => map.invalidateSize(), 250);
        });
    }

    ready(function () {
        createBackground();
        cursorGlow();
        revealEffects();
        tiltEffects();
        magneticButtons();
        confirmForms();
        animatedCounters();
        parallaxHero();
        activeNavIndicator();
        hotelMaps();
    });
})();
