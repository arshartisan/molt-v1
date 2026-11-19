// All copy is sourced from the current molt.focaldive.io site.

export const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "The app", href: "#app" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export const TOTAL_SECTIONS = 11;

export const HERO_TABS = [
  { label: "Counts", tag: "Camera count", line: "Barn 01 · A2 - 196 birds detected. Recorded flock: 200." },
  { label: "Cameras", tag: "Live view", line: "A4 camera connected. Open the area behind the count." },
  { label: "Batches", tag: "Batch", line: "Batch placed in Barn 01. 800 birds across four areas." },
  { label: "Records", tag: "Flock record", line: "Cull recorded in A3, tied to the batch and area." },
  { label: "Team", tag: "Access", line: "Worker invited by SMS. Access set for Barn 01." },
];

export const APP_CALLOUTS = [
  { n: "01", title: "Your farm at a glance", body: "Flock, counts and areas on one screen.", side: "left", dot: [40, 66] },
  { n: "02", title: "Camera-based counts", body: "Detected birds, with timing and coverage.", side: "left", dot: [56, 150] },
  { n: "03", title: "Flock records", body: "Every batch, through every cycle.", side: "right", dot: [242, 150] },
  { n: "04", title: "Batches", body: "Arrivals, placements and growing cycles.", side: "left", dot: [48, 230] },
  { n: "05", title: "Area status", body: "Each barn and area, with its own view.", side: "right", dot: [246, 230] },
  { n: "06", title: "Connected camera views", body: "Look at the area behind the count, wherever you are.", side: "right", dot: [262, 388] },
  { n: "07", title: "Farm team access", body: "Manager or Worker access, per farm.", side: "left", dot: [40, 498] },
] as const;

export const FEATURES = [
  "Camera-based counts",
  "Connected camera views",
  "Flock & batch records",
  "Farm team access",
  "Area status",
  "Farm incidents",
];

export const STATS = [
  { n: "01", value: "2 views", label: "the count and the context", glyph: "camera" },
  { n: "02", value: "3 roles", label: "Owner, Manager and Worker", glyph: "team" },
  { n: "03", value: "6-digit", label: "SMS code to sign in", glyph: "phone" },
  { n: "04", value: "1 app", label: "for farms, barns and areas", glyph: "barn" },
] as const;

export const EVERYDAY = [
  {
    title: "A clearer count",
    body: "Review camera-detected birds alongside your recorded flock, with area status, timing and coverage.",
    glyph: "count",
  },
  {
    title: "A closer look",
    body: "Open connected camera views from your phone. Look at the area behind the count, wherever you are.",
    glyph: "camera",
  },
  {
    title: "Every batch, together",
    body: "Follow arrivals, placements and growing cycles across active, completed and archived batches.",
    glyph: "batch",
  },
  {
    title: "Records that stay connected",
    body: "Keep deaths, culls and permitted bird movements tied to the batch and area where they happen.",
    glyph: "record",
  },
  {
    title: "Context when it matters",
    body: "Review farm incidents and notifications with the count and camera details you need to investigate.",
    glyph: "bell",
  },
  {
    title: "Your farm. Your team.",
    body: "Invite staff and give them Manager or Worker access to the farms they work on.",
    glyph: "team",
  },
] as const;

export const STEPS = [
  {
    when: "Step 01",
    title: "Organize your farm",
    body: "Map your farms, barns and areas. Set targets and give your team the right access.",
    tag: "Farms, barns, areas",
    level: "Organized",
    height: 38,
  },
  {
    when: "Step 02",
    title: "Connect your cameras",
    body: "Work with the platform team to confirm hardware, register cameras and assign them to areas.",
    tag: "With the platform team",
    level: "Connected",
    height: 64,
  },
  {
    when: "Step 03",
    title: "Review. Record. Repeat.",
    body: "Check counts, look closer at incidents and keep permitted batch activity current from your phone.",
    tag: "From your phone",
    level: "In view",
    height: 90,
  },
];

export const FAQ = [
  {
    q: "What is Molt?",
    a: "Molt is a mobile application for poultry-farm monitoring and flock records. It brings camera counts, connected views, batches, bird activity and farm incidents into one place.",
  },
  {
    q: "How are camera counts different from flock records?",
    a: "Detected birds are computer-vision observations from camera frames. Your recorded flock comes from placements and recorded bird activity. Molt keeps both views separate; a recount does not automatically change your flock ledger.",
  },
  {
    q: "Can I use my existing cameras?",
    a: "Camera compatibility needs to be confirmed for your farm. Registration and assignment are handled by the platform team. Connected views depend on the camera, connectivity and configured live service.",
  },
  {
    q: "Can my staff use Molt?",
    a: "Yes. Owners can invite staff and assign Manager or Worker access per farm. Each team member’s available actions depend on their account role and farm access. Owners manage setup, sales, corrections and permissions.",
  },
  {
    q: "Does Molt automatically record bird losses?",
    a: "No. Camera observations and flock records remain separate. Permitted users record deaths and culls through the batch workflow. A difference in counts is monitoring context, not a diagnosis.",
  },
  {
    q: "How do I sign in?",
    a: "Molt uses a mobile number and a six-digit SMS verification code. The current sign-in flow supports Sri Lankan mobile numbers. Farm access and camera setup need to be arranged with the team.",
  },
  {
    q: "Does monitoring need an internet connection?",
    a: "Yes. Connected camera views and fresh server data need connectivity. An offline monitoring mode is not currently established.",
  },
];
