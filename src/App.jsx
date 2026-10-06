import React, { useRef, useState } from "react";

const missYouWebsiteUrl = "https://example.com";

const photos = [
  {
    caption: "That sunset... ♡",
    category: "special",
    filename: "memory-01.jpg",
    image: "/assets/memories/memory-01.jpg",
    fallback: imageUrl("photo-1516589178581-6cd7833ae3b2"),
    alt: "A couple together in warm evening light",
    className: "memory-01",
  },
  {
    caption: "Forever & always ♡",
    category: "us",
    filename: "memory-02.jpg",
    image: "/assets/memories/memory-02.jpg",
    fallback: imageUrl("photo-1518199266791-5375a83190b7"),
    alt: "Two hands held together",
    className: "memory-02",
  },
  {
    caption: "Our little world ♡",
    category: "random",
    filename: "memory-03.jpg",
    image: "/assets/memories/memory-03.jpg",
    fallback: imageUrl("photo-1500375592092-40eb2168fd21"),
    alt: "A quiet blue sea beneath an open sky",
    className: "memory-03",
  },
  {
    caption: "No plans, just us",
    category: "random",
    filename: "memory-04.jpg",
    image: "/assets/memories/memory-04.jpg",
    fallback: imageUrl("photo-1522673607200-164d1b6ce486"),
    alt: "A couple walking together",
    className: "memory-04",
  },
  {
    caption: "Late night talks ♡",
    category: "special",
    filename: "memory-05.jpg",
    image: "/assets/memories/memory-05.jpg",
    fallback: imageUrl("photo-1495474472287-4d71bcdd2085"),
    alt: "Coffee and a slow morning together",
    className: "memory-05",
  },
  {
    caption: "For no reason at all",
    category: "us",
    filename: "memory-06.jpg",
    image: "/assets/memories/memory-06.jpg",
    fallback: imageUrl("photo-1490750967868-88aa4486c946"),
    alt: "Soft flowers in afternoon light",
    className: "memory-06",
  },
  ...Array.from({ length: 3 }, (_, index) => {
    const number = index + 7;
    const filename = `memory-${String(number).padStart(2, "0")}.jpg`;
    return {
      caption: `A little memory #${String(number).padStart(2, "0")}`,
      category: ["special", "random", "us"][index % 3],
      filename,
      image: `/assets/memories/${filename}`,
      alt: `Photo memory ${number}`,
      className: `memory-${String(number).padStart(2, "0")}`,
    };
  }),
];

const momentCards = [
  ["⌣", "Your Smile", "நீ சிரிக்கும்போது\nஉலகமே கொஞ்சம் அழகாகிறது...", "It’s my favourite part of the day."],
  ["〰", "Your Voice", "உன் குரல் கேட்டாலே\nமனம் அமைதியாகிறது.", "My favourite notification."],
  ["♡", "Your Little Habits", "நீ செய்யும் சின்னச் சின்ன\nவிஷயங்கள் எல்லாம்...", "The little things you don’t even realize you do."],
  ["✿", "The Way You Care", "என்னை நினைக்கும்\nஉன் மனசு...", "You always think about others."],
  ["◉", "Your Eyes", "இரு விழிகளினுள் தொலைந்த\nது என் இதயம் ❤️", "They say everything without words."],
  ["✧", "Just You", "நீயாக இருப்பதே\nஎனக்குப் பிடித்தது.", "Because you are you, and that’s enough."],
];

const timelineEvents = [
  {
    date: "12 JAN 2024",
    title: "♡ First Chat",
    description: <>A simple hello<br />changed everything.</>,
    icon: "✉",
    side: "left",
  },
  {
    date: "15 JAN 2024",
    title: "♡ First Call",
    description: <>Your voice became<br />my favourite sound.</>,
    icon: "♫",
    side: "right",
  },
  {
    date: "10 MAR 2024",
    title: "♡ First Meet",
    description: <>Finally meeting the person<br />behind all those messages.</>,
    icon: "⌖",
    side: "left",
    photo: true,
  },
  {
    date: "ALL THE LITTLE DAYS",
    title: "♡ Special Moments",
    description: <>Little memories, laughs,<br />fights, and everything between.</>,
    icon: "✧",
    side: "right",
  },
  {
    date: "TODAY",
    title: "♡ Us",
    description: <>Same story.<br />New memories.<br />Still us.</>,
    icon: "∞",
    side: "left",
  },
];

const memoryLines = [
  <>Just a reminder...<br />you make everything better.</>,
  <>Somehow, ordinary days<br />feel golden with you.</>,
  <>My favourite place<br />will always be beside you.</>,
  <>A small moment with you<br />is a big memory to me.</>,
];

