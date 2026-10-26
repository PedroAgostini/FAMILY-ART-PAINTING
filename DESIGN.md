---
name: Family Art Painting
description: One day on a Massachusetts street, painted in multiplane gouache, from dawn navy to dusk windows.
colors:
  night: "#0b1533"
  navy: "#1f3159"
  navy-2: "#2b3f6e"
  dusk: "#16244d"
  mist: "#8fa3c4"
  haze: "#eef2f8"
  haze-2: "#dfe6f1"
  line: "#cdd5e3"
  white: "#ffffff"
  maple: "#c8161c"
  maple-hover: "#a91217"
  maple-deep: "#8e1c1f"
  leaf-ember: "#e88a3e"
  amber: "#f2b24a"
  ink: "#14203f"
  ink-2: "#44506e"
  on-dark-2: "#c3cbe0"
typography:
  display:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.1rem + 3.7vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.3rem + 2.8vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "1.36rem"
    fontWeight: 400
    lineHeight: 1.15
  quote:
    fontFamily: "Young Serif, Georgia, serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.45
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.005em"
  tag:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.03em"
rounded:
  pill: "999px"
  big: "28px"
  card: "24px"
  photo: "18px"
  tile: "14px"
  field: "12px"
  nav: "10px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(4.5rem, 3rem + 6vw, 8.5rem)"
  grid-gap: "20px"
  stack: "16px"
  container: "1240px"
  header: "76px"
  header-mobile: "66px"
components:
  button-primary:
    backgroundColor: "{colors.maple}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.8em 1.5em"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.maple-hover}"
  button-ghost-light:
    backgroundColor: "rgba(11, 21, 51, 0.25)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.8em 1.5em"
    height: "50px"
  button-ghost-light-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "0.8em 1.5em"
  button-outline-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
  card-service:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "10px"
  card-photo:
    backgroundColor: "{colors.haze-2}"
    rounded: "{rounded.photo}"
  review-card:
    backgroundColor: "{colors.white}"
    typography: "{typography.quote}"
    rounded: "{rounded.card}"
    padding: "30px"
  tabs:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "6px"
  tab-selected:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  compare-frame:
    backgroundColor: "{colors.navy}"
    rounded: "{rounded.big}"
  form-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.big}"
    padding: "clamp(24px, 3.5vw, 40px)"
  field:
    backgroundColor: "#fbfcfe"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 14px"
    height: "52px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip-selected:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
  tag-real:
    backgroundColor: "{colors.night}"
    textColor: "{colors.white}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  swatch:
    rounded: "{rounded.pill}"
    size: "40px"
  action-bar-primary:
    backgroundColor: "{colors.maple}"
    textColor: "{colors.white}"
    rounded: "{rounded.tile}"
    height: "48px"
  action-bar-secondary:
    backgroundColor: "{colors.haze}"
    textColor: "{colors.navy}"
    rounded: "{rounded.tile}"
    height: "48px"
---

# Design System: Family Art Painting

## Overview

**Creative North Star: "One Day on a Massachusetts Street"**

The whole system is a single day lived on one New England street, told as multiplane cel animation. The page opens at dawn: a navy sky breaking to amber at the horizon, gouache-edged SVG planes of hills, pines, maples and a lit white colonial stacked at different depths, a camera that sinks through them on scroll. Daylight sections sit in cool haze with navy ink. The 3D repaint and the contact block return to dusk, where the only warm light left is lamp amber in windows. Every surface belongs to some hour of that day.

Depth is built the cel way, by separate planes moving at their own speed, not by heavy shadows. Photos sit on rounded cel cards whose photo plane drifts against the text plane. Paper grain covers everything (7% page-wide, 16% in the hero, 30% in the repaint stage), so flat fills read as painted stock rather than screen color. Type pairs a soft, inky title-card serif (Young Serif) for anything that is a heading or a spoken line with a sturdy grotesque (Archivo) for everything that works: body, buttons, labels, fields, numbers.

