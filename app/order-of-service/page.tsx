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
      <nav className="programme__contents" aria-label="Wedding programme contents">
        <p className="programme__contents-eyebrow">FIND YOUR WAY</p>
        <h2>Programme Menu</h2>
        <div className="programme__contents-links">
          <a href="#functionaries"><span>01</span> Functionaries <span aria-hidden="true">↗</span></a>
          <a href="#ceremony"><span>02</span> Order of Ceremony <span aria-hidden="true">↗</span></a>
          <a href="#hymns"><span>03</span> Hymns (within ceremony) <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
      <div className="programme__body">
        <div id="functionaries" className="programme__section-title"><span>01</span><h2>Functionaries</h2></div>
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
        <div id="ceremony" className="programme__section-title programme__section-title--ceremony"><span>02</span><h2>Order of Ceremony</h2></div>
        <ol className="programme__ceremony">
          {ceremony.map((item, i) => <li key={i} className="programme__ceremony-entry">
            <div className="programme__ceremony-item"><span className="programme__number">{String(i + 1).padStart(2, "0")}</span><span>{item}</span></div>
            {i === 6 && <section id="hymns" className="programme__hymn programme__hymn--inline" aria-labelledby="hymn-showers">
              <p className="programme__hymn-kicker">HYMN ONE · SING ALONG</p>
              <h3 id="hymn-showers">Showers of Blessing</h3>
              {[
                ["There shall be showers of blessing;", "This is the promise of love;", "There shall be seasons refreshing,", "Sent from the Savior above."],
                ["There shall be showers of blessing,", "Precious reviving again;", "Over the hills and the valleys,", "Sound of abundance of rain."],
              ].map((lines, index) => <div className="programme__stanza" key={index}>
                <p className="programme__hymn-chorus-label">VERSE {index + 1}</p>
                <p className="programme__hymn-verse">{lines.map((line, j) => <span key={j}>{line}<br /></span>)}</p>
                <p className="programme__hymn-chorus-label">CHORUS</p>
                <p className="programme__hymn-verse">Showers of blessing,<br />Showers of blessing we need;<br />Mercy drops round us are falling,<br />But for the showers we plead.</p>
              </div>)}
            </section>}
            {i === 12 && <section id="hymn-faithfulness" className="programme__hymn programme__hymn--inline" aria-labelledby="hymn-faithfulness-title">
              <p className="programme__hymn-kicker">HYMN TWO · SING ALONG</p>
              <h3 id="hymn-faithfulness-title">Great Is Thy Faithfulness</h3>
              <p className="programme__hymn-note">Great is thy faithfulness, O God, my Father;<br />There is no shadow of turning with thee.<br />Thou changest not, thy compassions, they fail not;<br />As thou hast been, thou forever wilt be.</p><p className="programme__hymn-chorus-label">REFRAIN</p><p className="programme__hymn-verse">Great is thy faithfulness,<br />Great is thy faithfulness,<br />Morning by morning new mercies I see.<br />All I have needed thy hand hast provided;<br />Great is thy faithfulness,<br />Lord unto me.</p><p className="programme__hymn-chorus-label">VERSE 2</p><p className="programme__hymn-verse">Summer and winter and springtime and harvest,<br />Sun, moon, and stars in their courses above<br />Join with all nature in manifold witness<br />To thy great faithfulness, mercy, and love.</p>
            </section>}
          </li>)}
        </ol>
      </div>
      <footer className="programme__footer"><p>And so our forever begins…</p><span>Kaybee & Franca</span><Link href="/">RETURN TO WEDDING WEBSITE ↗</Link></footer>
    </div>
  </main>;
}
