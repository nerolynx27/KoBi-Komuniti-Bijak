# Design Document: Elmina Frekuensi Pixel Neighbourhood Map

**Date:** 2026-10-20  
**Status:** Approved for Worldbox Prototyping (4 Map Approaches)  
**Target Views:** 
- Standalone Sandbox: `worldbox.html` (`src/dev/worldbox/`) with 4 distinct approach switchers
- Main App Integration: "Places we share" (`src/features/world/`) and "SDP World Editor" (`src/features/world-editor/`) once an approach is chosen.

---

## 1. Intent and Why
KoBi connects residents and township management to their shared community. Rather than guessing which visual interpretation of Elmina Seksyen U16 (Persiaran Elmina / Jalan Frekuensi) feels best, we will create **4 distinct interactive map approaches** within a dedicated, isolated developer sandbox (`worldbox.html`). All 4 will adhere strictly to the project's design system (5-colour palette, Bungee/Yanone Kaffeesatz typography, pixelated theme, real Elmina geography) while presenting different visual and spatial styles for evaluation.

---

## 2. The 4 Map Approaches (To Compare in Worldbox)

### Approach 1: Classic 2D Orthographic Grid (Retro RPG Style)
- **Visual Style:** Flat top-down orthogonal pixel grid inspired by classic retro games (e.g. Pokémon / Zelda / EarthBound).
- **Strengths:** Maximum clarity, exact tile alignment, zero visual distortion, very lightweight.
- **Key Features:** Crisp grid lines, distinct rooftop blocks, green lawn tiles, and clear path textures.

### Approach 2: Angled 2.5D Isometric Diorama (SimCity / Habbo Style)
- **Visual Style:** 2.5D isometric view with angled rooftops, visible building facades, and subtle pixel depth cues.
- **Strengths:** Rich sense of township life, architectural depth, realistic building profiles.
- **Key Features:** Isometric projection of the community hall, surau, and housing rows with dimensional depth.

### Approach 3: Pixel Cartographic Blueprint (Civic Transit / High-Legibility Map)
- **Visual Style:** Bold, stylized civic transit/blueprint map translated into chunky pixel art.
- **Strengths:** Immediate glanceability, prominent arterial hierarchy (Persiaran Elmina main artery vs Jalan Frekuensi local streets).
- **Key Features:** High-contrast road corridors, clean zone demarcations, prominent landmark badges.

### Approach 4: Pixel Stickerboard Patch (Tactile Community Canvas)
- **Visual Style:** Directly embodies KoBi's selected **Pixel Stickers (Concept 03)** design philosophy.
- **Strengths:** Friendly, tactile, community-focused; feels like an interactive pinboard of neighborhood stickers.
- **Key Features:** Chunky badge-style amenity pins with white/cream die-cut borders, tactile click states, and playful dashed parcel plots.

---

## 3. Shared Functionality Across All 4 Approaches
Every approach in the Worldbox sandbox provides:
1. **Real Elmina Geography:** Accurate layout of Persiaran Elmina and Jalan Frekuensi (Seksyen U16 Shah Alam).
2. **Key Amenities:**
   - Resident's Home (`Lot 12, Jalan Frekuensi`) with "My House" tracker
   - Dewan Komuniti Elmina (Community Hall)
   - Elmina Central Green Park & linear gardens
   - Surau Al-Falah (Mosque / Surau)
   - Streetlights along Persiaran Elmina & Jalan Frekuensi
   - Elmina Recycling & waste point
3. **Interactive Navigation:**
   - Zoom in (`+`), Zoom out (`-`), and Reset View controls
   - Smooth pan & drag support
   - "Find my house" quick-recenter button
4. **Interactive Amenity Details Sheet (`FacilitySheet`):**
   - Live condition status (*Normal*, *Reported*, *Work in progress*)
   - Walking distance calculated from resident's home (e.g., `140 m · ~2 min walk`)
   - Report history feed (past maintenance records and staff updates)
   - Upcoming scheduled community activities
   - Action button to report an issue
5. **Interactive Switcher Bar:**
   - Clean top tab bar to instantly toggle between Approaches 1, 2, 3, and 4 in real-time.
   - Persona toggle: Switch between Alex Tan (Resident) and SDP Team (Staff).