function imageUrl(id, width = 760) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

function MemoryImage({ photo }) {
  const [source, setSource] = useState(photo.image);
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className="memory-placeholder" role="img" aria-label={`Add ${photo.filename} to show this photo`}>
        <span aria-hidden="true">♡</span>
        <small>Save photo as<br /><strong>{photo.filename}</strong></small>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={photo.alt}
      loading="lazy"
      onError={() => {
        if (photo.fallback && source !== photo.fallback) setSource(photo.fallback);
        else setMissing(true);
      }}
    />
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home", "Memories", "Poems", "Moments", "Timeline"];

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="You and me, home">
        You <span>&amp;</span> Me <i>♡</i>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span /><span />
      </button>
      <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
        ))}
        <a className="nav-heart" href="#timeline" aria-label="Our story" onClick={() => setMenuOpen(false)}>♡</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-photo" role="img" aria-label="A couple watching the last light of a sunset" />
      <div className="hero-shade" />
      <div className="hero-stars" aria-hidden="true">·　✦　　　·　　　　✧　　·</div>
      <div className="hero-copy">
        <p className="eyebrow light-eyebrow">a little world, just for us</p>
        <h1 id="hero-title">Happy Birthday My Kulliki... <span>❤️</span></h1>
        <p className="tamil hero-tamil" lang="ta">உன்னோடு இருக்கும் ஒவ்வொரு நொடியும்<br />ஒரு அழகான கதை...</p>
        <p className="hero-intro">Not just a love story,<br />but a little world that belongs to us.</p>
        <a className="button button-light" href="#memories">Explore Our World <span aria-hidden="true">→</span></a>
      </div>
      <div className="hero-note handwritten">same sky<br />different days<br />same us <span>♡</span></div>
      <a className="scroll-cue" href="#memories"><span />scroll a little</a>
      <div className="hero-caption">somewhere between then &amp; always</div>
    </section>
  );
}

