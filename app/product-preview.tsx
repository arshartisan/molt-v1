import Image from "next/image";

const paths: Record<string, React.ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  scan: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M7 12h10" /><circle cx="12" cy="12" r="3" /></>,
  camera: <><rect x="3" y="5" width="12" height="14" rx="3" /><path d="m15 10 6-4v12l-6-4" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5" /></>,
  bird: <><path d="M7 15c-3-1-4-4-4-7l6 3 4-6a4 4 0 0 1 7 3l2 2-3 1c-1 6-5 8-10 7l-2-3ZM9 18v3m5-3v3M8 21h3m2 0h3" /><path d="M16 7h.01M9 11c0 3 2 4 4 4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m5 11v-3a6 6 0 0 0-3-5" /></>,
  barn: <><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M7 21V11h10v10M7 15h10M7 18h10" /></>,
  home: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" /></>,
  settings: <><path d="m9 3-1 3-3 1-2 4 2 2-1 3 3 3 3-1 2 3 4-2 1-3 3-1v-4l-3-1-1-3-4-1-2 2Z" /><circle cx="12" cy="12" r="3" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.barn}</svg>;
}

export function PhonePreview({ screen = "home" }: { screen?: string }) {
  return <div className="phone" role="img" aria-label={`Illustrative Molt ${screen} screen, showing sample flock records and unavailable camera counts. Not live data.`}>
    <div className="phone-screen">
      <div className="phone-status"><span>9:41</span><span className="phone-island" /><span className="phone-signal">▮▮▮ <span>▰</span></span></div>
      <div className="phone-content">
        <div className="phone-brand"><Image src="/brand/label-logo.svg" alt="" width={74} height={27} /><span className="phone-bell"><Icon name="bell" /><i /></span></div>
        {screen === "home" ? <>
          <h4>Good morning!</h4><p className="phone-subtitle">Here’s your farm at a glance.</p>
          <div className="phone-metric"><span><span className="phone-bird"><Icon name="bird" /></span> Detected birds</span><strong>— <small>birds</small></strong><p>Waiting for a camera count</p><div>Recorded flock · <b>800 birds</b></div></div>
          <div className="phone-shortcuts"><span><Icon name="layers" /> Batches</span><span><Icon name="camera" /> Live cameras</span></div>
          <h5>Area status <small>Your farm</small></h5><div className="phone-barn"><div className="phone-barn-title"><span className="phone-barn-icon"><Icon name="barn" /></span><div><b>Barn 01</b><small>800 ledger birds · 4 areas</small></div></div><div className="phone-areas">{["A1", "A2", "A3", "A4"].map(area => <div key={area}><span>{area}<span>›</span></span><b>—</b><small>No fresh count</small><p>Recorded · 200</p></div>)}</div></div>
        </> : screen === "batches" ? <>
          <h4>Your flock batches</h4><p className="phone-subtitle">Every growing cycle, in one place.</p><div className="phone-filter"><b>Active</b><span>Completed</span><span>Archived</span></div><div className="phone-batch"><div><span className="icon-tile lilac"><Icon name="layers" /></span><span className="batch-pill">Active</span></div><h4>Batch 01</h4><p>Broiler · Barn 01</p><strong>800 <small>recorded birds</small></strong><div className="batch-progress"><span /></div><p className="batch-days">Day 7 of 42 <b>Growing cycle</b></p><div className="batch-stats"><span>Initial placement<b>800</b></span><span>Recorded deaths<b>0</b></span></div></div><div className="phone-info"><Icon name="layers" /><p>Follow placements and bird activity through the whole cycle.</p></div>
        </> : <>
          <h4>Connected views</h4><p className="phone-subtitle">A closer look at your farm.</p><div className="live-totals"><span>Recorded flock<b>800</b></span><span>Detected birds<b>—</b></span></div><h5>Barn 01 <small>Camera coverage</small></h5><div className="camera-empty"><span className="icon-tile sky"><Icon name="camera" /></span><b>Area A1</b><p>No cameras assigned</p><small>Views become available after setup.</small></div><div className="phone-info"><Icon name="scan" /><p>Fresh counts and views depend on camera and service availability.</p></div>
        </>}
      </div>
      <div className="phone-tabs">{[{ name: "Home", icon: "home", screen: "home" }, { name: "Batches", icon: "layers", screen: "batches" }, { name: "Live", icon: "camera", screen: "live" }, { name: "Settings", icon: "settings", screen: "settings" }].map(tab => <span className={screen === tab.screen ? "active" : ""} key={tab.name}><Icon name={tab.icon} />{tab.name}</span>)}</div>
      <div className="phone-home-bar" />
    </div>
  </div>;
}
