import Link from "next/link";
import type { Metadata } from "next";
import { officiatingMinisters, groomsmen, bridesmaids, ceremony } from "./programme";
import "./programme.css";

export const metadata: Metadata = {
  title: "Wedding Programme | Kaybee & Franca",
  description: "Order of ceremony and functionaries for the wedding of Kaybee and Franca.",
};

function People({ title, names }: { title: string; names: string[] }) {
  return <section className="programme__people">
    <h3>{title}</h3>
    <ul>{names.map((name) => <li key={name}>{name}</li>)}</ul>
  </section>;
}

export default function OrderOfServicePage() {
  return <main className="programme">
    <div className="programme__frame">
      <nav className="programme__nav"><Link href="/">← Back to our wedding</Link><span>K <i>&</i> F</span></nav>
      <header className="programme__hero">
        <div className="programme__ornament" aria-hidden="true">✳ &nbsp; ✦ &nbsp; ✳</div>
        <p className="programme__eyebrow">THE WEDDING OF</p>
        <h1>Kaybee <em>&</em> Franca</h1>
        <p className="programme__date">14 NOVEMBER 2026</p>
        <span className="programme__rule" aria-hidden="true" />
        <p className="programme__script">Order of Service</p>
        <p className="programme__intro">With love and gratitude, we welcome you to share in our special day.</p>
      </header>
      <div className="programme__body">
        <div className="programme__section-title"><span>01</span><h2>Functionaries</h2></div>
        <p className="programme__group-label">Bridal Party &amp; Wedding Functionaries</p>
        <People title="Officiating Ministers" names={officiatingMinisters} />
        <div className="programme__party">
          <div><h3>Best Man</h3><p>Ps Joseph Vanderpuije</p></div>
          <div><h3>Maid of Honour</h3><p>Racheal Naa Ayele Aryee</p></div>
        </div>
        <div className="programme__columns">
          <People title="Groomsmen" names={groomsmen} />
          <People title="Bridesmaids" names={bridesmaids} />
        </div>
        <div className="programme__party">
          <div><h3>Gift Table</h3><p>Deborah Kwaitoo</p></div>
          <div><h3>Protocol</h3><p>Juwaida Bukari</p></div>
        </div>
        <div className="programme__section-title programme__section-title--ceremony"><span>02</span><h2>Order of Ceremony</h2></div>
        <ol className="programme__ceremony">{ceremony.map((item, i) => <li key={i}><span className="programme__number">{String(i + 1).padStart(2, "0")}</span><span>{item}</span></li>)}</ol>
        <div className="programme__section-title programme__section-title--hymns"><span>03</span><h2>Wedding Hymns</h2></div>
        <section className="programme__hymn" aria-labelledby="hymn-showers">
          <p className="programme__hymn-kicker">HYMN ONE</p>
          <h3 id="hymn-showers">Showers of Blessing</h3>
          <p className="programme__hymn-verse">There shall be showers of blessing;<br />This is the promise of love;<br />There shall be seasons refreshing,<br />Sent from the Savior above.</p>
          <p className="programme__hymn-chorus-label">CHORUS</p>
          <p className="programme__hymn-verse">Showers of blessing,<br />Showers of blessing we need;<br />Mercy drops round us are falling,<br />But for the showers we plead.</p>
        </section>
        <section className="programme__hymn" aria-labelledby="hymn-faithfulness">
          <p className="programme__hymn-kicker">HYMN TWO</p>
          <h3 id="hymn-faithfulness">Great Is Thy Faithfulness</h3>
          <p className="programme__hymn-note">Congregational hymn</p>
        </section>
      </div>
      <footer className="programme__footer"><p>And so our forever begins…</p><span>Kaybee & Franca</span><Link href="/">RETURN TO WEDDING WEBSITE ↗</Link></footer>
    </div>
  </main>;
}
