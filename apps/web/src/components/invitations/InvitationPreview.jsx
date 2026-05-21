import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const InvitationPreview = ({ formData, colors, fonts, ganapati, images, type = 'wedding' }) => {
  const [viewMode, setViewMode] = useState('desktop');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  const getGanapatiPosition = () => {
    const placement = ganapati?.placement || 'top-center';
    const positions = {
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'watermark': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    };
    return positions[placement] || positions['top-center'];
  };

  const PreviewContent = () => (
    <div 
      className="invitation-preview relative w-full aspect-[3/4] p-8 overflow-hidden"
      style={{
        backgroundColor: colors?.background || '#FFF8DC',
        color: colors?.text || '#2C1810',
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Background Image */}
      {images?.background && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${images.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Ganapati Element */}
      {ganapati?.enabled && (
        <div 
          className={`ganapati-element absolute ${getGanapatiPosition()}`}
          style={{
            opacity: (ganapati.opacity || 100) / 100,
            transform: `rotate(${ganapati.rotation || 0}deg)`,
          }}
        >
          {ganapati.type === 'custom' && ganapati.customImage ? (
            <img 
              src={ganapati.customImage} 
              alt="Ganapati"
              style={{ 
                width: `${ganapati.size || 64}px`,
                height: `${ganapati.size || 64}px`,
              }}
            />
          ) : (
            <div 
              className="rounded-full flex items-center justify-center"
              style={{
                width: `${ganapati.size || 64}px`,
                height: `${ganapati.size || 64}px`,
                backgroundColor: ganapati.color || '#D4AF37',
                color: 'white',
                fontSize: `${(ganapati.size || 64) * 0.5}px`,
              }}
            >
              ॐ
            </div>
          )}
        </div>
      )}

      {/* Traditional Text */}
      {ganapati?.enabled && ganapati?.showText && (
        <div 
          className="absolute top-16 left-1/2 -translate-x-1/2 font-devanagari"
          style={{
            fontSize: `${ganapati.textSize || 18}px`,
            color: ganapati.textColor || '#D4AF37',
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-6 text-center">
        {type === 'wedding' ? (
          <>
            <h1 
              className="invitation-heading"
              style={{ 
                fontFamily: fonts?.headingFont || 'Playfair Display, serif',
                fontSize: `${fonts?.headingSize || 32}px`,
                letterSpacing: `${fonts?.letterSpacing || 0}px`,
                color: colors?.primary || '#D4AF37',
              }}
            >
              {formData?.groomNameEn || 'Groom Name'} & {formData?.brideNameEn || 'Bride Name'}
            </h1>

            {(formData?.groomNameHi || formData?.brideNameHi) && (
              <p 
                className="font-devanagari text-2xl"
                style={{ color: colors?.secondary || '#8B4513' }}
              >
                {formData?.groomNameHi} & {formData?.brideNameHi}
              </p>
            )}

            <div className="flex gap-8 my-6">
              {images?.groom && (
                <img 
                  src={images.groom} 
                  alt="Groom"
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: colors?.accent || '#FFD700' }}
                />
              )}
              {images?.bride && (
                <img 
                  src={images.bride} 
                  alt="Bride"
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: colors?.accent || '#FFD700' }}
                />
              )}
            </div>

            <div 
              className="space-y-2"
              style={{ 
                fontFamily: fonts?.bodyFont || 'Outfit, sans-serif',
                fontSize: `${fonts?.bodySize || 16}px`,
              }}
            >
              <p className="font-semibold">Wedding Ceremony</p>
              <p>{formData?.weddingDate || 'Date'} at {formData?.weddingTime || 'Time'}</p>
              <p>{formData?.venue || 'Venue'}</p>
              <p className="text-sm">{formData?.address || 'Address'}</p>
            </div>
          </>
        ) : (
          <>
            <h1 
              className="invitation-heading"
              style={{ 
                fontFamily: fonts?.headingFont || 'Playfair Display, serif',
                fontSize: `${fonts?.headingSize || 32}px`,
                letterSpacing: `${fonts?.letterSpacing || 0}px`,
                color: colors?.primary || '#EC4899',
              }}
            >
              {formData?.birthdayPersonNameEn || 'Birthday Person'}
            </h1>

            {formData?.birthdayPersonNameHi && (
              <p 
                className="font-devanagari text-2xl"
                style={{ color: colors?.secondary || '#F59E0B' }}
              >
                {formData.birthdayPersonNameHi}
              </p>
            )}

            {images?.birthdayPerson && (
              <img 
                src={images.birthdayPerson} 
                alt="Birthday Person"
                className="w-32 h-32 rounded-full object-cover border-4 my-4"
                style={{ borderColor: colors?.accent || '#8B5CF6' }}
              />
            )}

            <div 
              className="space-y-2"
              style={{ 
                fontFamily: fonts?.bodyFont || 'Outfit, sans-serif',
                fontSize: `${fonts?.bodySize || 16}px`,
              }}
            >
              <p className="text-3xl font-bold" style={{ color: colors?.accent }}>
                {formData?.age ? `Turning ${formData.age}!` : 'Birthday Celebration'}
              </p>
              <p className="font-semibold">Join us for the party!</p>
              <p>{formData?.partyDate || 'Date'} at {formData?.partyTime || 'Time'}</p>
              <p>{formData?.venue || 'Venue'}</p>
              <p className="text-sm">{formData?.address || 'Address'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(150, zoom + 10))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className={`overflow-auto custom-scrollbar ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        <PreviewContent />
      </Card>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
          <PreviewContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitationPreview;