/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const categories = [
    { name: 'Finance', slug: 'finance', icon: 'DollarSign' },
    { name: 'Career', slug: 'career', icon: 'Briefcase' },
    { name: 'Image', slug: 'image', icon: 'Image' },
    { name: 'Document', slug: 'document', icon: 'FileText' },
    { name: 'PDF', slug: 'pdf', icon: 'FileCheck' },
    { name: 'Developer Tools', slug: 'developer', icon: 'Code' },
    { name: 'Generators', slug: 'generators', icon: 'Zap' },
    { name: 'Science', slug: 'science', icon: 'FlaskConical' },
    { name: 'Productivity', slug: 'productivity', icon: 'CheckCircle' },
    { name: 'Converters', slug: 'converters', icon: 'RefreshCw' },
    { name: 'Real Estate', slug: 'real-estate', icon: 'Home' },
    { name: 'Invitations', slug: 'invitations', icon: 'Mail' }
  ];

  const collection = app.findCollectionByNameOrId("categories");

  categories.forEach((cat, index) => {
    const record = new Record(collection, {
      id: "cat" + Math.random().toString(36).substring(2, 14).padEnd(12, '0'),
      ...cat,
      order: index,
      is_active: true
    });
    app.save(record);
  });
}, (app) => {
  // Revert logic
})
