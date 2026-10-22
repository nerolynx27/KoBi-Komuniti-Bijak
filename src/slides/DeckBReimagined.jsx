import React from 'react';
import { SLIDES_DATA, SLIDE_METADATA } from './slideData';
import {
  SlideStage,
  SlideUnitenBadge,
  SlideSdpTag,
  SlideIcon,
  SlideTicketBadge,
  SlideFoldedCard,
  SlideStickerCard
} from './SlideStage';
import './DeckBReimagined.css';

export function DeckBReimagined({ slideIndex = 0 }) {
  const currentSlide = SLIDES_DATA[slideIndex] || SLIDES_DATA[0];

  return (
    <SlideStage className="deck-b-container">
      {/* Top Left UNITEN Badge */}
      <SlideUnitenBadge />

      {/* Top Right SDP Section Tag */}
      <SlideSdpTag section={currentSlide.sdpSection} variant={slideIndex === 1 ? 'cherry' : slideIndex === 7 ? 'cherry' : 'gold'} />

      {/* Render Slide based on index */}
      {slideIndex === 0 && <Slide1CommandCenter data={currentSlide} />}
      {slideIndex === 1 && <Slide2Swimlanes data={currentSlide} />}
      {slideIndex === 2 && <Slide3Dossiers data={currentSlide} />}
      {slideIndex === 3 && <Slide4Pipeline data={currentSlide} />}
      {slideIndex === 4 && <Slide5MobileSplit data={currentSlide} />}
      {slideIndex === 5 && <Slide6MobileSplit data={currentSlide} />}
      {slideIndex === 6 && <Slide7MobileSplit data={currentSlide} />}
      {slideIndex === 7 && <Slide8PanoramicMatrix data={currentSlide} />}
      {slideIndex === 8 && <Slide9SpecClipboard data={currentSlide} />}
      {slideIndex === 9 && <Slide10Manifesto data={currentSlide} />}
      {slideIndex === 10 && <Slide11Postcard data={currentSlide} />}
    </SlideStage>
  );
}

