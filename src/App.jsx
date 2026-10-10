import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const missYouWebsiteUrl = "https://ah-world.vercel.app/";
const surpriseRevealAt = new Date("2026-10-12T00:00:00+05:30").getTime();

function getSecondsUntilReveal() {
  return Math.max(0, Math.ceil((surpriseRevealAt - Date.now()) / 1000));
}

const numberedPhotos = Array.from({ length: 9 }, (_, index) => {
  const number = index + 1;
  const filename = `memories-${number}.jpg`;
  return {
    id: `memory-${number}`,
    number,
    category: ["special", "us", "random", "random", "special", "us", "special", "random", "us"][index],
    filename,
    image: `/assets/memories/${filename}`,
    alt: `Memory photo ${number}`,
    className: `memory-${String(number).padStart(2, "0")}`,
  };
});

const photoFolders = [
  {
    folder: "Special Days",
    category: "special",
    label: "Special Day",
    files: [
      "IMG-20251127-WA0001.jpg",
      "IMG-20260501-WA0009.jpg",
      "IMG-20260628-WA0006.jpg",
      "IMG_20260425_204436.jpg",
      "IMG_20261004_145348.jpg",
      "IMG_20261004_145730.jpg",
      "Screenshot_2024-12-31-19-54-26-351_com.instagram.android.jpg",
      "Screenshot_2025-02-12-00-01-46-643_com.instagram.android.jpg",
      "Screenshot_2025-02-23-23-53-07-687_com.instagram.android.jpg",
      "Screenshot_2025-10-13-11-33-55-136_com.whatsapp.jpg",
      "Screenshot_2026-02-24-22-01-51-039_com.whatsapp.jpg",
      "Screenshot_2026-08-24-11-46-46-619_com.google.android.apps.photos.jpg",
    ],
  },
  {
    folder: "Random Moments",
    category: "random",
    label: "Random Moment",
    files: [
      "IMG-20250918-WA0001.jpg",
      "IMG_20261004_145655.jpg",
      "IMG_20261004_145821.jpg",
      "IMG_20261004_145924.jpg",
      "IMG_20261004_150031.jpg",
      "IMG_20261004_184525.jpg",
    ],
  },
  {
    folder: "Us",
    category: "us",
    label: "Us",
    files: [
      "IMG_20250821_143156.jpg",
      "IMG_20260307_170623.jpg",
      "IMG_20260502_165819.jpg",
      "IMG_20260627_202239.jpg",
      "IMG_20260717_214604.jpg",
      "IMG_20260829_201538.jpg",
      "IMG_20260926_182146.jpg",
      "IMG_20261004_181034.jpg",
      "IMG_20261004_181252.jpg",
      "Screenshot_2026-10-04-22-35-50-230_com.miui.gallery-edit.jpg",
    ],
  },
];

const folderPhotos = photoFolders.flatMap(({ folder, category, label, files }) =>
  files.map((filename, index) => ({
    id: `${category}-${index + 1}`,
    category,
    filename,
    image: `/assets/memories/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`,
    alt: `${label} photo ${index + 1}`,
    caption: `${label} · ${String(index + 1).padStart(2, "0")} ♡`,
    className: `folder-memory-${category}-${index + 1}`,
  })),
);

const photos = [...numberedPhotos, ...folderPhotos];

const collageSlots = [
  { column: 1, row: 2, angle: -5, offset: 10 },
  { column: 2, row: 1, angle: -4, offset: -7 },
  { column: 3, row: 1, angle: 2, offset: 1 },
  { column: 4, row: 1, angle: 3, offset: 18 },
  { column: 2, row: 2, angle: -2, offset: 8 },
  { column: 3, row: 2, angle: 4, offset: 21 },
];

function parseMemories(text) {
  const poems = [];
  let currentPoem;

  for (const line of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const numberedLine = line.match(/^\s*(\d+)\s*[.)-]\s*(.*)$/);
    if (numberedLine) {
      currentPoem = { number: Number(numberedLine[1]), text: numberedLine[2].trim() };
      poems.push(currentPoem);
    } else if (currentPoem && line.trim()) {
      currentPoem.text = `${currentPoem.text}\n${line.trim()}`;
    }
  }

  return poems.filter((poem) => poem.text);
}

