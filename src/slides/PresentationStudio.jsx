import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES_DATA, SLIDE_METADATA } from './slideData';
import { DeckAOriginal } from './DeckAOriginal';
import { DeckBReimagined } from './DeckBReimagined';
import './PresentationStudio.css';

export function PresentationStudio({ initialDeck = 'deck-a', initialSlide = 0, onExit }) {
  const isExportMode = typeof window !== 'undefined' && new URLSearchParams(window.location.hash.split('?')[1] || '').get('export') === 'true';
  const [deckMode, setDeckMode] = useState(initialDeck); // 'deck-a' | 'deck-b' | 'compare'
  const [slideIndex, setSlideIndex] = useState(initialSlide);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA[slideIndex];

  // Navigation handlers
  const nextSlide = useCallback(() => setSlideIndex(prev => Math.min(prev + 1, totalSlides - 1)), [totalSlides]);
  const prevSlide = useCallback(() => setSlideIndex(prev => Math.max(prev - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes(prev => !prev);
      } else if (e.key === '1') {
        setDeckMode('deck-a');
      } else if (e.key === '2') {
        setDeckMode('deck-b');
      } else if (e.key === '3') {
        setDeckMode('compare');
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  if (isExportMode) {
    return (
      <div style={{ width: '1920px', height: '1080px', overflow: 'hidden', position: 'relative' }}>
        {deckMode === 'deck-b' ? <DeckBReimagined slideIndex={slideIndex} /> : <DeckAOriginal slideIndex={slideIndex} />}
      </div>
    );
  }

  return (
    <div className="studio-container">
      {/* Top Controls Bar */}
      <div className="studio-topbar">
        <div className="studio-controls-left">
          {onExit && (
            <button className="studio-mode-btn" onClick={onExit} style={{ background: 'var(--color-cherry)', color: 'var(--color-vanilla)' }}>
              ◀ EXIT STUDIO
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`studio-mode-btn ${deckMode === 'deck-a' ? 'active' : ''}`}
              onClick={() => setDeckMode('deck-a')}
            >
              DECK A (ORIGINAL OVERHAUL)
            </button>
            <button
              className={`studio-mode-btn ${deckMode === 'deck-b' ? 'active' : ''}`}
              onClick={() => setDeckMode('deck-b')}
            >
              DECK B (REIMAGINED COMPOSITION)
            </button>
            <button
              className={`studio-mode-btn ${deckMode === 'compare' ? 'active' : ''}`}
              onClick={() => setDeckMode('compare')}
            >
              COMPARE (SIDE-BY-SIDE)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '16px', color: 'var(--color-gold)' }}>
            SLIDE {slideIndex + 1} / {totalSlides} · {currentSlide.sdpSection}
          </span>
          <button
            className={`studio-mode-btn ${showNotes ? 'active' : ''}`}
            onClick={() => setShowNotes(prev => !prev)}
          >
            {showNotes ? 'HIDE NOTES' : 'SPEAKER NOTES (N)'}
          </button>
          <button className="studio-mode-btn" onClick={toggleFullscreen}>
            {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN (F)'}
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="studio-main-stage">
        {deckMode === 'deck-a' && <DeckAOriginal slideIndex={slideIndex} />}
        {deckMode === 'deck-b' && <DeckBReimagined slideIndex={slideIndex} />}

        {deckMode === 'compare' && (
          <div className="studio-compare-grid">
            <div className="studio-compare-pane">
              <div className="studio-compare-header">
                <span>PLAN 1: DECK A (ORIGINAL COMPOSITION OVERHAUL)</span>
                <span>SLIDE {slideIndex + 1}</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <DeckAOriginal slideIndex={slideIndex} />
              </div>
            </div>

            <div className="studio-compare-pane">
              <div className="studio-compare-header">
                <span>PLAN 2: DECK B (REIMAGINED CIVIC COMPOSITION)</span>
                <span>SLIDE {slideIndex + 1}</span>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <DeckBReimagined slideIndex={slideIndex} />
              </div>
            </div>
          </div>
        )}

        {/* Speaker Notes Drawer */}
        {showNotes && (
          <div className="studio-notes-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-wine)', paddingBottom: '8px', marginBottom: '12px' }}>
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '18px' }}>SPEAKER NOTES (SLIDE {slideIndex + 1})</strong>
              <button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            {currentSlide.notes ? (
              <div style={{ whiteSpace: 'pre-line' }}>{currentSlide.notes}</div>
            ) : (
              <div>
                <strong>Section:</strong> {currentSlide.sdpSection}<br /><br />
                <em>Key Talking Points:</em> Highlight alignment with Sime Darby Property's Township of Tomorrow priorities (People & Planet), resident empowerment through 2D map interaction, transparent tracking with the pixel worker, and community event engagement.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Bar & Navigation */}
      <div className="studio-bottombar">
        <button
          className="studio-mode-btn"
          onClick={prevSlide}
          disabled={slideIndex === 0}
          style={{ opacity: slideIndex === 0 ? 0.5 : 1 }}
        >
          ◀ PREVIOUS
        </button>

        <div className="studio-nav-thumbs">
          {SLIDES_DATA.map((s, i) => (
            <button
              key={s.id}
              className={`studio-thumb-btn ${i === slideIndex ? 'active' : ''}`}
              onClick={() => setSlideIndex(i)}
              title={`Slide ${i + 1}: ${s.sdpSection}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="studio-mode-btn"
          onClick={nextSlide}
          disabled={slideIndex === totalSlides - 1}
          style={{ opacity: slideIndex === totalSlides - 1 ? 0.5 : 1 }}
        >
          NEXT ▶
        </button>
      </div>
    </div>
  );
}