Density is generous and calm: wide section padding, large rounded forms, pill controls. Red is the brand's maple: it is foliage in the scenery and the single call to act in the interface. Green is absent from the world entirely; New England foliage here is maple red, ember orange and navy pine.

**Key Characteristics:**
- Time of day as palette: dawn and dusk navies for immersive sections, cool haze for daylight reading sections.
- Multiplane depth: layered SVG planes and cel cards that move at independent depths, with grain on top.
- Maple red is both foliage and the action color; amber is light (windows, stars, focus), never decoration.
- Young Serif for title cards and spoken lines; Archivo for all working text.
- Soft, rounded, tactile forms: pills, 24 to 28px cards, round swatches and step dots.

## Colors

A dawn-to-dusk New England palette: deep navies and cool haze carry the page, maple red acts, lamp amber glows.

### Primary
- **Maple Red** (maple): the one action color. Primary buttons, the mobile action-bar primary, active step dots, the repaint progress bar, selected-swatch ring, the active compare thumbnail border, card links, FAQ chevrons, error text, and the hero fact icons. In the scenery it is the dominant maple foliage and the falling leaves.
- **Pressed Maple** (maple-hover): hover state of primary buttons only.
- **Deep Maple** (maple-deep): shadowed foliage in the planes and 3D trees; in UI only the "Our focus" emphasis in the seasons strip.

### Secondary
- **Colonial Navy** (navy): the logo navy and the working dark on light surfaces. Selected tab ink, selected chips, outline buttons, avatar discs, process step icons at rest, signature names, compare-frame backing, focused field border.
- **Shutter Navy** (navy-2): scrollbar thumb and the navy siding chip; a lighter navy step for planes.

### Tertiary
- **Lamp Amber** (amber): light, never paint. Lit windows in the hero, the 3D house and the dusk skyline; review stars; why-list and contact-fact icons; text selection; the global focus ring and the field focus glow. Also the low radial horizon glow behind the repaint stage and the Why and Contact skies.
- **Ember Leaf** (leaf-ember): secondary foliage tone in the hero falling leaves, 3D maple blobs and the fall slice of the seasons strip. Scenery only.

### Neutral
- **Dawn Night** (night): the deepest sky. Hero gradient top, solid header, repaint section, footer, the "Real project" tag, mobile menu sheet, and the ink of the dusk skyline houses.
- **Dusk Navy** (dusk): middle of the night gradients (repaint stage, Why section bottom, Contact bottom) and the 3D fog.
- **Mist** (mist): process path line, mobile dotted step connector, field hover border.
- **Morning Haze** (haze): the daylight page background for every reading section; also the hero fade-out at the bottom, cel-front borders and step-icon rings, so photos and dots appear cut out of the page.
- **Haze Shade** (haze-2): placeholder fill behind card photos.
- **Rule Line** (line): hairline dividers, field and chip borders, tabs-track base line.
- **Clapboard White** (white): cards, form card, tabs track, review cards, and text on dark.
- **Navy Ink** (ink): headings and primary text on haze and white.
- **Slate Ink** (ink-2): secondary body copy, section-head side copy, card descriptions, unselected tabs.
- **Moonlit Text** (on-dark-2): secondary text on night and dusk sections.

### Named Rules
**The Time of Day Rule.** Every section is an hour of the same day. Reading sections are daylight (haze ground, navy ink); immersive sections are dawn or dusk (night-to-dusk gradients, white and moonlit text). Never introduce a section color that is not a sky.

**The Lamp Rule.** Amber is light, not paint. It appears where something glows (windows, stars, focus, selection, an icon lit on a dark ground) and never as a fill for buttons, cards or large areas.

**The One Maple Rule.** In the interface, maple red means "act" (book, call, text, current, selected, error). Decorative red belongs only to foliage in the scenery.

**The No Green Rule.** The world has no green: foliage is maple, ember and navy pine. This is a brand commitment, not an accident.

## Typography

