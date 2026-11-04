import Quiz from "./components/Quiz";
import Reveal from "./components/Reveal";
import Countdown from "./components/Countdown";
import WeddingBingo from "./components/WeddingBingo";
import HeroAnimation from "./components/HeroAnimation";
import MomentsCarousel from "./components/MomentsCarousel";
import PhotoGallery from "./components/PhotoGallery";
import CoupleMemories from "./components/CoupleMemories";
import VenueDirections from "./components/VenueDirections";
import GiftDetails from "./components/GiftDetails";
import ScrollReveal from "./components/ScrollReveal";
import DecorativeVines, { InvitationFlorals } from "./components/DecorativeVines";
import { photos, wedding } from "./site-content";

type PhotoSlotProps = {
  src: string;
  label: string;
  className: string;
};

function PhotoSlot({ src, label, className }: PhotoSlotProps) {
  return (
    <div
      className={`photo-slot ${src ? "photo-slot--filled" : "photo-slot--empty"} ${className}`}
      role="img"
      aria-label={src ? label : `${label} photo placeholder`}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    />
  );
}

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <DecorativeVines />
      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <PhotoSlot src={photos.hero} label="Kaybee carrying Franca" className="hero__photo" />
          <HeroAnimation />
          <div className="hero__content">
            <p className="hero__eyebrow ">A WEDDING CELEBRATION</p>
            <h1 id="hero-heading" aria-label="Kaybee & Franca">
              <span className="hero__typewriter" aria-hidden="true">
                {Array.from("Kaybee & Franca").map((character, index) => (
                  <span
                    key={index}
                    className={`hero__letter${character === "&" ? " hero__letter--ampersand" : ""}`}
                  >
                    {character}
                  </span>
                ))}
              </span>
            </h1>
            <span className="hero__rule" aria-hidden="true" />
            <p className="hero__invitation">We cannot wait to celebrate with you.</p>
          </div>
          <span className="hero__scroll" aria-hidden="true">SCROLL TO EXPLORE <b>↓</b></span>
        </section>


        <section className="wedding-invitation" id="our-day" aria-labelledby="day-heading">
          <InvitationFlorals />
          <ScrollReveal className="wedding-invitation__card">
            <p className="wedding-invitation__eyebrow">A DAY FOR LOVE. A LIFETIME TOGETHER.</p>
            <h2 className="wedding-invitation__heading" id="day-heading">
              <span>The</span> WEDDING <span>of</span>
            </h2>
            <p className="wedding-invitation__names">Kaybee <span>&</span> Franca</p>
            <div className="wedding-invitation__date">
              <time dateTime={wedding.startsAt}>{wedding.dateDisplay}</time>
              <span className="wedding-invitation__time">{wedding.timeDisplay}</span>
            </div>
            <Countdown target={wedding.countdownTarget} />
            <div className="wedding-colours" aria-label="Wedding colour theme: Sunset in Bloom, pink, burgundy, orange and pale yellow">
              <span>Sunset in Bloom</span>
              <div className="wedding-colours__swatches" aria-hidden="true"><i /><i /><i /><i /></div>
            </div>
            <p className="wedding-invitation__closing">We saved you a place in our forever.</p>
            <a className="calendar-link" href="/kaybee-franca-wedding.ics" download>ADD TO CALENDAR <span aria-hidden="true">↗</span></a>
          </ScrollReveal>
        </section>

        <section className="moments" id="moments" aria-labelledby="moments-heading">
          <ScrollReveal className="moments__intro">
            <p className="section-kicker">A LITTLE LOOK AT US</p>
            <h2 id="moments-heading">Our kind of <em>forever</em></h2>
            <p>A few little moments, one big love. We can&apos;t wait to make more memories with you.</p>
          </ScrollReveal>
          <ScrollReveal><MomentsCarousel /></ScrollReveal>
          <ScrollReveal delay={0.12}><p className="moments__caption">the best is yet to come <span aria-hidden="true">♥</span></p></ScrollReveal>
        </section>

        <section className="photo-gallery" id="gallery" aria-labelledby="gallery-heading">
          <ScrollReveal className="photo-gallery__intro">
            <p className="section-kicker">THE PHOTO GALLERY</p>
            <h2 id="gallery-heading">Little pieces of <em>forever</em></h2>
            <p>Our favourite moments, gathered in one place.</p>
          </ScrollReveal>
          <ScrollReveal><PhotoGallery /></ScrollReveal>
        </section>

        <section className="colour-story" aria-labelledby="colour-heading">
          <ScrollReveal>
            <p className="section-kicker">A LITTLE INSPIRATION</p>
            <h2 id="colour-heading">Sunset in <em>Bloom</em></h2>
            <p>Think vibrant pink, rich burgundy, warm orange and soft yellow. Come ready to celebrate in colour.</p>
            <div className="colour-story__palette" aria-label="Pink, burgundy, orange and pale yellow">
              <span>Pink</span><span>Burgundy</span><span>Orange</span><span>Yellow</span>
            </div>
          </ScrollReveal>
        </section>

        <section className="info-band venue" id="venue" aria-labelledby="venue-heading" style={{ backgroundImage: `url("${photos.venue}")` }}>
          <ScrollReveal><Reveal className="info-band__copy venue__copy">
            <p className="section-kicker">WHERE WE&apos;LL GATHER</p>
            <h2 id="venue-heading">THE VENUE</h2>
            <p className="venue__name">{wedding.venueName}</p>
            <p className="venue__address">{wedding.venueDescription}</p>
            <VenueDirections />
          </Reveal></ScrollReveal>
        </section>

        <section className="info-band rsvp-band" id="rsvp" aria-labelledby="rsvp-heading">
          <div className="portrait-frame portrait-frame--rsvp">
            <PhotoSlot src={photos.rsvp} label="Kaybee and Franca portrait" className="portrait portrait--rsvp" />
          </div>
          <ScrollReveal><Reveal className="info-band__copy rsvp-band__copy">
            <p className="section-kicker">A GIFT OF LOVE</p>
            <h2 id="rsvp-heading">SHOW US SOME LOVE</h2>
            <p className="section-intro">Your presence is the greatest gift. If you wish to bless us, you can find our details below.</p>
            <GiftDetails />
            <div className="rsvp-contacts">
              <p>RSVP OR WEDDING-DAY QUESTIONS</p>
              <ul>
                {wedding.rsvpContacts.map(({ name, phone }) => (
                  <li key={phone}>
                    <span>{name}</span>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal></ScrollReveal>
        </section>

        <CoupleMemories />

        <section className="quiz-band" id="quiz" aria-labelledby="quiz-heading">
          <ScrollReveal><Reveal className="quiz-intro">
            <p className="section-kicker">A LITTLE GAME</p>
            <h2 id="quiz-heading">How well do you <em>know</em> the couple?</h2>
            <p>Ten quick questions, just for fun.</p>
          </Reveal></ScrollReveal>
          <ScrollReveal delay={0.12}><Reveal className="quiz-wrap" delay={80}>
            <Quiz />
          </Reveal></ScrollReveal>
        </section>

        <section className="bingo-band" id="bingo" aria-labelledby="bingo-heading">
          <ScrollReveal>
            <p className="section-kicker">LET THE GOOD TIMES BLOOM</p>
            <h2 id="bingo-heading">Wedding day <em>bingo</em></h2>
            <p>Little moments make the best memories. How many can you find?</p>
            <WeddingBingo />
          </ScrollReveal>
        </section>

        <section className="closing-photo" aria-label="Kaybee and Franca photo">
          <PhotoSlot src={photos.closing} label="Kaybee and Franca together" className="closing-photo__image" />
          <ScrollReveal className="closing-photo__caption"><p>See you at the celebration.</p></ScrollReveal>
        </section>
        <section className="wedding-verse" aria-label="Wedding scripture">
          <ScrollReveal>
            <p>“He hath made everything beautiful in his time...”</p>
            <span>ECCLESIASTES 3:11</span>
          </ScrollReveal>
        </section>
      </main>
      <footer className="site-footer">
        <span>Kaybee <i>&</i> Franca</span>
        <a href="#top" aria-label="Back to top">↑</a>
      </footer>
    </div>
  );
}
