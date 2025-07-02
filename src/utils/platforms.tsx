
export const PLATFORM_OPTIONS = [
  {
    type: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0A66C2"/><path d="M9.429 12.857h3.143v9.714H9.429v-9.714zm1.571-4.857c1.029 0 1.857.829 1.857 1.857 0 1.029-.829 1.857-1.857 1.857-1.029 0-1.857-.829-1.857-1.857 0-1.029.829-1.857 1.857-1.857zm3.771 4.857h3.014v1.329h.043c.42-.8 1.443-1.643 2.971-1.643 3.177 0 3.771 2.093 3.771 4.814v5.214h-3.143v-4.629c0-1.104-.021-2.529-1.543-2.529-1.543 0-1.779 1.206-1.779 2.45v4.707h-3.143v-9.329z" fill="#fff"/></svg>
    ),
    placeholder: 'LinkedIn profile link',
    defaultTitle: 'LinkedIn',
  },
  {
    type: 'instagram',
    label: 'Instagram',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#E1306C"/><path d="M16 11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.8a3 3 0 110-6 3 3 0 010 6zm6.4-7.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zm3.1 1.1c-.1-1.1-.3-1.8-.6-2.4a4.6 4.6 0 00-1.7-1.7c-.6-.3-1.3-.5-2.4-.6-1.1-.1-1.4-.1-4.1-.1s-3 0-4.1.1c-1.1.1-1.8.3-2.4.6a4.6 4.6 0 00-1.7 1.7c-.3.6-.5 1.3-.6 2.4-.1 1.1-.1 1.4-.1 4.1s0 3 .1 4.1c.1 1.1.3 1.8.6 2.4a4.6 4.6 0 001.7 1.7c.6.3 1.3.5 2.4.6 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1.1-.1 1.8-.3 2.4-.6a4.6 4.6 0 001.7-1.7c.3-.6.5-1.3.6-2.4.1-1.1.1-1.4.1-4.1s0-3-.1-4.1zm-2.2 7.9a2.7 2.7 0 01-1.5 1.5c-.4.2-1.2.4-2.3.5-1 .1-1.3.1-3.9.1s-2.9 0-3.9-.1c-1.1-.1-1.9-.3-2.3-.5a2.7 2.7 0 01-1.5-1.5c-.2-.4-.4-1.2-.5-2.3-.1-1-.1-1.3-.1-3.9s0-2.9.1-3.9c.1-1.1.3-1.9.5-2.3a2.7 2.7 0 011.5-1.5c.4-.2 1.2-.4 2.3-.5 1-.1 1.3-.1 3.9-.1s2.9 0 3.9.1c1.1.1 1.9.3 2.3.5a2.7 2.7 0 011.5 1.5c.2.4.4 1.2.5 2.3.1 1 .1 1.3.1 3.9s0 2.9-.1 3.9c-.1 1.1-.3 1.9-.5 2.3z" fill="#fff"/></svg>
    ),
    placeholder: 'Instagram profile link',
    defaultTitle: 'Instagram',
  },
  {
    type: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1877F3"/><path d="M21.5 16h-3v8h-3v-8h-2v-3h2v-2c0-1.7 1.3-3 3-3h2v3h-2c-.6 0-1 .4-1 1v1h3l-.5 3z" fill="#fff"/></svg>
    ),
    placeholder: 'Facebook profile link',
    defaultTitle: 'Facebook',
  },
  {
    type: 'twitter',
    label: 'Twitter',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1DA1F2"/><path d="M24 10.6c-.6.3-1.2.5-1.8.6.6-.4 1.1-1 1.3-1.7-.6.4-1.3.7-2 .9-.6-.6-1.5-1-2.4-1-1.8 0-3.2 1.5-3.2 3.2 0 .3 0 .6.1.8-2.7-.1-5.1-1.4-6.7-3.4-.3.6-.5 1.2-.5 1.9 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.2-1.1.9-2.5 1.4-4 1.4-.3 0-.6 0-.8-.1 1.4.9 3.1 1.5 4.9 1.5 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.4 1.1-1 1.5-1.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Twitter profile link',
    defaultTitle: 'Twitter',
  },
  {
    type: 'youtube',
    label: 'YouTube',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF0000"/><path d="M13.5 10.5l6 5.5-6 5.5v-11z" fill="#fff"/></svg>
    ),
    placeholder: 'YouTube channel link',
    defaultTitle: 'YouTube',
  },
  {
    type: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#000000"/><path d="M20.5 8.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm-4.5 1.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm-3 3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm3 3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm3 3c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z" fill="#fff"/></svg>
    ),
    placeholder: 'TikTok profile link',
    defaultTitle: 'TikTok',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#25D366"/><path d="M16 8a8 8 0 00-6.928 12.07l-1.07 3.93 4.03-1.06A8 8 0 1016 8zm4.47 11.53c-.2.56-1.16 1.1-1.6 1.17-.41.07-.93.1-1.5-.1-.34-.11-.78-.25-1.34-.5-2.36-1.02-3.9-3.36-4.02-3.52-.12-.16-.96-1.28-.96-2.45 0-1.17.62-1.75.84-1.98.22-.23.48-.29.64-.29.16 0 .32.01.46.01.15 0 .35-.06.55.42.2.48.68 1.65.74 1.77.06.12.1.27.02.43-.08.16-.12.25-.23.39-.11.14-.23.31-.33.42-.11.11-.22.23-.1.45.12.22.54.89 1.16 1.44.8.71 1.47.93 1.7 1.03.23.1.36.08.49-.05.13-.13.56-.65.71-.87.15-.22.3-.18.5-.11.2.07 1.28.6 1.5.71.22.11.36.17.41.27.05.1.05.58-.15 1.14z" fill="#fff"/></svg>
    ),
    placeholder: 'WhatsApp number',
    defaultTitle: 'WhatsApp',
  },
  {
    type: 'call',
    label: 'Call',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#34C759"/><path d="M22.67 19.13l-2.2-1a1 1 0 00-1.13.21l-1 1a11.36 11.36 0 01-5.33-5.33l1-1a1 1 0 00.21-1.13l-1-2.2A1 1 0 0012 8.67H9.33A1 1 0 008 9.67C8 18.29 13.71 24 22.33 24a1 1 0 001-1V20a1 1 0 00-.66-.87z" fill="#fff"/></svg>
    ),
    placeholder: 'Phone number',
    defaultTitle: 'Call',
  },
  {
    type: 'text',
    label: 'Text',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#34C759"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Text number',
    defaultTitle: 'Text',
  },
  {
    type: 'email',
    label: 'Email',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#EA4335"/><path d="M16 18.667l-8-6V24h16V12.667l-8 6zm8-10.667H8c-1.104 0-2 .896-2 2v.667l10 7.5 10-7.5v-.667c0-1.104-.896-2-2-2z" fill="#fff"/></svg>
    ),
    placeholder: 'Email address',
    defaultTitle: 'Email',
  },
  {
    type: 'website',
    label: 'Website',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366F1"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Website URL',
    defaultTitle: 'Website',
  },
  {
    type: 'address',
    label: 'Address',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#4285F4"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#fff"/></svg>
    ),
    placeholder: 'Address',
    defaultTitle: 'Address',
  },
  {
    type: 'custom',
    label: 'Other',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6B7280"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8zm0-11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6z" fill="#fff"/></svg>
    ),
    placeholder: 'Paste your link',
    defaultTitle: 'Custom Link',
  },
]; 