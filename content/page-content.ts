export const pagesContent = [
  {
    name: 'home',
    sections: {
      hero: {
        tagline: { type: 'richtext', value: { ar: '', en: '' } },
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'input', value: { ar: '', en: '' } },
        sliderItems: {
          type: 'items',
          value: [],
          maxValue: 'unlimited' as const,
        },
        expectedFields: ['title', 'caption', 'label', 'image'],
      },
      intro: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        callToAction: { type: 'input', value: { ar: '', en: '' } },
      },
      partners: {
        title: { type: 'input', value: { ar: '', en: '' } },
        logos: { type: 'images', value: [], maxValue: 'unlimited' as const },
      },
      overview: {
        yearsOfExcellence: { type: 'number', value: '' },
        projects: { type: 'number', value: '' },
        housingUnits: { type: 'number', value: '' },
        provinces: { type: 'number', value: '' },
      },
      companyOverview: {
        items: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['icon', 'title', 'caption'],
      },
      projectSlider: {
        items: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['location', 'area', 'video', 'link'],
      },
      about: {
        title: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'textarea', value: { ar: '', en: '' } },
        callToAction: { type: 'input', value: { ar: '', en: '' } },
        image: { type: 'image', value: '' },
      },
      callToAction: {
        title: { type: 'richtext', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
        buttonText: { type: 'input', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'about',
    sections: {
      hero: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        image: { type: 'image', value: '' },
        button1: { type: 'input', value: { ar: '', en: '' } },
        button2: { type: 'input', value: { ar: '', en: '' } },
        counters: { type: 'items', value: [], maxValue: 'unlimited' as const },
      },
      plan: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        steps: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['title', 'caption', 'label'],
      },
      overview: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        ourMissionTitle: { type: 'input', value: { ar: '', en: '' } },
        ourMissionCaption: { type: 'textarea', value: { ar: '', en: '' } },
        ourVisionTitle: { type: 'input', value: { ar: '', en: '' } },
        ourVisionCaption: { type: 'textarea', value: { ar: '', en: '' } },
        coreValuesTitle: { type: 'input', value: { ar: '', en: '' } },
        coreValuesCaption: { type: 'richtext', value: { ar: '', en: '' } },
      },
      team: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'projects',
    sections: {
      hero: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        image: { type: 'image', value: '' },
        button: { type: 'input', value: { ar: '', en: '' } },
      },
      projects: {
        badge: { type: 'input', value: { ar: '', en: '' } },
        headline: { type: 'input', value: { ar: '', en: '' } },
      },
      gallery: {
        images: { type: 'images', value: [], maxValue: 'unlimited' as const },
      },
    },
  },
  {
    name: 'services',
    sections: {
      hero: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        images: { type: 'images', value: [], maxValue: 'unlimited' as const },
      },
      services: {
        items: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['icon', 'title', 'caption'],
        maxItems: 'unlimited' as const,
      },
      overview: {
        totalProjects: { type: 'number', value: '' },
        yearsOfExperience: { type: 'number', value: '' },
        happyCustomers: { type: 'number', value: '' },
        provinces: { type: 'number', value: '' },
        caption: { type: 'textarea', value: { ar: '', en: '' } },
        image1: { type: 'image', value: { url: '', fileId: '' } },
        image2: { type: 'image', value: { url: '', fileId: '' } },
      },
      callToAction: {
        caption: { type: 'textarea', value: { ar: '', en: '' } },
        button: { type: 'input', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'partners',
    sections: {
      hero: {
        headline: { type: 'richtext', value: { ar: '', en: '' } },
        caption: { type: 'textarea', value: { ar: '', en: '' } },
        button: { type: 'input', value: { ar: '', en: '' } },
      },
      whyPartnerWithUs: {
        reasons: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['icon', 'title', 'caption'],
      },
      partnershipTypes: {
        badge: { type: 'input', value: { ar: '', en: '' } },
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'textarea', value: { ar: '', en: '' } },
        button: { type: 'input', value: { ar: '', en: '' } },
        types: { type: 'items', value: [], maxValue: 'unlimited' as const },
        expectedFields: ['icon', 'title', 'caption'],
      },
      callToAction: {
        badge: { type: 'input', value: { ar: '', en: '' } },
        title: { type: 'richtext', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
      },
      urukCityCampigns: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        image: { type: 'image', value: '' },
        campigns: { type: 'items', value: [], maxValue: 'unlimited' as const },
        residentialUnitsPlanned: { type: 'number', value: '' },
      },
      clients: {
        headline: { type: 'input', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'news & media',
    sections: {
      callToAction: {
        value: { type: 'richtext', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'careers',
    sections: {
      hero: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        subheadline: { type: 'input', value: { ar: '', en: '' } },
      },
      jobs: {
        tagline: { type: 'input', value: { ar: '', en: '' } },
        title: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
      },
      benefits: {
        tagline: { type: 'input', value: { ar: '', en: '' } },
        title: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
        benefitsList: {
          type: 'items',
          value: [],
          maxValue: 'unlimited' as const,
        },
      },
      callToAction: {
        title: { type: 'richtext', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
      },
    },
  },
  {
    name: 'contact',
    sections: {
      header: {
        title: { type: 'input', value: { ar: '', en: '' } },
        subtitle: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'textarea', value: { ar: '', en: '' } },
      },
      contactInformation: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'richtext', value: { ar: '', en: '' } },
        email: '',
        location: { type: 'input', value: { ar: '', en: '' } },
        instagram: '',
        linkedin: '',
      },
      footer: {
        headline: { type: 'input', value: { ar: '', en: '' } },
        caption: { type: 'textarea', value: { ar: '', en: '' } },
        projects: { type: 'items', value: [], maxValue: 'unlimited' as const },
        headOffice: {
          title: { type: 'input', value: { ar: '', en: '' } },
          address: { type: 'input', value: { ar: '', en: '' } },
          phoneNumber: '',
          email: '',
          website: '',
          facebook: '',
          instagram: '',
          whatsapp: '',
          youtube: '',
        },
      },
    },
  },
];
