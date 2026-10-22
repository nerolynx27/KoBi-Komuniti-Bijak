import React from 'react';
import { SLIDES_DATA, SLIDE_METADATA } from './slideData';
import {
  SlideStage,
  SlideUnitenBadge,
  SlideSdpTag,
  SlideTicketBadge,
  SlideFoldedCard,
  SlideStickerCard
} from './SlideStage';
import './DeckAOriginal.css';

// The existing sprite uses bare symbol IDs. Keep this repair scoped to Deck A.
function SlideIcon({ name, size = 32, color = 'currentColor' }) {
  return <svg className="slide-icon" width={size} height={size} viewBox="0 0 20 20" fill="currentColor" style={{ color, flexShrink: 0 }} aria-hidden="true">
    <use href={`/assets/ui/icons.svg#${name}`} />
  </svg>;
}


export function DeckAOriginal({ slideIndex = 0 }) {
  const currentSlide = SLIDES_DATA[slideIndex] || SLIDES_DATA[0];

  return (
    <SlideStage className="deck-a-container">
      {/* Top Left UNITEN Badge (Consistent across all slides) */}
      <SlideUnitenBadge />

      {/* Top Right SDP Section Tag */}
      <SlideSdpTag section={currentSlide.sdpSection} variant={slideIndex === 1 ? 'cherry' : slideIndex === 7 ? 'cherry' : 'gold'} />

      {/* Render Slide based on index */}
      {slideIndex === 0 && <Slide1Cover data={currentSlide} />}
      {slideIndex === 1 && <Slide2Problems data={currentSlide} />}
      {slideIndex === 2 && <Slide3TargetUser data={currentSlide} />}
      {slideIndex === 3 && <Slide4Pillars data={currentSlide} />}
      {slideIndex === 4 && <Slide5Pillar1 data={currentSlide} />}
      {slideIndex === 5 && <Slide6Pillar2 data={currentSlide} />}
      {slideIndex === 6 && <Slide7Pillar3 data={currentSlide} />}
      {slideIndex === 7 && <Slide8Differentiation data={currentSlide} />}
      {slideIndex === 8 && <Slide9Feasibility data={currentSlide} />}
      {slideIndex === 9 && <Slide10MainGoal data={currentSlide} />}
      {slideIndex === 10 && <Slide11Closing data={currentSlide} />}
    </SlideStage>
  );
}

// SLIDE 1: COVER
function Slide1Cover({ data }) {
  return (
    <div className="deck-a-slide slide-bg-vanilla">

      {/* Rounded-square app logo frame */}
      <div className="deck-a-s1-badge">
        <img src="/assets/brand/icon only.png" alt="KoBi emblem" />
      </div>

      {/* Center-right giant KoBi wordmark */}
      <h1 className="deck-a-s1-title">KoBi</h1>

      {/* Bottom tagline ticket */}
      <div className="deck-a-s1-tagline">
        <SlideTicketBadge surface="gold" style={{ fontSize: '32px', padding: '18px 48px' }}>
          {data.tagline}
        </SlideTicketBadge>
      </div>

      {/* Bottom Sub-tag */}
      <div style={{ position: 'absolute', bottom: '24px', left: '48px', fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--color-wine)', letterSpacing: '0.05em' }}>
        SIME DARBY PROPERTY UNIVERSITY HACKATHON 2026 · TOWNSHIP OF TOMORROW
      </div>
    </div>
  );
}

// SLIDE 2: PROBLEMS VS OBJECTIVES (50/50 split with horizontal chevrons)
function Slide2Problems({ data }) {
  return (
    <div className="deck-a-slide">
      {/* Left Column: PROBLEMS */}
      <div className="deck-a-s2-left">
        <div className="deck-a-s2-header-badge" style={{ backgroundColor: 'var(--color-vanilla)', color: 'var(--color-cherry)' }}>
          {data.headerLeft}
        </div>

        {data.pairs.map((pair) => (
          <div key={pair.num} className="deck-a-s2-row">
            <div className="deck-a-s2-num-badge">{pair.num}</div>
            <div className="deck-a-s2-problem-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: 'var(--color-cherry)', margin: '0 0 6px 0' }}>
                {pair.problemTitle}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '27.6px', margin: 0, color: 'var(--color-wine)', lineHeight: 1.25 }}>
                {pair.problemDesc}
              </p>
            </div>
            {/* Center Stepped Chevron linking left to right */}
            <div className="deck-a-s2-chevron" />
          </div>
        ))}
      </div>

      {/* Right Column: OBJECTIVES */}
      <div className="deck-a-s2-right">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="deck-a-s2-header-badge" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-wine)' }}>
            {data.headerRight}
          </div>

          {data.pairs.map((pair) => (
            <div key={pair.num} className="deck-a-s2-objective-card">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-gold)', border: '2px solid var(--color-wine)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SlideIcon name="check" size={28} color="var(--color-wine)" />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '25px', color: 'var(--color-wine)', margin: 0, lineHeight: 1.2 }}>
                {pair.objective}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 3: TARGET AUDIENCE (Top header + 50/50 photo split + inward ribbons)
