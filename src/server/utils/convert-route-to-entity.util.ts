const mapping: Record<string, string> = {
  'emergency-responders': 'emergency_responder',
  'healthcare-professionals': 'healthcare_professional',
  'medical-educators': 'medical_educator',
  renamedpublics: 'Renamedpublic',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
