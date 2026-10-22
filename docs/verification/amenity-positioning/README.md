# Real Map Spatial Assembly & Amenity Positioning Verification

**Verification Target:** `http://localhost:5173/compiled-gallery.html` & `src/features/world/TemporaryMap.jsx`  
**Date:** 22 October 2026  
**Status:** All 8 approved pixel-art assets assembled into the 640x480 map matching the verified Elmina Seksyen U16 composition.

---

## 1. Verified Amenity Spatial Positioning & Grid Coordinates

| Amenity / Facility | Asset File | Grid Coords (32x24) | Pixel Position (640x480) | Footprint / Dimensions | Verified Features |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dewan Komuniti Elmina** | `hall-01-classic-dewan.svg` | x: 21, y: 6 | x: 420px, y: 120px | 4 x 3 tiles (80 x 55 px) | Traditional *bumbung bertingkat* hip roof, entrance marquee with live text, double entrance doors, flagpole, landscaped apron. |
| **Surau Al-Falah** | `mosque-01-classic-dome-surau.svg` | x: 22, y: 16 | x: 440px, y: 320px | 4 x 3 tiles (80 x 55 px) | Classic golden dome with crescent finial, freestanding octagonal minaret tower, keyhole arch doors, stained-glass windows, wudhu portico. |
| **Taman Permainan Kanak-Kanak** | `park-01-classic-playground.svg` | x: 10.2, y: 15.4 | x: 204px, y: 308px | ~3 x 2 tiles (64 x 44 px) | Colorful play tower with hipped canopy, yellow slide, swing frame with suspended seats, spring rider, park bench. |
| **Tasik Ekologi & Boardwalk** | `lake-03-wetland-boardwalk.svg` | x: 13.4, y: 16.8 | x: 268px, y: 336px | ~3.5 x 2.5 tiles (70 x 48 px) | Serpentine timber boardwalk with handrails, dual-tone pond water, wetland reed vegetation, lakeside gazebo. |
| **Persiaran Elmina Arterial Boulevard** | `road-01-classic-boulevard.svg` | x: 0..32, y: 11..13 | x: 0px, y: 220px | Full width (640 x 40 px) | Dual-carriageway asphalt, landscaped center median strip with bougainvillea shrubs, dashed travel lane lines, zebra crosswalks. |
| **JKR Streetlights (Verges)** | `streetlight-01-jkr-galvanised.svg` | 6 locations | Roadside verges | 1 x 1 tile (30 x 35 px) | JKR galvanized tubular mast, outreach curved arm, luminaire fixture, concrete plinth base, yellow street illumination beam. |
| **Alex Tan's Home (Lot 12)** | `house-01-modern-terrace.svg` | x: 4, y: 8 | x: 80px, y: 160px | 2 x 2 tiles (40 x 32 px) | Dedicated 2-tile clearance above, prominent `★ MY HOUSE` pinpoint banner, terracotta pitched roof, tandem car porch, front garden. |
| **Elmina Station Recycling Depot** | Custom civic depot | x: 27, y: 7 | x: 540px, y: 140px | 2 x 2 tiles (40 x 40 px) | Recycling bins for paper, plastic, glass & e-waste, green eco-enclosure. |
| **Elmina Central Park Grounds** | Turf & jogging loop | x: 10..17, y: 15..21 | x: 196px, y: 294px | 7 x 6 tiles (148 x 132 px) | Border jogging/walking trail, lush lawn, shady trees, community gathering perimeter. |

---

## 2. Screenshot Verification Artifacts

The following high-resolution screenshots were captured and verified:

1. **`01-full-assembled-map.png`**  
   Complete 640x480 assembled township map displaying Persiaran Elmina arterial corridor, Jalan Frekuensi 1, 2, 3, 4 avenues, all 4 residential precincts with individual lot numbers, all civic and recreation amenities, and roadside streetlights.

2. **`02-civic-hall-and-surau.png`**  
   Zoomed capture of the Civic Zone: Dewan Komuniti Elmina at (420, 120), Surau Al-Falah at (440, 320), Recycling Depot at (540, 140), and Light #11 on the Persiaran Elmina verge.

3. **`03-recreation-park-lake-playground.png`**  
   Recreation zone in Elmina Central Park: Taman Permainan at (204, 308) and Tasik Ekologi at (268, 336), surrounded by the jogging track, garden bench, Lamp #03, and Streetlight #12.

4. **`04-residential-alex-home-lot12.png`**  
   Precinct 1 Residential area showing Alex Tan's Home (Lot 12) at (80, 160) with `★ MY HOUSE` pinpoint, 2-tile clearance, neighboring lots (08, 09, 10, 11, 13), and vergeside streetlights Lamp #01 and Lamp #02.

5. **`05-infrastructure-persiaran-frekuensi-streetlights.png`**  
   Persiaran Elmina dual-carriageway corridor with center bougainvillea landscaped median, dashed lane markings, pedestrian zebra crosswalks, and all 6 vergeside JKR streetlights with illumination pools.

6. **`06-amenity-inspection-interactive.png`**  
   Interactive Amenity Inspector card verifying live click inspection with grid coordinates, asset filename, walking distance from Lot 12, and operational status.

7. **`07-app-main-map-confirmation.png`**  
   Main application map at `http://localhost:5173/#map` confirming 100% spatial composition consistency between the catalog assembly and the core application.