function Memories() {
  const [filter, setFilter] = useState("all");
  const categories = [
    ["all", "♡", "All"],
    ["special", "✧", "Special Days"],
    ["random", "☼", "Random Moments"],
    ["us", "♡", "Us"],
  ];

  return (
    <section className="memories paper-section" id="memories" aria-labelledby="memories-title">
      <div className="section-shell">
        <div className="section-heading memories-heading">
          <div>
            <p className="eyebrow">collected, not curated</p>
            <h2 id="memories-title">Our Memories <span>♡</span></h2>
            <p className="section-intro">Some moments are not just photos.<br />They are pieces of my heart.</p>
          </div>
          <p className="margin-note handwritten">little things<br />I want to keep <span>↙</span></p>
        </div>
        <article className="scrapbook-feature" aria-labelledby="scrapbook-title">
          <div className="scrapbook-copy">
            <p className="eyebrow">a page from our story</p>
            <h3 id="scrapbook-title">A Scrapbook of Us <span>♡</span></h3>
            <p>All the little places, people, and moments that make our story ours.</p>
          </div>
          <img
            className="scrapbook-image"
            src="/assets/scrapbook-cover.jpg"
            alt="A pink scrapbook collage of couple photographs, handwritten love notes, and shared memories"
            loading="lazy"
          />
        </article>
        <div className="memory-layout">
          <div className="memory-filters" role="group" aria-label="Filter memories">
            {categories.map(([value, icon, label]) => (
              <button
                className={`filter-chip${filter === value ? " is-active" : ""}`}
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {icon} <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="polaroid-field">
            {photos.map((photo, index) => (
              <figure
                className={`polaroid ${photo.className}${filter !== "all" && filter !== photo.category ? " is-hidden" : ""}`}
                key={photo.className}
              >
                {index % 3 !== 1 && <span className={`tape tape-${index}`} />}
                <MemoryImage photo={photo} />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
            <span className="field-scribble handwritten">collect moments,<br />not things <span>♡</span></span>
            <span className="flower-doodle flower-one" aria-hidden="true">✿</span>
            <span className="flower-doodle flower-two" aria-hidden="true">✿</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Moments() {
  return (
    <section className="moments night-section" id="moments" aria-labelledby="moments-title">
      <div className="moon" aria-hidden="true" />
      <div className="night-shell">
        <div className="section-heading night-heading">
          <div>
            <p className="eyebrow light-eyebrow">the little things</p>
            <h2 id="moments-title">Our Little Moments <span>♡</span></h2>
            <p className="section-intro">The small things you do...<br />that make my world so big.</p>
          </div>
          <p className="handwritten night-note" lang="ta">நீ இருக்கும்போது<br />எல்லாமே அழகாகிறது...</p>
        </div>
        <div className="moment-grid">
          {momentCards.map(([icon, title, tamil, description]) => (
            <article className="moment-card" key={title}>
              <span className="moment-icon" aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p className="tamil" lang="ta">{tamil}</p>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="night-horizon" aria-hidden="true"><span>✦</span><span>·</span><span>✧</span><span>·</span><span>✦</span></div>
      </div>
    </section>
  );
}

function Poems() {
  return (
    <section className="poems paper-section" id="poems" aria-labelledby="poems-title">
      <div className="section-shell">
        <div className="section-heading poems-heading">
          <div>
            <p className="eyebrow">little notes from my heart</p>
            <h2 id="poems-title">Poems <span>♡</span></h2>
            <p className="section-intro">Some words are easier to write than to say.</p>
          </div>
          <span className="poem-stem" aria-hidden="true">✿</span>
        </div>
        <div className="poem-desk">
          <article className="poem-note poem-note-main">
            <span className="tape tape-cream" />
            <p className="poem-mark">“</p>
            <p className="tamil poem-tamil" lang="ta">நீ அருகில் இருந்தால்<br />வார்த்தைகள் தேவையில்லை...<br />அமைதிக்குக் கூட<br />ஒரு அர்த்தம் கிடைக்கிறது. 🩷</p>
            <p className="poem-sign handwritten">— உனக்காக</p>
            <span className="pressed-flower" aria-hidden="true">✿</span>
          </article>
          <article className="poem-note poem-note-small note-blush">
            <p className="tamil poem-tamil" lang="ta">உன் சிரிப்பில்<br />என் நாளின் வெளிச்சம். 🩷</p>
            <p className="poem-sign handwritten">— Me ♡</p>
          </article>
          <article className="poem-note poem-note-small note-lilac">
            <p className="tamil poem-tamil" lang="ta">தூரம் இருந்தாலும்<br />நினைவில் நீ அருகில். 💜</p>
            <p className="poem-sign handwritten">— always</p>
            <span className="mini-flower" aria-hidden="true">✿</span>
          </article>
          <p className="poem-side handwritten">same feelings<br />new words<br />always you <span>♡</span></p>
          <span className="petal petal-one" aria-hidden="true">✿</span>
          <span className="petal petal-two" aria-hidden="true">✧</span>
        </div>
      </div>
    </section>
  );
}

function SongCard() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("A place for the song that feels like us.");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        setPlaying(false);
        setStatus("Could not play the song. Please check the audio file.");
        console.error("Could not play the song:", error);
      }
    } else {
      audio.pause();
    }
  }

  return (
    <article className="discovery-card song-card">
      <div className="discovery-top"><h2>Our Song <span>♡</span></h2><span className="music-note">♫</span></div>
      <div className="song-details">
        <div className="song-art" role="img" aria-label="Sunset over the sea" />
        <div><p className="song-title">Innum Konjam Naeram</p><p className="song-subtitle">Maryan · A.R. Rahman</p></div>
      </div>
      <div className="song-controls">
        <button className="play-button" type="button" aria-label={playing ? "Pause our song" : "Play our song"} aria-pressed={playing} onClick={togglePlayback}>{playing ? "Ⅱ" : "▶"}</button>
        <div className="song-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <span className="song-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      <p className="song-status" aria-live="polite">{status}</p>
      <audio
        ref={audioRef}
        src="/assets/our-song.mp3"
        preload="metadata"
        onPlay={() => {
          setPlaying(true);
          setStatus("Playing the full song ♡");
        }}
        onPause={() => {
          setPlaying(false);
          if (!audioRef.current?.ended) setStatus("Song paused.");
        }}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          if (Number.isFinite(audio.duration)) setDuration(audio.duration);
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setCurrentTime(audio.currentTime);
          if (Number.isFinite(audio.duration) && audio.duration > 0) setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime(0);
          setStatus("The full song has finished ♡");
        }}
        onError={(event) => {
          setPlaying(false);
          setStatus("Could not load the song. Please check the audio file.");
          console.error("Could not load the song:", event.currentTarget.error);
        }}
      />
    </article>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function Discoveries() {
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [secretOpen, setSecretOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  function showAnotherMemory() {
    setMemoryIndex((index) => (index + 1) % memoryLines.length);
  }

  return (
    <section className="discoveries paper-section" aria-label="Little discoveries">
      <div className="section-shell">
        <div className="discovery-grid">
          <SongCard />
          <article className="discovery-card random-card">
            <h2>Random Memory <span>♡</span></h2>
            <div className="random-photo" role="img" aria-label="A couple sharing a sunset" />
            <p className="handwritten random-caption" aria-live="polite">{memoryLines[memoryIndex]}</p>
            <button className="text-button" type="button" onClick={showAnotherMemory}>Show another <span>↗</span></button>
            <div className="random-doodle handwritten" aria-hidden="true"><span>✧</span> little moments, kept forever <span>♡</span></div>
          </article>
          <article className={`discovery-card secret-card${secretOpen ? " is-open" : ""}`}>
            <div className="secret-heading"><span aria-hidden="true">◎</span><h2>Secret Button</h2></div>
            <p className="handwritten">Don’t click this... <span>↘</span></p>
            <button className="secret-button" type="button" onClick={() => setSecretOpen(true)}>I knew you would <span>♡</span></button>
            <p className="secret-message" aria-live="polite">If I had to choose again, I’d still choose you. <span>♡</span></p>
            <div className="secret-doodle handwritten" aria-hidden="true"><span>♡</span> a little secret, kept with love <span>♡</span></div>
          </article>
          <article className="discovery-card miss-card">
            <span className="envelope" aria-hidden="true">✉</span><span className="miss-title">Open When You Miss Me</span><span className="miss-heart">♡</span>
            <span className="miss-art" aria-hidden="true">♡<span>♡</span></span>
            <p className="miss-card-note handwritten">For the days you wish I were a little closer.</p>
            <div className="miss-card-actions">
              <a className="miss-website-link" href={missYouWebsiteUrl} target="_blank" rel="noopener noreferrer">Visit our special page <span aria-hidden="true">↗</span></a>
              <button className="miss-letter-button" type="button" onClick={() => setLetterOpen(true)}>Read your little letter <span aria-hidden="true">♡</span></button>
            </div>
            <span className="miss-hint handwritten">a little note, just for you</span>
          </article>
        </div>
      </div>
      {letterOpen && (
        <div className="letter-backdrop" role="presentation" onClick={() => setLetterOpen(false)}>
          <section className="letter-dialog" role="dialog" aria-modal="true" aria-labelledby="letter-title" onClick={(event) => event.stopPropagation()}>
            <button className="letter-close" type="button" aria-label="Close letter" onClick={() => setLetterOpen(false)}>×</button>
            <div className="letter-paper">
              <p className="eyebrow">just in case you need to hear it</p>
              <h2 id="letter-title" className="handwritten">Hey, you ♡</h2>
              <p className="tamil" lang="ta">நீ எப்போதும் என் மனதிற்கு<br />மிகவும் நெருக்கமானவள்.</p>
              <p>No matter how far apart we are, you are always right here with me. Take a breath, smile a little, and remember: you are loved. Always.</p>
              <p className="handwritten letter-sign">Yours, always ♡</p>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function Timeline() {
  return (
    <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
      <div className="timeline-top">
        <div className="section-shell">
          <div className="section-heading timeline-heading">
            <div>
              <p className="eyebrow">from strangers to forever</p>
              <h2 id="timeline-title">Our Timeline <span>♡</span></h2>
              <p className="section-intro">From strangers to forever...<br />what a beautiful journey it has been.</p>
            </div>
            <p className="handwritten timeline-aside">and every little<br />thing in between <span>♡</span></p>
          </div>
        </div>
      </div>
      <div className="timeline-body">
        <div className="timeline-rail" aria-hidden="true" />
        <div className="timeline-start" aria-hidden="true">♡</div>
        <div className="timeline-list">
          {timelineEvents.map((event) => (
            <article className={`timeline-event event-${event.side}`} key={event.date}>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="event-card">
                <p className="event-date">{event.date}</p>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span className="event-icon" aria-hidden="true">{event.icon}</span>
                {event.photo && (
                  <div className="event-polaroid">
                    <img src={imageUrl("photo-1516589178581-6cd7833ae3b2", 480)} alt="A couple meeting in the evening" loading="lazy" />
                    <span>the day we met ♡</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="timeline-end" aria-hidden="true">∞</div>
        <div className="timeline-finale">
          <p className="handwritten finale-title">To Be Continued... <span>♡</span></p>
          <p className="tamil finale-tamil" lang="ta">இன்னும் நிறைய நினைவுகள் இருக்கிறது...</p>
          <span className="finale-sprig" aria-hidden="true">✿</span>
        </div>
      </div>
      <footer className="site-footer"><a href="#home">You <span>&amp;</span> Me ♡</a><p>made of little moments, kept forever</p></footer>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Memories />
        <Moments />
        <Poems />
        <Discoveries />
        <Timeline />
      </main>
    </>
  );
}
