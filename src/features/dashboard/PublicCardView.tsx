import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CardPreview } from '../../components/preview/CardPreview';
import { BusinessCard } from '../../types';
import { PLATFORM_OPTIONS } from '../../utils/platforms';

export const PublicCardView: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!cardId) throw new Error('No card ID provided');
        const cardDoc = await getDoc(doc(db, 'businessCards', cardId));
        if (!cardDoc.exists()) throw new Error('Card not found');
        setCard({ ...cardDoc.data(), id: cardDoc.id } as BusinessCard);
      } catch (err: any) {
        setError(err.message || 'Failed to load card');
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-500">Loading card...</div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-red-500">{error || 'Card not found'}</div>
      </div>
    );
  }

  // Enrich links: ensure each link has type, label, and icon
  const normalizedLinks = (card.links || []).map(l => {
    const type = l.type || (l as any).platform || '';
    const platform = PLATFORM_OPTIONS.find(p => p.type === type);
    return {
      ...l,
      type,
      label: l.label || platform?.label || type,
    };
  });

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-50 py-0 px-0 relative">
      <div className="absolute top-6 left-6">
        <img src="/ixl-logo.svg" alt="ILX Logo" className="h-10 w-10" />
      </div>
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '90vh' }}>
          <CardPreview
            name={card.profile.name}
            jobTitle={card.profile.jobTitle}
            company={card.profile.company}
            email={card.profile.email || ''}
            phone={card.profile.phone || ''}
            links={normalizedLinks.filter(l => l.isActive) || []}
            theme={card.theme.primaryColor}
            linkColor={card.theme.secondaryColor}
            layout={card.theme.layout === 'modern' ? 'Left Aligned' : 'Centered'}
            profileImage={card.profile.profileImage}
            coverPhoto={card.profile.coverPhoto}
            companyLogo={card.profile.companyLogo}
            location={card.profile.location || ''}
            bio={card.profile.bio || ''}
          />
        </div>
      </div>
      <div className="text-center text-gray-400 mt-4 text-xs pb-4">Share this link to let others view your card</div>
    </div>
  );
}; 