**Display Font:** Young Serif (with Georgia, serif)
**Body Font:** Archivo, variable 400 to 800 (with Helvetica Neue, Arial, sans-serif)

**Character:** Young Serif is the title card of an animated short: soft, inky, a little old-fashioned, warm. Archivo is the crew: plain, sturdy, legible at phone sizes, with tabular figures for phone numbers.

### Hierarchy
- **Display** (Young Serif 400, clamp 2.5 to 4.6rem, 1.02, -0.02em, balanced wrap): the hero headline only, with a soft navy text shadow so it sits on the nearest plane.
- **Headline** (Young Serif 400, clamp 2.1 to 3.6rem, 1.06, -0.012em, balanced wrap): every section title, capped at 12 to 20ch; navy ink on haze, white on night.
- **Title** (Young Serif 400, 1.2 to 1.7rem, 1.15 to 1.3): card titles, repaint steps, why items, seasons, process steps, compare title, form title, area heading, signature names.
- **Quote** (Young Serif 400, 1.2rem, 1.45): review text. Spoken lines are set in the serif.
- **Lead** (Archivo 400, clamp 1.125 to 1.3rem, 1.55): hero sub and section leads, about 34em max.
- **Body** (Archivo 400, 1.0625rem, 1.6): running text, kept to 40 to 62ch.
- **Label** (Archivo 700, 1rem, 1.1): buttons, tabs, chips (600), field labels (.92rem), FAQ summaries (1.06rem), nav (600, .96rem).
- **Tag** (Archivo 700, .74 to .8rem, .03em): photo tags and captions on pill grounds.

### Named Rules
**The Title Card Rule.** Young Serif is for headings and for words a person says (reviews, signature names, the mobile menu). It is always weight 400; never bold it, never set buttons, labels or fields in it.

**The Tabular Phone Rule.** Any phone number is Archivo with tabular numerals.

## Layout

A centered container (1240px max) with a fluid gutter (clamp 16 to 40px). Sections breathe with fluid vertical padding (clamp 4.5 to 8.5rem). Section heads are a split row: headline left (max 15ch), a short slate paragraph right (max 40ch), aligned to baseline; centered variants exist for reviews.

Two-column compositions use asymmetric fractions (1.05fr/1fr about, 1.1fr/1fr compare, 1.15fr/.85fr why, .8fr/1.2fr FAQ with a sticky head, 1fr/1fr contact with a sticky form). Card rows are 4-up (services, compare thumbs, gallery, seasons) with 16 to 20px gaps.

The header is fixed (76px, 66px under 900px), transparent over the hero and turning solid night once scrolled; it hides on scroll down. Breakpoints: 1140px (nav collapses to a full-screen night sheet with serif links; cards and seasons go 2-up), 900px (all two-column grids stack, the hero scene becomes a 340px band under the copy, the mobile action bar appears and the body reserves 72px for it), 640px (service cards become an 84% horizontal snap carousel, seasons stack, tabs stretch full width, the hero keeps only the primary button).

## Elevation & Depth

Depth comes from planes first and shadows second. The hero is six SVG planes at increasing depth (0.02 sky, 0.06 far hills, 0.12 pines, 0.2 maples, 0.32 house, 0.55 foreground leaves); on scroll each sinks and scales by its depth and the foreground blurs up to 6px, and the pointer pans them slightly. About photos are two cel figures drifting at opposite depths (0.06 and -0.08). Service card photos drift up to 28px against their text. Grain overlays sit above everything.

Shadows are soft, long, navy-tinted and negative-spread, like a cel lifted off its background. They never use hard offsets.