function Slide3TargetUser({ data }) {
  const [res, sdp] = data.personas;
  return (
    <div className="deck-a-slide slide-bg-vanilla">
      {/* Top Banner Header */}
      <div className="deck-a-s3-topbar">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '84px', color: 'var(--color-wine)', margin: 0, letterSpacing: '0.04em' }}>
          {data.header}
        </h2>
      </div>

      {/* Bottom Split Photos */}
      <div className="deck-a-s3-bottom">
        {/* Left: Residents */}
        <div className="deck-a-s3-half" style={{ borderRight: '4px solid var(--color-wine)' }}>
          <img className="photo" src="/assets/slides/deck-a-demo/community-volunteers.jpg" alt="Volunteers caring for a shared outdoor space" />
          <span className="deck-a-photo-credit">Illustrative photo · RDNE Stock project / Pexels</span>
          <div className="deck-a-s3-ribbon-left">
            <div className="deck-a-s3-icon-box">
              <img src={res.icon} alt="Residents icon" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>
                {res.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '31.2px', margin: 0, lineHeight: 1.3 }}>
                {res.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Sime Darby Property */}
        <div className="deck-a-s3-half">
          <img className="photo" src={sdp.photo} alt="Sime Darby Property building" />
          <div className="deck-a-s3-ribbon-right">
            <div className="deck-a-s3-icon-box">
              <img src={sdp.icon} alt="Sime Darby Property logo" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>
                {sdp.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '31.2px', margin: 0, lineHeight: 1.3 }}>
                {sdp.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 4: 3 CORE PILLARS OVERVIEW (Triptych)
function Slide4Pillars({ data }) {
  const surfaces = ['gold', 'vanilla', 'wine'];
  return (
    <div className="deck-a-s4-container">
      {data.pillars.map((pillar, idx) => {
        const isWine = surfaces[idx] === 'wine';
        return (
          <div key={pillar.num} className={`deck-a-s4-col slide-bg-${surfaces[idx]}`}>
            <div style={{ position: 'absolute', top: '210px', left: '60px', fontFamily: 'var(--font-heading)', fontSize: '48px', color: isWine ? 'var(--color-gold)' : 'var(--color-wine)', opacity: 0.8 }}>
              {pillar.num}
            </div>

            <div style={{ width: '120px', height: '120px', borderRadius: '4px', backgroundColor: isWine ? 'var(--color-gold)' : 'var(--color-wine)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}>
              <SlideIcon name={pillar.icon} size={64} color={isWine ? 'var(--color-wine)' : 'var(--color-vanilla)'} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '72px', textAlign: 'center', color: isWine ? 'var(--color-vanilla)' : 'var(--color-wine)', margin: '0 0 24px 0', lineHeight: 1.05, whiteSpace: 'pre-line' }}>
              {pillar.title}
            </h2>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '33.6px', textAlign: 'center', color: isWine ? 'var(--color-sand)' : 'var(--color-wine)', margin: 0, maxWidth: '440px' }}>
              {pillar.summary}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Slides 5–7 keep the expanding pillar composition, with real prototype captures.
function DemoScreen({ name, caption }) {
  return <figure className="deck-a-demo-screen">
    <img src={`/assets/slides/deck-a-demo/${name}.png`} alt={caption} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

function PillarSlide({ data, screens, note }) {
  const titles = ['Report an issue', 'Track repair progress', 'Discover and join activities'];
  const surfaces = ['gold', 'vanilla', 'wine'];
  return <div className="deck-a-acc-container">
    {titles.map((title, index) => index === data.pillarIndex - 1 ?
      <div key={title} className={`deck-a-acc-panel-expanded slide-bg-${surfaces[index]}`}>
        <header className="deck-a-pillar-heading">
          <span>PILLAR 0{data.pillarIndex}</span>
          <h2>{data.activeTitle.replace(/\n/g, ' ')}</h2>
        </header>
        <div className="deck-a-pillar-body">
          <div className="deck-a-pillar-copy">
            <ol>{data.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ol>
            <p className="deck-a-demo-note">{note}</p>
          </div>
          <div className="deck-a-demo-gallery">
            {screens.map(screen => <DemoScreen key={screen.name} {...screen} />)}
          </div>
        </div>
      </div> :
      <div key={title} className={`deck-a-acc-panel-collapsed slide-bg-${surfaces[index]}`}>
        <div className="deck-a-acc-title-vertical">{title}</div>
      </div>
    )}
  </div>;
}

function Slide5Pillar1({ data }) {
  return <PillarSlide data={data} screens={[
    { name: 'map', caption: '01 · Select a shared facility' },
    { name: 'report', caption: '02 · Describe and send a report' },
  ]} note="Local prototype screens · Sample data. The map is a temporary schematic." />;
}

function Slide6Pillar2({ data }) {
  return <PillarSlide data={data} screens={[
    { name: 'progress', caption: '01 · Repair status and staff history' },
    { name: 'evidence', caption: '02 · Sample evidence · Sandbox' },
  ]} note="Prototype history and separate sandbox evidence illustration. Pixel worker animation is a planned world feature." />;
}

function Slide7Pillar3({ data }) {
  return <PillarSlide data={data} screens={[
    { name: 'activities', caption: '01 · Discover community activities' },
    { name: 'activity-detail', caption: '02 · View details and join' },
  ]} note="Local prototype screens · Sample activity and participation data." />;
}

function Slide8Differentiation({ data }) {
  return <div className="deck-a-s8-container">
    <section className="deck-a-s8-left-half">
      <h2>{data.leftHeader}</h2>
      {data.differentiators.map(item => <div key={item.title} className="deck-a-s8-card">
        <SlideIcon name={item.icon} size={62} />
        <div><h3>{item.title}</h3><p>{item.desc}</p></div>
      </div>)}
    </section>
    <section className="deck-a-s8-right-half">
      <h2>{data.rightHeader}</h2>
      {data.impacts.map(item => <div key={item.stakeholder} className="deck-a-s8-card">
        <SlideIcon name={item.icon} size={62} />
        <div><h3>{item.stakeholder}</h3><p>{item.desc}</p></div>
      </div>)}
    </section>
  </div>;
}

// SLIDE 9: FEASIBILITY & IMPLEMENTATION (Z-pattern horizontal split)
function Slide9Feasibility({ data }) {
  return (
    <div className="deck-a-slide">
      {/* Top Half: What the first version includes */}
      <div className="deck-a-s9-top">
        {/* Left Bullets */}
        <div style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {data.firstVersionFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--color-sand)', border: '3px solid var(--color-wine)', boxShadow: '4px 4px 0 var(--color-wine)', padding: '14px 22px', fontFamily: 'var(--font-heading)', fontSize: '22px', color: 'var(--color-wine)' }}>
                <SlideIcon name="check" size={24} color="var(--color-wine)" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Title */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '72px', color: 'var(--color-wine)', textAlign: 'right', margin: 0, maxWidth: '800px', lineHeight: 1.05 }}>
          {data.topHeader}
        </h2>
      </div>

      {/* Bottom Half: How we measure success */}
      <div className="deck-a-s9-bottom">
        {/* Left Title */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '72px', color: 'var(--color-wine)', margin: 0, maxWidth: '750px', lineHeight: 1.05 }}>
          {data.bottomHeader}
        </h2>

        {/* Right Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '960px' }}>
          {data.successMetrics.map((q, i) => (
            <div key={i} style={{ background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', boxShadow: '4px 4px 0 var(--color-wine)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ background: 'var(--color-cherry)', color: 'var(--color-vanilla)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '18px', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '28.8px', color: 'var(--color-wine)', lineHeight: 1.25 }}>
                {q}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 10 separates the vision from the township image.
function Slide10MainGoal({ data }) {
  return <div className="deck-a-slide">
    <div className="deck-a-s10-left">
      <h2>{data.header}</h2>
      <div className="deck-a-s10-vision">
        <span>TOWNSHIP OF TOMORROW VISION</span>
        <p>{data.manifesto}</p>
      </div>
    </div>
    <div className="deck-a-s10-right">
      <img className="bg" src="/assets/slides/deck-a-demo/city-kl-greenery.jpg" alt="Kuala Lumpur skyline with urban greenery" />
    </div>
  </div>;
}

// SLIDE 11: CLOSING (Stepped Diagonal Split)
function Slide11Closing() {
  return (
    <div className="deck-a-slide slide-bg-wine">
      <div className="deck-a-s11-left">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '170px', lineHeight: 0.88, color: 'var(--color-vanilla)', margin: '0 0 24px 0', textShadow: '6px 6px 0 var(--color-gold)' }}>
          THANK<br />YOU
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
          <div className="deck-a-closing-logo-frame"><img src="/assets/brand/icon only.png" alt="KoBi logo" className="deck-a-closing-logo" /></div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--color-gold)' }}>KoBi — Komuniti Bijak</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '26.4px', color: 'var(--color-sand)' }}>The Smart Civic Platform for Sustainable Townships</div>
          </div>
        </div>
      </div>

      <div className="deck-a-s11-right">
        <img src="/assets/slides/deck-a-demo/city-kl-skyline.jpg" alt="High-resolution Kuala Lumpur skyline with the Petronas Towers" />
      </div>
    </div>
  );
}
