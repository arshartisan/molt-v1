import Image from "next/image";
import { Reveal } from "./reveal";
import { DemoButton, Header, AppShowcase, FaqList } from "./landing-interactions";
import { Icon, PhonePreview } from "./product-preview";

const features = [
  { icon: "scan", color: "lemon", title: "A clearer count", text: "Review camera-detected birds alongside your recorded flock, with area status, timing and coverage." },
  { icon: "camera", color: "sky", title: "A closer look", text: "Open connected camera views from your phone. Look at the area behind the count, wherever you are." },
  { icon: "layers", color: "lilac", title: "Every batch, together", text: "Follow arrivals, placements and growing cycles across active, completed and archived batches." },
  { icon: "bird", color: "mint", title: "Records that stay connected", text: "Keep deaths, culls and permitted bird movements tied to the batch and area where they happen." },
  { icon: "bell", color: "peach", title: "Context when it matters", text: "Review farm incidents and notifications with the count and camera details you need to investigate." },
  { icon: "users", color: "rose", title: "Your farm. Your team.", text: "Invite staff and give them Manager or Worker access to the farms they work on." },
];
const faqs = [
  ["What is Molt?", "Molt is a mobile application for poultry-farm monitoring and flock records. It brings camera counts, connected views, batches, bird activity and farm incidents into one place."],
  ["How are camera counts different from flock records?", "Detected birds are computer-vision observations from camera frames. Your recorded flock comes from placements and recorded bird activity. Molt keeps both views separate; a recount does not automatically change your flock ledger."],
  ["Can I use my existing cameras?", "Camera compatibility needs to be confirmed for your farm. Registration and assignment are handled by the platform team. Connected views depend on the camera, connectivity and configured live service."],
  ["Can my staff use Molt?", "Yes. Owners can invite staff and assign Manager or Worker access per farm. Each team member’s available actions depend on their account role and farm access. Owners manage setup, sales, corrections and permissions."],
  ["Does Molt automatically record bird losses?", "No. Camera observations and flock records remain separate. Permitted users record deaths and culls through the batch workflow. A difference in counts is monitoring context, not a diagnosis."],
  ["How do I sign in?", "Molt uses a mobile number and a six-digit SMS verification code. The current sign-in flow supports Sri Lankan mobile numbers. Farm access and camera setup need to be arranged with the team."],
  ["Does monitoring need an internet connection?", "Yes. Connected camera views and fresh server data need connectivity. An offline monitoring mode is not currently established."],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <noscript><style>{`.motion-reveal { opacity: 1 !important; transform: none !important; }`}</style></noscript>
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <span className="eyebrow hero-eyebrow"><span className="small-dot" /> A NEW PERSPECTIVE ON POULTRY FARMING</span>
            <h1 id="hero-title">Keep your<br />flock <span className="highlight">in view.<svg viewBox="0 0 310 17" aria-hidden="true"><path d="M3 12C75 2 194 2 306 9M34 16C115 7 211 6 274 13" /></svg></span></h1>
            <p className="hero-description">Your counts, cameras and flock records.<br className="desktop-break" /> One clear view of your poultry farm.</p>
            <div className="hero-actions"><DemoButton /><a className="button button-outline" href="#app">Explore the app <Icon name="arrow" /></a></div>
            <p className="supporting"><Icon name="check" /> Built around your farms, barns and areas.</p>
          </Reveal>
          <Reveal delay={0.12} className="hero-visual">
            <div className="visual-grid" aria-hidden="true" />
            <span className="visual-label"><span className="small-dot" /> THE BIG PICTURE. IN YOUR POCKET.</span>
            <div className="phone-placement"><PhonePreview /></div>
            <div className="floating-card floating-record"><span className="icon-tile mint"><Icon name="layers" /></span><div><small>Flock records</small><strong>Every batch accounted for.</strong></div><span className="float-check"><Icon name="check" /></span></div>
            <div className="floating-card floating-camera"><span className="icon-tile sky"><Icon name="camera" /></span><div><strong>A closer look</strong><small>Camera context, when you need it.</small></div></div>
            <span className="illustration-note">Illustrative app preview · not live data</span>
          </Reveal>
        </section>
        <div className="product-strip container"><p>Less switching.<br /><strong>More seeing.</strong></p><span><Icon name="scan" /> Camera-based counts</span><span><Icon name="camera" /> Connected camera views</span><span><Icon name="layers" /> Flock & batch records</span><span><Icon name="users" /> Farm team access</span></div>

        <section id="overview" className="section container overview">
          <Reveal className="section-intro"><span className="eyebrow">THE COUNT AND THE CONTEXT</span><h2>Two views.<br />One better picture.</h2><p>A camera observation and a flock record answer different questions. Molt brings both into view so you can understand changes without losing track of your flock.</p><a className="text-link" href="#features">Meet your farm’s new overview <Icon name="arrow" /></a></Reveal>
          <div className="comparison"><article className="count-card"><div className="card-top"><span className="icon-tile sky"><Icon name="scan" /></span><span className="mini-tag">MONITORING</span></div><h3>What the cameras see</h3><p>Latest detected birds, with count timing and camera coverage.</p><div className="count-example"><span>Camera-detected birds</span><strong>— <small>birds</small></strong><span className="waiting"><span className="small-dot" /> Waiting for a fresh count</span></div></article><article className="count-card"><div className="card-top"><span className="icon-tile lemon"><Icon name="layers" /></span><span className="mini-tag">RECORDKEEPING</span></div><h3>What your records say</h3><p>Placements and recorded activity through every growing cycle.</p><div className="count-example"><span>Recorded flock</span><strong>800 <small>birds</small></strong><span className="ledger-note"><Icon name="check" /> Based on recorded bird activity</span></div></article><p className="comparison-note">Illustrative example. A recount updates camera observations, not flock records.</p></div>
        </section>

        <section id="features" className="features-section"><div className="container section"><Reveal className="section-heading centered"><span className="eyebrow">MADE FOR THE EVERYDAY</span><h2>Big on the picture.<br />Close to the details.</h2><p>From your first check of the day to your latest flock record,<br className="desktop-break" /> the tools you need are right where you need them.</p></Reveal><div className="feature-grid">{features.map((feature, index) => <Reveal as="article" delay={index * 0.06} className="feature-card" key={feature.title}><span className={`icon-tile ${feature.color}`}><Icon name={feature.icon} /></span><h3>{feature.title}</h3><p>{feature.text}</p></Reveal>)}</div><p className="feature-footnote">Camera views and fresh counts depend on your connected hardware and monitoring services.</p></div></section>

        <section id="how-it-works" className="section container"><Reveal className="section-heading heading-row"><div><span className="eyebrow">A CLEARER WAY TO WORK</span><h2>Your farm.<br />Connected, step by step.</h2></div><p>Built around the way your operation works.<br />Set up together. Keep the daily view simple.</p></Reveal><div className="steps">{[{ title: "Organize your farm", text: "Map your farms, barns and areas. Set targets and give your team the right access.", icon: "barn" }, { title: "Connect your cameras", text: "Work with the platform team to confirm hardware, register cameras and assign them to areas.", icon: "camera" }, { title: "Review. Record. Repeat.", text: "Check counts, look closer at incidents and keep permitted batch activity current from your phone.", icon: "check" }].map((step, index) => <Reveal as="article" delay={index * 0.06} className="step" key={step.title}><div className="step-number">0{index + 1}<Icon name={step.icon} /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div></section>

        <AppShowcase />

        <section id="team" className="section container team-section"><Reveal className="team-visual"><span className="eyebrow">THE RIGHT PEOPLE. THE RIGHT ACCESS.</span><div className="access-farm"><span className="icon-tile lemon"><Icon name="barn" /></span><div><strong>Your farm</strong><small>Farm-specific team access</small></div><Icon name="check" /></div><div className="access-line" aria-hidden="true" /><div className="role-grid">{[{ role: "Owner", text: "Setup & permissions", color: "lemon" }, { role: "Manager", text: "Assigned farm access", color: "lilac" }, { role: "Worker", text: "Daily bird records", color: "mint" }].map(role => <div className="role-card" key={role.role}><span className={`icon-tile ${role.color}`}><Icon name="users" /></span><strong>{role.role}</strong><small>{role.text}</small></div>)}</div><p className="small-caption">Illustrative roles · available actions depend on account permissions</p></Reveal><Reveal className="section-intro"><span className="eyebrow">BETTER TOGETHER</span><h2>A shared view.<br />A connected team.</h2><p>Keep everyone connected to the farms they work on. Owners manage setup and permissions. Assigned teams keep the daily work moving.</p><ul className="check-list"><li><Icon name="check" /> Invite staff with an SMS invitation</li><li><Icon name="check" /> Assign Manager or Worker access per farm</li><li><Icon name="check" /> Manage access as your team changes</li></ul></Reveal></section>

        <section id="faq" className="section container faq-section"><Reveal className="section-intro"><span className="eyebrow">GOOD QUESTIONS</span><h2>A little more<br />clarity.</h2><p>A few things you might be wondering before bringing your farm into view.</p><a className="text-link" href="#contact">Let’s talk about your farm <Icon name="arrow" /></a></Reveal><FaqList items={faqs} /></section>

        <Reveal as="section" id="contact" className="container contact-section"><div className="contact-pattern" aria-hidden="true" /><div><span className="eyebrow">YOUR NEXT CHAPTER STARTS WITH A CLEARER VIEW</span><h2>Bring your farm<br />into view with Molt.</h2><p>Explore how camera monitoring and flock records<br className="desktop-break" /> can fit your poultry operation.</p></div><DemoButton className="button-dark" label="Discuss your farm setup" /></Reveal>
      </main>
      <footer className="container footer"><div className="footer-top"><div><a href="#hero-title" aria-label="Molt home"><Image src="/brand/label-logo.svg" alt="Molt" width={109} height={40} /></a><p>A clearer view of your farm.<br />Camera monitoring and flock records, together.</p></div><nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#app">The app</a><a href="#faq">FAQ</a></nav><a className="back-top" href="#hero-title">Back to top <Icon name="arrow" /></a></div><div className="footer-bottom"><span>© 2026 Molt. All rights reserved.</span><span>Made for the people behind the flock.</span></div></footer>
    </>
  );
}