### Shadow Vocabulary
- **Soft cel** (`box-shadow: 0 18px 40px -18px rgba(11,21,51,.35), 0 4px 10px -4px rgba(11,21,51,.12)`): back cel photo, open FAQ item, process step icons.
- **Lifted cel** (`box-shadow: 0 28px 60px -24px rgba(11,21,51,.45), 0 6px 14px -6px rgba(11,21,51,.16)`): front cel, compare frame, hovered service card.
- **Maple glow** (`box-shadow: 0 10px 24px -12px rgba(200,22,28,.8)`): primary button at rest; deepens to .9 alpha on hover.
- **Deep float** (`box-shadow: 0 40px 80px -40px rgba(0,0,0,.7)`): form card and why photo on night grounds.
- **Action bar** (`box-shadow: 0 -10px 30px -12px rgba(11,21,51,.35)`): mobile action bar, cast upward.

### Named Rules
**The Plane Rule.** Separate things by moving them at different depths before reaching for a heavier shadow. A new immersive surface adds a plane, not a drop shadow.

**The Grain Rule.** Every surface sits under paper tooth. Never ship a large flat fill without the page grain above it.

## Shapes

Soft and rounded throughout, like cut paper cels. Controls are pills (999px): buttons, tabs, chips, photo tags, the compare toggle, the tabs track. Media and containers step down in radius with size: compare frame, form card, about cels and repaint fallback at 28px; service and review cards at 24px; photos inside cards and FAQ items at 18px; thumbnails, action-bar buttons and icon tiles at 14px; fields at 12px; nav hovers at 10px. Swatches, step dots, avatars, process icons and the phone icon are perfect circles.

The cel-front figure is framed by an 8px haze border with radius 28 + 8, so it reads as a card cut out of the page. The seasons strip is one continuous painted image rounded only at its outer ends (24px), sliced into four columns.

## Components

### Buttons
Tactile pills with an arrow that nudges forward on hover.
- **Shape:** full pill (999px), 2px border, min-height 50px (42px small, 58px large).
- **Primary:** maple fill, white Archivo 700 label, maple glow shadow. Hover darkens to pressed maple and the glow deepens; the trailing arrow moves 3px right. Active presses down 1px at .99 scale.
- **Ghost light:** on dark scenery only. White label, 55% white border, 25% night fill; hover inverts to a white pill with night text.
- **Outline:** navy text and 2px navy border on haze; hover fills navy with white text.
- **Focus:** global 3px amber outline at 3px offset.

### Chips
- **Style:** pill, 1.5px rule-line border, Archivo 600, 10px 20px.
- **State:** checked fills navy with white text; keyboard focus adds a 4px amber glow ring. Used for multi-select in the form.

### Cards / Containers
- **Service card:** white, 24px radius, 10px inset around an 18px-radius photo (4:3.3) with a night "Real project" pill tag; body 18px 12px with a serif title, slate description and a maple link with arrow. The whole card is the link target. Hover lifts 4px with the lifted cel shadow, the photo plane rises and zooms (1.14 to 1.2) while the text plane rises only 2px.
- **Review card:** white, 24px radius, 30px padding, amber stars, serif quote, navy avatar disc with a serif initial.
- **FAQ item:** white, 18px radius, 22px 24px summary with a maple chevron that rotates 180 degrees; open state gains the soft cel shadow.
- **Form card:** white, 28px radius, fluid 24 to 40px padding, deep float shadow, sticky on desktop.

### Tabs
- **Style:** white pill track (6px padding, rule-line base) holding transparent pill tabs in Archivo 700, slate text.
- **Selected:** a navy ink pill slides and resizes under the selected tab (.5s ease-out), text turns white. On tab change cards re-enter in a 60ms stagger, rising 22px.

### Inputs / Fields
- **Style:** min-height 52px, 12px radius, 1.5px rule-line border, near-white (#fbfcfe) fill, bold .92rem label above.
- **Hover:** border shifts to mist.
- **Focus:** border becomes navy, fill white, plus a 4px amber glow at 45%.
- **Error:** maple border and a maple .86rem message beneath. Selects carry a custom chevron.

### Navigation
- **Desktop:** white Archivo 600 links at 86% opacity, 10px-radius hover tint; the current section gets a 2px maple underline. Right side: phone block (circle icon, small "Call or text" label, tabular number) and a small primary button.
- **Mobile:** menu toggle in a 12px-radius translucent tile opens a full-screen night sheet with Young Serif 1.7rem links divided by faint rules and a pill CTA. Under 900px the phone icon becomes a solid maple circle.

### Mobile Action Bar
Fixed white bar at the bottom under 900px, three columns (1fr 1fr 1.4fr): Call and Text on haze with navy text, Book on maple with white text, all 48px tall with 14px radius, respecting the safe-area inset. It slides away (110%) while the booking form is on screen.

### Hero Multiplane
Full-viewport dawn scene (min 660px). The sky is a single vertical gradient from night through dusk violets and rose to amber at the horizon; above it sit the six gouache SVG planes, seven falling maple leaves (maple, deep maple, ember tones, 12 to 22px, 12 to 19s loops), page grain at 16% overlay, and a fade to haze over the bottom 22% so the fact row lands on daylight. The copy sits on a left night scrim, drifts up and fades as the camera sinks. Under 900px the scene becomes a 340px band below the copy.

### Repaint Stage
A 360vh scroll-pinned section (330vh mobile) on a night-to-dusk gradient with an amber horizon glow and 30% grain. A Three.js colonial in the same gouache palette (amber-lit windows, maple door and roller grip, maple and ember trees, dusk fog) is repainted by a 3D roller from weathered wood to primer to finish as you scroll; a 4px maple progress bar tracks it. The left panel (430px, on a night scrim) lists three steps with round dots: inactive 68% opacity, active maple with a soft maple halo, done white, joined by a faint vertical line. Under 900px the canvas takes the top 54% and only the active step shows.

### Siding Swatches
40px circles filled with the paint color, 3px translucent white border; hover scales 1.08; selected gets a white border plus a 3px maple ring. Disabled (dashed, 40% opacity) until the finish stage unlocks them. The paint chips are content, not system colors: Classic White, Harbor Gray, Colonial Navy, Barn Red, Buttercream, Slate Blue.

### Compare Frame
Before and after in a 28px-radius frame (4:4.6) with the lifted cel shadow. The after image is revealed by an animated clip (1.1s ease-out) led by a white 6px roller line with a circular roller handle; a night pill toggle at the bottom switches Before and After (pressed state is a white pill with night text). Beside it, 4-up 3:4 thumbnails at 14px radius gain a maple border when active.

### Seasons Street Strip
One painted street (seasons-street.svg) spread across four columns as a single continuous image: winter, spring, summer, fall, each column showing its slice via background position, rounded only at the outer ends. Below each slice: serif season name, slate description, and an "Our focus" line over a rule with the label in deep maple. At 1140px and below each slice becomes its own 20px-rounded tile.

## Do's and Don'ts

### Do:
- **Do** set every reading section on Morning Haze with Navy Ink, and every immersive section on a night-to-dusk gradient.
- **Do** reserve maple red for the action and state in the interface: book, call, current, selected, error.
- **Do** use amber only where something glows: windows, stars, icons on dark, focus rings, selection.
- **Do** build depth with planes moving at different rates (hero planes, cel figures, card photo against card text) before adding shadow.
- **Do** keep controls as pills and step containers down in radius as they shrink (28, 24, 18, 14, 12px).
- **Do** keep every motion on the single ease-out curve (cubic-bezier(.16, 1, .3, 1)) and switch it off under reduced motion, including falling leaves.
- **Do** keep a call, text or book control reachable in every viewport, including the mobile action bar.

### Don't:
- **Don't** use green anywhere, in UI or scenery.
- **Don't** bold Young Serif or set buttons, labels or fields in it.
- **Don't** fill buttons, cards or large areas with amber.
- **Don't** use hard offset shadows; shadows are soft, long and negative-spread.
- **Don't** ship a large flat fill without the paper grain over it.
- **Don't** put a stock photo under a navy overlay as a hero; the hero is the painted street.