const momentCards = [
  ["⌣", "Your Smile", "நீ சிரிக்கும்போது\nஉலகமே கொஞ்சம் அழகாகிறது...🤍", "It’s my favourite part of the day."],
  ["〰", "Your Voice", "உன் குரல் கேட்டாலே\nமனம் அமைதியாகிறது.😌", "My favourite notification."],
  ["♡", "Your Little Habits", "நீ செய்யும் சின்னச் சின்ன\nவிஷயங்கள் எல்லாம்...🥰", "The little things you don’t even realize you do."],
  ["✿", "The Way You Care", "என்னை நினைக்கும்\nஉன் மனசு...🤍", "You always think about others."],
  ["◉", "Your Eyes", "இரு விழிகளினுள் தொலைந்தது\n என் இதயம் ❤️", "They say everything without words."],
  ["✧", "Just You", "நீயாக இருப்பதே\nஎனக்குப் பிடித்தது.💘", "Because you are you, and that’s enough."],
];

function parseTimeline(text) {
  const events = [];
  const introduction = [];
  let currentEvent;

  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(/^(\d+)\s*[.)-]\s*(.+)$/);
    if (heading) {
      currentEvent = {
        number: Number(heading[1]),
        title: heading[2].trim(),
        description: [],
      };
      events.push(currentEvent);
    } else if (currentEvent && line) {
      currentEvent.description.push(line.replace(/^[-*•]\s*/, ""));
    } else if (line) {
      introduction.push(line);
    }
  }

  return {
    introduction: introduction.join(" "),
    events: events.map((event) => ({
      ...event,
      description: event.description.join("\n"),
    })),
  };
}

function TimelinePhoto({ photo, title, onOpen }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <p className="event-photo-error" role="status">Could not load this photo.</p>;
  }

  return (
    <button
      className="event-polaroid timeline-photo-button"
      type="button"
      aria-label={`View larger: ${title} memory`}
      onClick={(event) => onOpen({ src: photo.src, alt: `${title} memory`, title }, event.currentTarget)}
    >
      <img src={photo.src} alt="" loading="lazy" onError={() => setFailed(true)} />
      <span>{title} ♡</span>
    </button>
  );
}

const memoryLines = [
  <>Just a reminder...<br />you make everything better.</>,
  <>Somehow, ordinary days<br />feel golden with you.</>,
  <>My favourite place<br />will always be beside you.</>,
  <>A small moment with you<br />is a big memory to me.</>,
];

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
      <div className="hero-photo" role="img" aria-label="A woman standing beneath the trees" />
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
  const [poemsByNumber, setPoemsByNumber] = useState({});
  const [poemError, setPoemError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photoButtonRef = useRef(null);
  const viewerCloseRef = useRef(null);
  const visiblePhotos = filter === "all"
    ? numberedPhotos
    : folderPhotos.filter((photo) => photo.category === filter);
  const categories = [
    ["all", "♡", "All"],
    ["special", "✧", "Special Days"],
    ["random", "☼", "Random Moments"],
    ["us", "♡", "Us"],
  ];

  useEffect(() => {
    async function loadPoems() {
      try {
        const response = await fetch("/assets/memories/memories.txt");
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const poems = parseMemories(await response.text());
        if (poems.length === 0) throw new Error("No numbered poems were found.");

        setPoemsByNumber(Object.fromEntries(poems.map(({ number, text }) => [number, text])));
        setPoemError("");
      } catch (error) {
        setPoemError("Could not load the numbered poems from memories.txt.");
        console.error("Could not load memories.txt:", error);
      }
    }

    loadPoems();
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    viewerCloseRef.current?.focus();
    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedPhoto(null);
    }
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      photoButtonRef.current?.focus();
    };
  }, [selectedPhoto]);

  return (
    <section className={`memories paper-section${filter === "all" ? " memories-all" : ""}`} id="memories" aria-labelledby="memories-title">
      <div className="section-shell">
        <div className="section-heading memories-heading">
          <div>
            <p className="eyebrow">collected, not curated</p>
            <h2 id="memories-title">Our Memories <span>♡</span></h2>
            <p className="section-intro">Some moments are not just photos...<br />They are pieces of my heart.</p>
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
            {poemError && <p className="memory-error" role="status">{poemError}</p>}
            {visiblePhotos.map((photo, index) => (
              <figure
                className={`polaroid ${photo.className}`}
                key={photo.id}
                style={{
                  "--collage-column": collageSlots[index % collageSlots.length].column,
                  "--collage-row": Math.floor(index / collageSlots.length) * 2 + collageSlots[index % collageSlots.length].row,
                  "--collage-angle": `${collageSlots[index % collageSlots.length].angle}deg`,
                  "--collage-offset": `${collageSlots[index % collageSlots.length].offset}px`,
                }}
              >
                {index % 3 !== 1 && <span className={`tape tape-${index}`} />}
                <button
                  className="memory-photo-button"
                  type="button"
                  aria-label={`View larger: ${photo.alt}`}
                  onClick={(event) => {
                    photoButtonRef.current = event.currentTarget;
                    setSelectedPhoto(photo);
                  }}
                >
                  <MemoryImage photo={photo} />
                </button>
                {photo.number ? (
                  <figcaption className="tamil" lang="ta">
                    <span className="memory-number">{photo.number}.</span>{" "}
                    {poemsByNumber[photo.number] || `கவிதை ${photo.number}`}
                  </figcaption>
                ) : (
                  <figcaption className="folder-memory-caption">{photo.caption}</figcaption>
                )}
              </figure>
            ))}
            <span className="field-scribble handwritten">collect moments,<br />not things <span>♡</span></span>
            <span className="flower-doodle flower-one" aria-hidden="true">✿</span>
            <span className="flower-doodle flower-two" aria-hidden="true">✿</span>
          </div>
        </div>
      </div>
      {selectedPhoto && createPortal(
        <div className="memory-viewer-backdrop" role="presentation" onClick={() => setSelectedPhoto(null)}>
          <section
            className="memory-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${selectedPhoto.alt}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={viewerCloseRef} className="memory-viewer-close" type="button" aria-label="Close photo" onClick={() => setSelectedPhoto(null)}>×</button>
            <img src={selectedPhoto.image} alt={selectedPhoto.alt} />
            {selectedPhoto.number ? (
              <p className="tamil" lang="ta">
                <span className="memory-number">{selectedPhoto.number}.</span>{" "}
                {poemsByNumber[selectedPhoto.number] || `கவிதை ${selectedPhoto.number}`}
              </p>
            ) : (
              <p className="memory-viewer-caption">{selectedPhoto.caption}</p>
            )}
          </section>
        </div>,
        document.body,
      )}
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
  const [events, setEvents] = useState([]);
  const [introduction, setIntroduction] = useState("");
  const [photosByNumber, setPhotosByNumber] = useState({});
  const [timelineError, setTimelineError] = useState("");
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photoButtonRef = useRef(null);
  const photoViewerCloseRef = useRef(null);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const [textResponse, photosResponse] = await Promise.all([
          fetch("/assets/Timeline/TimeLine.txt"),
          fetch("/assets/Timeline/timeline-manifest.json"),
        ]);
        if (!textResponse.ok) throw new Error(`Timeline text request failed with status ${textResponse.status}`);
        if (!photosResponse.ok) throw new Error(`Timeline photo list request failed with status ${photosResponse.status}`);

        const parsedTimeline = parseTimeline(await textResponse.text());
        if (parsedTimeline.events.length === 0) throw new Error("No numbered timeline entries were found.");

        setEvents(parsedTimeline.events);
        setIntroduction(parsedTimeline.introduction);
        setPhotosByNumber(await photosResponse.json());
        setTimelineError("");
      } catch (error) {
        setTimelineError("Could not load the timeline. Check TimeLine.txt and its numbered photos.");
        console.error("Could not load the timeline:", error);
      } finally {
        setTimelineLoading(false);
      }
    }

    loadTimeline();
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    photoViewerCloseRef.current?.focus();
    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedPhoto(null);
    }
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      photoButtonRef.current?.focus();
    };
  }, [selectedPhoto]);

  return (
    <>
      <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
        <div className="timeline-top">
          <div className="section-shell">
            <div className="section-heading timeline-heading">
              <div>
                <p className="eyebrow">from strangers to forever</p>
                <h2 id="timeline-title">Our Timeline <span>♡</span></h2>
                <p className="section-intro">{introduction || "From strangers to forever... what a beautiful journey it has been."}</p>
              </div>
              <p className="handwritten timeline-aside">and every little<br />thing in between <span>♡</span></p>
            </div>
          </div>
        </div>
        <div className="timeline-body">
          <div className="timeline-rail" aria-hidden="true" />
          <div className="timeline-start" aria-hidden="true">♡</div>
          <div className="timeline-list">
            {timelineLoading ? (
              <p className="timeline-error" role="status">Loading our story...</p>
            ) : timelineError ? (
              <p className="timeline-error" role="status">{timelineError}</p>
            ) : events.map((event, index) => (
              <article className={`timeline-event event-${index % 2 === 0 ? "left" : "right"}`} key={event.number}>
                <span className="timeline-dot" aria-hidden="true" />
                <div className="event-card">
                  <p className="event-date">MEMORY {String(event.number).padStart(2, "0")}</p>
                  <h3>♡ {event.title}</h3>
                  {event.description && <p className="event-description">{event.description}</p>}
                  <span className="event-icon" aria-hidden="true">♡</span>
                  {photosByNumber[event.number] && (
                    <TimelinePhoto
                      photo={photosByNumber[event.number]}
                      title={event.title}
                      onOpen={(photo, button) => {
                        photoButtonRef.current = button;
                        setSelectedPhoto(photo);
                      }}
                    />
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
      {selectedPhoto && createPortal(
        <div className="memory-viewer-backdrop" role="presentation" onClick={() => setSelectedPhoto(null)}>
          <section
            className="memory-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${selectedPhoto.alt}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={photoViewerCloseRef}
              className="memory-viewer-close"
              type="button"
              aria-label="Close photo"
              onClick={() => setSelectedPhoto(null)}
            >×</button>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            <p className="memory-viewer-caption">{selectedPhoto.title} ♡</p>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

export default function App() {
  const [secondsRemaining, setSecondsRemaining] = useState(getSecondsUntilReveal);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsRemaining(getSecondsUntilReveal());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (secondsRemaining > 0) {
    const days = Math.floor(secondsRemaining / 86400);
    const hours = Math.floor((secondsRemaining % 86400) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;

    return (
      <main className="countdown-gate">
        <section className="countdown-card" aria-labelledby="countdown-title">
          <p className="countdown-kicker">A little surprise is waiting</p>
          <div className="countdown-heart" aria-hidden="true">♡</div>
          <h1 id="countdown-title">Our special moment is almost here</h1>
          <p className="countdown-date">12 October 2026 <span>·</span> 12:00 AM IST</p>
          <div className="countdown-clock" role="timer" aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
            {[
              ["Days", days],
              ["Hours", hours],
              ["Minutes", minutes],
              ["Seconds", seconds],
            ].map(([label, value]) => (
              <div className="countdown-unit" key={label}>
                <span>{String(value).padStart(2, "0")}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>
          <p className="countdown-surprise">One Special Surprise for You <span>❤️❤️❤️</span></p>
          <p className="countdown-signoff">Made with all my love <span aria-hidden="true">♡</span></p>
        </section>
        <span className="countdown-floating-heart countdown-floating-heart-one" aria-hidden="true">♡</span>
        <span className="countdown-floating-heart countdown-floating-heart-two" aria-hidden="true">♡</span>
      </main>
    );
  }

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
