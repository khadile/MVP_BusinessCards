import { create } from 'zustand';

interface Link {
  type: string;
  label: string;
  url: string;
  icon: string;
}

interface OnboardingState {
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  links: Link[];
  password: string;
  setName: (name: string) => void;
  setJobTitle: (jobTitle: string) => void;
  setCompany: (company: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setLinks: (links: Link[]) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  name: '',
  jobTitle: '',
  company: '',
  email: '',
  phone: '',
  links: [],
  password: '',
  setName: (name) => set({ name }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setCompany: (company) => set({ company }),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  setLinks: (links) => set({ links }),
  setPassword: (password) => set({ password }),
  reset: () => set({ name: '', jobTitle: '', company: '', email: '', phone: '', links: [], password: '' }),
})); 