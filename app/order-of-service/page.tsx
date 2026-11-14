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
    <details className="programme__side-menu">
      <summary aria-label="Toggle programme navigation"><span aria-hidden="true">☰</span><span>MENU</span></summary>
      <nav className="programme__side-nav" aria-label="Quick programme navigation">
        <a href="#functionaries"><span className="programme__side-number">01</span><span>Functionaries</span></a>
        <a href="#ceremony"><span className="programme__side-number">02</span><span>Ceremony</span></a>
        <a href="#hymns"><span className="programme__side-number">03</span><span>Hymns</span></a>
        <a href="#photography"><span className="programme__side-number">04</span><span>Photography</span></a>
      </nav>
    </details>
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
          <a href="#photography"><span>04</span> Order of Photography <span aria-hidden="true">↗</span></a>
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
              <p className="programme__hymn-chorus-label">VERSE 1</p><p className="programme__hymn-verse">Great is thy faithfulness, O God, my Father;<br />There is no shadow of turning with thee.<br />Thou changest not, thy compassions, they fail not;<br />As thou hast been, thou forever wilt be.</p><p className="programme__hymn-chorus-label">REFRAIN</p><p className="programme__hymn-verse">Great is thy faithfulness,<br />Great is thy faithfulness,<br />Morning by morning new mercies I see.<br />All I have needed thy hand hast provided;<br />Great is thy faithfulness,<br />Lord unto me.</p><p className="programme__hymn-chorus-label">VERSE 2</p><p className="programme__hymn-verse">Summer and winter and springtime and harvest,<br />Sun, moon, and stars in their courses above<br />Join with all nature in manifold witness<br />To thy great faithfulness, mercy, and love.</p><p className="programme__hymn-chorus-label">REFRAIN</p><p className="programme__hymn-verse">Great is thy faithfulness,<br />Great is thy faithfulness,<br />Morning by morning new mercies I see.<br />All I have needed thy hand hast provided;<br />Great is thy faithfulness,<br />Lord unto me.</p><p className="programme__hymn-chorus-label">VERSE 3</p><p className="programme__hymn-verse">Pardon for sin and a peace that endureth,<br />Thine own dear presence to cheer and to guide;<br />Strength for today and bright hope for tomorrow,<br />Blessings all mine and ten thousand beside.</p><p className="programme__hymn-chorus-label">REFRAIN</p><p className="programme__hymn-verse">Great is thy faithfulness,<br />Great is thy faithfulness,<br />Morning by morning new mercies I see.<br />All I have needed thy hand hast provided;<br />Great is thy faithfulness,<br />Lord unto me.</p>
            </section>}
          </li>)}
        </ol>
        <section id="photography" className="programme__photography" aria-labelledby="photography-heading">
          <div className="programme__section-title"><span>04</span><h2 id="photography-heading">Order of Photography</h2></div>
          <p className="programme__photography-intro">A little moment with everyone who made our day special.</p>
          <details className="programme__photography-details">
            <summary><span>View photography sequence</span><span className="programme__photography-chevron" aria-hidden="true">⌄</span></summary>
            <p className="programme__photography-lead">Couple with</p>
            <ol className="programme__photography-list"><li><span>01</span><span>Officiating Ministers</span></li>
<li><span>02</span><span>All Pastors</span></li>
<li><span>03</span><span>Best Man</span></li>
<li><span>04</span><span>Maid of Honour</span></li>
<li><span>05</span><span>Groomsmen</span></li>
<li><span>06</span><span>Bridesmaids</span></li>
<li><span>07</span><span>Groom's parents</span></li>
<li><span>08</span><span>Bride's parents</span></li>
<li><span>09</span><span>Groom's family</span></li>
<li><span>10</span><span>Bride's family</span></li>
<li><span>11</span><span>Both families</span></li>
<li><span>12</span><span>Couple with both parents</span></li>
<li><span>13</span><span>API Pastors</span></li>
<li><span>14</span><span>Fountain of life pastors</span></li>
<li><span>15</span><span>Fountain of life family</span></li>
<li><span>16</span><span>Basillisa staff</span></li>
<li><span>17</span><span>Choir</span></li>
<li><span>18</span><span>CPS</span></li>
<li><span>19</span><span>Prempeh alumni</span></li>
<li><span>20</span><span>Kumasi girls alumni</span></li>
<li><span>21</span><span>KNUST alumni</span></li>
<li><span>22</span><span>KSTU alumni</span></li>
<li><span>23</span><span>Friends</span></li>
<li><span>24</span><span>Ready at 20</span></li>
<li><span>25</span><span>All friends in wedding colours</span></li></ol>
          </details>
        </section>
      </div>
      <footer className="programme__footer"><p>And so our forever begins…</p><span>Kaybee & Franca</span><Link href="/">RETURN TO WEDDING WEBSITE ↗</Link></footer>
    </div>
  </main>;
}
