import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const InvitationTemplateSelector = ({ templates, selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
        <p className="text-sm text-muted-foreground">Select a design to get started</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`invitation-template-card cursor-pointer overflow-hidden transition-all ${
              selectedTemplate?.id === template.id ? 'selected ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-muted/50">
              {template.previewImage ? (
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: template.colors?.primary || '#f0f0f0' }}
                >
                  <span className="text-2xl font-bold text-white opacity-50">
                    {template.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvitationTemplateSelector;