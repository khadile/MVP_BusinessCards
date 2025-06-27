import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { CardPreview } from '../../components/preview/CardPreview';

const SIDEBAR_SECTIONS = [
  { label: 'About', icon: '👤' },
  { label: 'Links', icon: '🔗' },
  { label: 'Sharing', icon: '📤', children: [
    { label: 'QR Code' },
  ] },
];

export const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('About');
  const onboarding = useOnboardingStore();
  const [cardName, setCardName] = useState('Card Title');
  const [cardLayout, setCardLayout] = useState('Left Aligned');
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>(undefined);
  const [companyLogo, setCompanyLogo] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('#FDBA74');
  const [linkColor, setLinkColor] = useState('#000000');
  const [matchLinkIcons, setMatchLinkIcons] = useState(false);

  // About section form fields
  const [name, setName] = useState(onboarding.name);
  const [jobTitle, setJobTitle] = useState(onboarding.jobTitle);
  const [company, setCompany] = useState(onboarding.company);
  const [email, setEmail] = useState(onboarding.email);
  const [phone, setPhone] = useState(onboarding.phone);
  const [links, setLinks] = useState(onboarding.links);

  // Add previous state for About section fields
  const [prevAbout, setPrevAbout] = useState({
    cardName: cardName,
    cardLayout: cardLayout,
    profilePic: profilePic,
    coverPhoto: coverPhoto,
    companyLogo: companyLogo,
    location: location,
    bio: bio,
    theme: theme,
    linkColor: linkColor,
    matchLinkIcons: matchLinkIcons,
    name: name,
    jobTitle: jobTitle,
    company: company,
    email: email,
    phone: phone,
    links: links,
  });

  // Cancel handler: revert all fields to previous state
  const handleCancel = () => {
    setCardName(prevAbout.cardName);
    setCardLayout(prevAbout.cardLayout);
    setProfilePic(prevAbout.profilePic);
    setCoverPhoto(prevAbout.coverPhoto);
    setCompanyLogo(prevAbout.companyLogo);
    setLocation(prevAbout.location);
    setBio(prevAbout.bio);
    setTheme(prevAbout.theme);
    setLinkColor(prevAbout.linkColor);
    setMatchLinkIcons(prevAbout.matchLinkIcons);
    setName(prevAbout.name);
    setJobTitle(prevAbout.jobTitle);
    setCompany(prevAbout.company);
    setEmail(prevAbout.email);
    setPhone(prevAbout.phone);
    setLinks(prevAbout.links);
  };

  // Update handler: save current state as previous
  const handleUpdate = () => {
    setPrevAbout({
      cardName,
      cardLayout,
      profilePic,
      coverPhoto,
      companyLogo,
      location,
      bio,
      theme,
      linkColor,
      matchLinkIcons,
      name,
      jobTitle,
      company,
      email,
      phone,
      links,
    });
    // Here you can also add logic to persist the update to a backend or global store
  };

  // Sidebar rendering
  const renderSidebar = () => (
    <aside className="w-48 bg-white border-r min-h-full flex flex-col py-6 px-6 gap-1">
      <div className="mb-4">
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">CONTENT</div>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${activeSection === 'About' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('About')}
        >
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="black" strokeWidth="2"/></svg></span> About
        </button>
        <button
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition ${activeSection === 'Links' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('Links')}
        >
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17 7a5 5 0 00-7.07 0l-4 4a5 5 0 007.07 7.07l1-1" stroke="black" strokeWidth="2"/><path d="M7 17a5 5 0 007.07 0l4-4a5 5 0 00-7.07-7.07l-1 1" stroke="black" strokeWidth="2"/></svg></span> Links
        </button>
      </div>
      <div>
        <div className="font-bold text-xs text-gray-800 mb-1 tracking-wide">SHARING</div>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 text-gray-700">
          <span className="text-black">{/* black icon */} <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="black" strokeWidth="2"/><polyline points="17 8 12 3 7 8" stroke="black" strokeWidth="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="black" strokeWidth="2"/></svg></span> QR Code
        </button>
      </div>
    </aside>
  );

  // About section form (main content)
  const renderAboutSection = () => (
    <div className="flex flex-col gap-6 w-full relative min-h-[600px]">
      {/* About Title */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
      </div>
      {/* Card Name and Layout */}
      <div className="flex flex-row gap-x-8 w-full">
        <div className="flex flex-row items-center gap-2 w-1/2">
          <label className="text-[11px] font-small text-gray-700 whitespace-nowrap">Card Name:</label>
          <input className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-xs w-full font-semibold" value={cardName} onChange={e => setCardName(e.target.value)} />
          {/* Optional: Add edit icon here if needed */}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/2">
          <label className="text-[11px] font-small text-gray-700 whitespace-nowrap">Card Layout:</label>
          <select className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-xs w-full font-semibold" value={cardLayout} onChange={e => setCardLayout(e.target.value)}>
            <option>Left Aligned</option>
            <option>Centered</option>
          </select>
        </div>
      </div>
      {/* Profile, Cover, Logo */}
      <div className="flex flex-row gap-20 items-center justify-center w-full">
        {/* Profile picture */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <img src="/ixl-logo.svg" alt="Profile" className="w-16 h-16" />}
          </div>
          <button className="text-[11px] text-blue-500 hover:underline mt-0.5">Upload</button>
        </div>
        {/* Cover photo */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-48 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
            {coverPhoto ? <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" /> : <span className="text-[13px] text-gray-400">Cover photo</span>}
          </div>
          <button className="text-[11px] text-blue-500 hover:underline mt-0.5">Upload</button>
        </div>
        {/* Company logo */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {companyLogo ? <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" /> : <span className="text-[13px] text-gray-400">Logo</span>}
          </div>
          <button className="text-[11px] text-blue-500 hover:underline mt-0.5">Upload</button>
        </div>
      </div>
      {/* Name, Location, Job Title, Company */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Name</label>
          <input className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Location</label>
          <input className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Job Title</label>
          <input className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-gray-600">Company</label>
          <input className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs w-full" value={company} onChange={e => setCompany(e.target.value)} />
        </div>
      </div>
      {/* Bio */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[11px] font-medium text-gray-600">Bio</label>
        <textarea className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-xs min-h-[36px] w-full" value={bio} onChange={e => setBio(e.target.value)} placeholder="PR & Media Communications\nLet's work!" />
      </div>
      {/* Theme pickers */}
      <div className="w-full mt-1">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
          <label className="text-[11px] font-medium text-gray-600 col-span-1 row-span-1 self-center">Card Theme</label>
          <div className="flex gap-x-3">
            {["#000000", "#F59E42", "#FDBA74", "#FDE68A", "#4ADE80", "#60A5FA", "#818CF8", "#F472B6", "#F87171", "#FACC15"].map(color => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full border-2 ${theme === color ? 'border-orange-500' : 'border-white'} shadow`}
                style={{ background: color }}
                onClick={() => setTheme(color)}
              />
            ))}
          </div>
          <label className="text-[11px] font-medium text-gray-600 col-span-1 row-span-1 self-center">Link Color</label>
          <div className="flex gap-x-3">
            {["#000000", "#F59E42", "#FDBA74", "#FDE68A", "#4ADE80", "#60A5FA", "#818CF8", "#F472B6", "#F87171", "#FACC15"].map(color => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full border-2 ${linkColor === color ? 'border-orange-500' : 'border-white'} shadow`}
                style={{ background: color }}
                onClick={() => setLinkColor(color)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="justify-end bottom-0 flex gap-4 p-4">
        <button
          className="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-500 font-semibold text-xs hover:bg-gray-100 transition"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Outer header container */}
      <header className="w-full flex items-center justify-between px-10 py-5 bg-transparent">
        <div className="flex items-center gap-3">
          <img src="/ixl-logo.svg" alt="ILX Logo" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-xl text-gray-800">Sofia</span>
        </div>
        <div className="flex items-center gap-4">
          <select className="border rounded-lg px-3 py-1 text-sm" value={cardName} onChange={e => setCardName(e.target.value)}>
            <option>Card Title</option>
          </select>
          <button className="bg-black text-white rounded-full px-5 py-2 font-semibold text-sm hover:bg-gray-900 transition">Share Your Card</button>
        </div>
      </header>
      {/* Main dashboard container */}
      <div className="flex flex-1 justify-center items-start w-full px-3 pb-1">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg flex flex-row min-h-[700px] mt-2 overflow-hidden">
          {renderSidebar()}
          <main className="flex-1 flex flex-row gap-0 px-10 py-10 overflow-y-auto">
            <div className="flex-1 flex flex-col">
              {activeSection === 'About' && renderAboutSection()}
              {/* Add more sections as needed */}
            </div>
            <div className="w-[350px] flex-shrink-0 flex flex-col">
              <div className="sticky top-10">
                <div className="p-0 bg-transparent shadow-none border-none">
                  <CardPreview
                    name={name}
                    jobTitle={jobTitle}
                    company={company}
                    email={email}
                    phone={phone}
                    links={links}
                    // Add more props as needed for theme/colors
                  />
                  <div className="text-center text-gray-400 mt-2 text-xs">Card live preview</div>
                  <a
                    href="#"
                    className="block text-center text-blue-500 text-xs mt-1 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View card ↗
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};