// SLIDE 1: COMMAND CENTER HERO
function Slide1CommandCenter({ data }) {
  return (
    <div className="deck-b-slide slide-bg-sand">
      <div className="deck-b-s1-container">
        {/* Left: Typographic Command Deck */}
        <div className="deck-b-s1-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img src={data.assets.badge} alt="KoBi Logo" style={{ width: '130px', height: '130px', borderRadius: '50%', border: '4px solid var(--color-wine)', boxShadow: '4px 4px 0 var(--color-wine)' }} />
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-cherry)' }}>CIVIC INNOVATION PLATFORM</span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '130px', margin: 0, color: 'var(--color-wine)', lineHeight: 0.9 }}>
                KoBi
              </h1>
            </div>
          </div>

          <div>
            <SlideTicketBadge surface="gold" style={{ fontSize: '30px', padding: '16px 36px', marginBottom: '24px' }}>
              {data.tagline}
            </SlideTicketBadge>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '28px', color: 'var(--color-wine)', margin: 0, lineHeight: 1.4, maxWidth: '820px' }}>
              Transforming blueprints into reality for sustainable community living long after the keys are handed over.
            </p>
          </div>

          {/* Team Metadata Box */}
          <div style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-wine)' }}>TEAM: {SLIDE_METADATA.team.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-wine)' }}>{SLIDE_METADATA.team.institution}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', background: 'var(--color-wine)', color: 'var(--color-vanilla)', padding: '6px 14px' }}>
              SDP HACKATHON 2026
            </div>
          </div>
        </div>

        {/* Right: Framed Township Preview Window with HUD Markers */}
        <div className="deck-b-s1-right">
          <img src={data.assets.bg} alt="Township map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />

          {/* HUD Status Marker Overlays */}
          <div style={{ position: 'absolute', top: '40px', right: '40px', background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '12px 18px', boxShadow: '4px 4px 0 var(--color-wine)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--color-wine)' }}>PILOT TOWNSHIP: ELMINA</span>
          </div>

          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '10px 14px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '15px' }}>
              ✓ NORMAL (34)
            </div>
            <div style={{ flex: 1, background: 'var(--color-cherry)', color: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '10px 14px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '15px' }}>
              ! REPORTED (3)
            </div>
            <div style={{ flex: 1, background: 'var(--color-gold)', border: '3px solid var(--color-wine)', padding: '10px 14px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '15px' }}>
              ▶ REPAIRING (2)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 2: 3 CAUSE-AND-EFFECT SWIMLANES
function Slide2Swimlanes({ data }) {
  return (
    <div className="deck-b-slide slide-bg-vanilla">
      {/* Top Section Header Ribbon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '54px', color: 'var(--color-wine)', margin: 0 }}>
          PROBLEMS & MEASURABLE OBJECTIVES
        </h2>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', background: 'var(--color-gold)', border: '3px solid var(--color-wine)', padding: '6px 16px' }}>
          TOWNSHIP OF TOMORROW CAUSE-AND-EFFECT
        </span>
      </div>

      {/* 3 Horizontal Swimlanes */}
      {data.pairs.map((pair) => (
        <div key={pair.num} className="deck-b-s2-swimlane">
          {/* Left Problem Zone */}
          <div className="deck-b-s2-problem-zone">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <span style={{ background: 'var(--color-cherry)', color: 'var(--color-vanilla)', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '20px', border: '2px solid var(--color-wine)' }}>
                {pair.num}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: 'var(--color-cherry)', margin: 0 }}>
                {pair.problemTitle}
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '23px', margin: 0, color: 'var(--color-wine)', lineHeight: 1.25 }}>
              {pair.problemDesc}
            </p>
          </div>

          {/* Center Stepped Conduit */}
          <div className="deck-b-s2-conduit-zone">
            <SlideIcon name={pair.icon} size={36} color="var(--color-wine)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginLeft: '8px' }}>▶</span>
          </div>

          {/* Right Objective Zone */}
          <div className="deck-b-s2-objective-zone">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ background: 'var(--color-gold)', color: 'var(--color-wine)', border: '2px solid var(--color-wine)', padding: '2px 8px', fontFamily: 'var(--font-heading)', fontSize: '15px' }}>
                OBJECTIVE {pair.num}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', color: 'var(--color-wine)', margin: 0, lineHeight: 1.2 }}>
              {pair.objective}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// SLIDE 3: DUAL PERSONA DOSSIERS
function Slide3Dossiers({ data }) {
  const [res, sdp] = data.personas;
  return (
    <div className="deck-b-slide slide-bg-sand">
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '64px', color: 'var(--color-wine)', margin: '0 0 8px 0' }}>
          {data.header}
        </h2>
        <div style={{ display: 'inline-flex', background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '4px' }}>
          <span style={{ padding: '6px 24px', background: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '18px', border: '2px solid var(--color-wine)' }}>RESIDENTS</span>
          <span style={{ padding: '6px 24px', background: 'var(--color-wine)', color: 'var(--color-vanilla)', fontFamily: 'var(--font-heading)', fontSize: '18px', border: '2px solid var(--color-wine)' }}>SIME DARBY PROPERTY</span>
        </div>
      </div>

      {/* Side-by-side Dossier Cards */}
      <div className="deck-b-s3-container">
        {/* Residents Dossier */}
        <div className="deck-b-s3-dossier">
          <div className="deck-b-s3-photo-window">
            <img src={res.photo} alt={res.title} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--color-wine)', color: 'var(--color-vanilla)', border: '2px solid var(--color-wine)', padding: '4px 14px', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
              {res.tag}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '12px' }}>
              <img src={res.icon} alt="Residents logo" style={{ height: '60px', width: 'auto' }} />
            </div>
          </div>
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '46px', color: 'var(--color-wine)', margin: '0 0 16px 0' }}>
              {res.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '28px', color: 'var(--color-wine)', margin: '0 0 24px 0', lineHeight: 1.35 }}>
              {res.desc}
            </p>
            <div style={{ background: 'var(--color-sand)', border: '2px solid var(--color-wine)', padding: '14px 20px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              PRIMARY VALUE: SPEEDY RESOLUTIONS & ACTIVE NEIGHBOURHOOD ENGAGEMENT
            </div>
          </div>
        </div>

        {/* SDP Dossier */}
        <div className="deck-b-s3-dossier">
          <div className="deck-b-s3-photo-window">
            <img src={sdp.photo} alt={sdp.title} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--color-gold)', color: 'var(--color-wine)', border: '2px solid var(--color-wine)', padding: '4px 14px', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
              {sdp.tag}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'var(--color-vanilla)', border: '3px solid var(--color-wine)', padding: '12px' }}>
              <img src={sdp.icon} alt="Sime Darby logo" style={{ height: '60px', width: 'auto' }} />
            </div>
          </div>
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '46px', color: 'var(--color-wine)', margin: '0 0 16px 0' }}>
              {sdp.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '28px', color: 'var(--color-wine)', margin: '0 0 24px 0', lineHeight: 1.35 }}>
              {sdp.desc}
            </p>
            <div style={{ background: 'var(--color-gold)', border: '2px solid var(--color-wine)', padding: '14px 20px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              OPERATIONAL VALUE: CENTRALIZED ASSET AUDIT & ACCELERATED SERVICE WORKFLOWS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 4: CONNECTED WORKFLOW PIPELINE
function Slide4Pipeline({ data }) {
  return (
    <div className="deck-b-slide slide-bg-vanilla">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '60px', color: 'var(--color-wine)', margin: '0 0 8px 0' }}>
          3-STEP CIVIC WORKFLOW PIPELINE
        </h2>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', background: 'var(--color-sand)', border: '2px solid var(--color-wine)', padding: '4px 16px' }}>
          CORE TOWNSHIP SERVICE ARCHITECTURE
        </span>
      </div>

      <div className="deck-b-s4-pipeline">
        {data.pillars.map((pillar, i) => (
          <div key={pillar.num} className="deck-b-s4-step-card">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ background: 'var(--color-gold)', border: '3px solid var(--color-wine)', padding: '6px 16px', fontFamily: 'var(--font-heading)', fontSize: '22px' }}>
                  STEP {pillar.num}
                </span>
                <SlideIcon name={pillar.icon} size={42} color="var(--color-wine)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', color: 'var(--color-wine)', margin: '0 0 20px 0', lineHeight: 1.1, whiteSpace: 'pre-line' }}>
                {pillar.title}
              </h3>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '26px', color: 'var(--color-wine)', margin: '0 0 24px 0', lineHeight: 1.35 }}>
                {pillar.summary}
              </p>
              <div style={{ background: 'var(--color-sand)', border: '2px solid var(--color-wine)', padding: '12px 16px', fontFamily: 'var(--font-heading)', fontSize: '16px', textAlign: 'center' }}>
                {i === 0 ? 'RESIDENT INTAKE' : i === 1 ? 'SDP DISPATCH & AUDIT' : 'COMMUNITY PARTICIPATION'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SLIDES 5, 6, 7: MOBILE SPLIT SHOWCASE (Shared Template with Dynamic Pillar Props)
function Slide5MobileSplit({ data }) {
  return <MobileShowcaseTemplate data={data} activeStep={1} />;
}

function Slide6MobileSplit({ data }) {
  return <MobileShowcaseTemplate data={data} activeStep={2} />;
}

function Slide7MobileSplit({ data }) {
  return <MobileShowcaseTemplate data={data} activeStep={3} />;
}

function MobileShowcaseTemplate({ data, activeStep }) {
  const steps = [
    { num: 1, label: '01 Report an Issue' },
    { num: 2, label: '02 Track Repair Progress' },
    { num: 3, label: '03 Discover & Join Activities' }
  ];

  return (
    <div className="deck-b-slide slide-bg-vanilla">
      {/* Top Persistent Tab Bar */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '4px solid var(--color-wine)', paddingBottom: '16px' }}>
        {steps.map(s => {
          const isActive = s.num === activeStep;
          return (
            <div
              key={s.num}
              style={{
                flex: 1,
                padding: '14px 20px',
                textAlign: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                border: '3px solid var(--color-wine)',
                backgroundColor: isActive ? 'var(--color-gold)' : 'var(--color-sand)',
                color: 'var(--color-wine)',
                boxShadow: isActive ? '6px 6px 0 var(--color-wine)' : 'none'
              }}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Main Split Body */}
      <div className="deck-b-showcase-container">
        {/* Left Side: Step-by-Step Context */}
        <div className="deck-b-showcase-left">
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-cherry)' }}>
              CORE WORKFLOW SPECIFICATION
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '76px', color: 'var(--color-wine)', margin: '8px 0 24px 0', lineHeight: 1.05, whiteSpace: 'pre-line' }}>
              {data.activeTitle}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {data.bullets.map((b, i) => (
              <div key={i} style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', boxShadow: '6px 6px 0 var(--color-wine)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ background: 'var(--color-gold)', color: 'var(--color-wine)', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '22px', border: '2px solid var(--color-wine)', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '26px', color: 'var(--color-wine)', lineHeight: 1.3, whiteSpace: 'pre-line' }}>
                  {b}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--color-gold)', border: '3px solid var(--color-wine)', padding: '14px 24px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
            ENGINEERED WITH REACT + PHASER 3.90.0 INTEGRATION
          </div>
        </div>

        {/* Right Side: Proportional Phone Frame with Live UI Mockup */}
        <div className="deck-b-showcase-right">
          <div className="deck-b-phone-frame">
            {/* Phone Top Header */}
            <div style={{ background: 'var(--color-wine)', color: 'var(--color-vanilla)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--color-wine)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px' }}>KoBi App</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', background: 'var(--color-gold)', color: 'var(--color-wine)', padding: '2px 8px' }}>Demo View</span>
            </div>

            {/* Phone Screen Body */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--color-vanilla)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-cherry)', marginBottom: '8px' }}>
                  {data.mockup.screenId}
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--color-wine)', margin: '0 0 16px 0' }}>
                  {data.mockup.screenName}
                </h4>

                {activeStep === 1 && (
                  <div style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', padding: '16px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '20px', marginBottom: '8px' }}>
                      <strong>Facility:</strong> {data.mockup.facility}
                    </div>
                    <div style={{ background: 'var(--color-vanilla)', border: '2px solid var(--color-wine)', padding: '10px', fontSize: '18px', fontFamily: 'var(--font-body)', color: 'var(--color-wine)', marginBottom: '12px' }}>
                      Photo preview attached (1.2 MB)
                    </div>
                    <div style={{ background: 'var(--color-gold)', border: '2px solid var(--color-wine)', textAlign: 'center', padding: '10px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
                      {data.mockup.actionLabel}
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {data.mockup.statuses.map((st, idx) => (
                        <div key={st} style={{ background: idx === 1 ? 'var(--color-gold)' : 'var(--color-vanilla)', border: '2px solid var(--color-wine)', padding: '8px 12px', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
                          {idx === 1 ? '▶ ' : '✓ '}{st}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--color-vanilla)', border: '2px solid var(--color-wine)', padding: '10px', fontFamily: 'var(--font-body)', fontSize: '18px' }}>
                      {data.mockup.workerAnimation}
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', padding: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {data.mockup.categories.map(c => (
                        <span key={c} style={{ background: c === 'Community' ? 'var(--color-cherry)' : 'var(--color-vanilla)', color: c === 'Community' ? 'var(--color-vanilla)' : 'var(--color-wine)', border: '2px solid var(--color-wine)', padding: '4px 8px', fontSize: '14px', fontFamily: 'var(--font-heading)' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <div style={{ background: 'var(--color-gold)', border: '3px solid var(--color-wine)', textAlign: 'center', padding: '12px', fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
                      {data.mockup.actionLabel}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav Simulation */}
              <div style={{ display: 'flex', borderTop: '3px solid var(--color-wine)', paddingTop: '12px', justifyContent: 'space-around' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px' }}>Map</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', color: 'var(--color-cherry)' }}>Reports</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px' }}>Activities</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px' }}>Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 8: PANORAMIC 2-ROW MATRIX
function Slide8PanoramicMatrix({ data }) {
  return (
    <div className="deck-b-slide slide-bg-vanilla">
      <div className="deck-b-s8-matrix">
        {/* Row 1: Differentiation (Wine Background) */}
        <div className="deck-b-s8-row slide-bg-wine">
          <div style={{ width: '360px', borderRight: '4px solid var(--color-gold)', paddingRight: '20px', display: 'flex', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--color-gold)', margin: 0, lineHeight: 1.1 }}>
              {data.leftHeader}
            </h3>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
            {data.differentiators.map((d, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--color-vanilla)', color: 'var(--color-wine)', border: '3px solid var(--color-wine)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SlideIcon name={d.icon} size={28} color="var(--color-cherry)" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0, color: 'var(--color-cherry)' }}>
                    {d.title}
                  </h4>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', margin: '8px 0 0 0', lineHeight: 1.25 }}>
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Impact (Sand Background) */}
        <div className="deck-b-s8-row slide-bg-sand">
          <div style={{ width: '360px', borderRight: '4px solid var(--color-wine)', paddingRight: '20px', display: 'flex', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', color: 'var(--color-wine)', margin: 0, lineHeight: 1.1 }}>
              {data.rightHeader}
            </h3>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
            {data.impacts.map((imp, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--color-vanilla)', color: 'var(--color-wine)', border: '3px solid var(--color-wine)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <SlideIcon name={imp.icon} size={28} color="var(--color-gold)" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: 0, color: 'var(--color-wine)' }}>
                    {imp.stakeholder}
                  </h4>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '20px', margin: '8px 0 0 0', lineHeight: 1.25 }}>
                  {imp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 9: SIDE-BY-SIDE SPEC SHEET & EVALUATION CLIPBOARD
function Slide9SpecClipboard({ data }) {
  return (
    <div className="deck-b-slide slide-bg-sand">
      <div className="deck-b-s9-container">
        {/* Left: MVP Spec Sheet */}
        <div className="deck-b-s9-panel" style={{ background: 'var(--color-vanilla)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '4px solid var(--color-wine)', paddingBottom: '16px', marginBottom: '24px' }}>
            <span style={{ background: 'var(--color-gold)', border: '2px solid var(--color-wine)', padding: '4px 12px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              SECTION 7
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', color: 'var(--color-wine)', margin: 0 }}>
              {data.topHeader}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'space-around' }}>
            {data.firstVersionFeatures.map((feat, i) => (
              <div key={i} style={{ background: 'var(--color-sand)', border: '3px solid var(--color-wine)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <SlideIcon name="check" size={28} color="var(--color-wine)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--color-wine)' }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: QA Evaluation Clipboard */}
        <div className="deck-b-s9-panel" style={{ background: 'var(--color-wine)', color: 'var(--color-vanilla)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '4px solid var(--color-gold)', paddingBottom: '16px', marginBottom: '24px' }}>
            <span style={{ background: 'var(--color-cherry)', color: 'var(--color-vanilla)', border: '2px solid var(--color-vanilla)', padding: '4px 12px', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              SECTION 8
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', color: 'var(--color-vanilla)', margin: 0 }}>
              {data.bottomHeader}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'space-around' }}>
            {data.successMetrics.map((q, i) => (
              <div key={i} style={{ background: 'var(--color-vanilla)', color: 'var(--color-wine)', border: '3px solid var(--color-wine)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: 'var(--color-cherry)', color: 'var(--color-vanilla)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '18px', flexShrink: 0 }}>
                  Q{i + 1}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '24px', lineHeight: 1.25 }}>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 10: MANIFESTO TICKET PLAQUE
function Slide10Manifesto({ data }) {
  return (
    <div className="deck-b-slide" style={{ padding: 0 }}>
      <div className="deck-b-s10-container">
        <img className="deck-b-s10-bg" src={data.assets.bg} alt="Township landscape" />

        <div className="deck-b-s10-plaque">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--color-wine)', paddingBottom: '20px', marginBottom: '32px' }}>
            <SlideTicketBadge surface="gold" style={{ fontSize: '32px', padding: '12px 36px' }}>
              {data.header}
            </SlideTicketBadge>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-cherry)' }}>
              TOWNSHIP OF TOMORROW CIVIC MANIFESTO
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '58px', color: 'var(--color-wine)', margin: '0 0 32px 0', lineHeight: 1.3 }}>
            "{data.manifesto}"
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '3px solid var(--color-wine)', paddingTop: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-wine)' }}>
              KoBi — Komuniti Bijak · Sime Darby Property Hackathon 2026
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <SlideIcon name="leaf" size={32} color="var(--color-cherry)" />
              <SlideIcon name="recycle" size={32} color="var(--color-gold)" />
              <SlideIcon name="location" size={32} color="var(--color-wine)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 11: CLOSING POSTCARD
function Slide11Postcard({ data }) {
  return (
    <div className="deck-b-slide slide-bg-sand">
      <div className="deck-b-s11-postcard">
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--color-wine)', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src={data.assets.badge} alt="KoBi Logo" style={{ width: '80px', height: '80px', border: '3px solid var(--color-wine)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', color: 'var(--color-wine)' }}>KoBi — Komuniti Bijak</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '20px', color: 'var(--color-wine)' }}>Universiti Tenaga Nasional (UNITEN) & Sime Darby Property</div>
            </div>
          </div>
          <SlideTicketBadge surface="cherry" style={{ fontSize: '20px', color: 'var(--color-vanilla)' }}>
            TOWNSHIP OF TOMORROW 2026
          </SlideTicketBadge>
        </div>

        {/* Center Hero Announcement */}
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '130px', color: 'var(--color-wine)', margin: '0 0 12px 0', textShadow: '6px 6px 0 var(--color-gold)' }}>
            {data.header}
          </h1>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', color: 'var(--color-cherry)', margin: 0 }}>
            {data.tagline}
          </p>
        </div>

        {/* Bottom Panoramic Window */}
        <div style={{ height: '340px', border: '4px solid var(--color-wine)', overflow: 'hidden', position: 'relative' }}>
          <img src={data.assets.bgRight} alt="Modern township development" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '16px', right: '20px', background: 'var(--color-vanilla)', border: '2px solid var(--color-wine)', padding: '6px 16px', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>
            READY FOR PILOT DEPLOYMENT
          </div>
        </div>
      </div>
    </div>
  );
}
