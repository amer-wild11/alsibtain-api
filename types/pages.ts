type InputField = {
  type: 'input';
  value: {
    ar: string;
    en: string;
  };
};

type IconField = {
  type: 'icon';
  value: string;
};

type TextareaField = {
  type: 'textarea';
  value: {
    ar: string;
    en: string;
  };
};

type NumberField = {
  type: 'number';
  value: string;
};

type ImageField = {
  type: 'image';
  value: string;
};

type VideoField = {
  type: 'video';
  value: string;
};

type RichTextField = {
  type: 'richtext';
  value: {
    ar: string;
    en: string;
  };
};

type ItemField<T> = {
  type: 'items';
  value: T[];
  maxValue: number | 'unlimited';
};

type ImagesField<T> = {
  type: 'images';
  value: T[];
  maxValue: number | 'unlimited';
};

type VideosField<T> = {
  type: 'videos';
  value: T[];
  maxValue: number | 'unlimited';
};

type FileField = {
  type: 'file';
  value: string;
};

type FilesField<T> = {
  type: 'files';
  value: T[];
  maxValue: number | 'unlimited';
};

type BooleanField = {
  type: 'boolean';
  value: boolean;
};

type DateField = {
  type: 'date';
  value: string;
};

type SelectField = {
  type: 'select';
  value: string;
  options: { ar: string; en: string }[];
};

type MultiSelectField = {
  type: 'multi-select';
  value: string[];
  options: { ar: string; en: string }[];
};

export type HomePageContent = {
  name: 'home';
  sections: {
    hero: {
      tagline: InputField;
      headline: RichTextField;
      subheadline: InputField;
      sliderItems: ItemField<{
        title: InputField;
        caption: TextareaField;
        image: ImageField;
        label: InputField;
      }>;
      expectedFields: string[];
    };
    intro: {
      headline: InputField;
      subheadline: TextareaField;
      callToAction: InputField;
    };
    partners: {
      title: InputField;
      logos: ImagesField<string[]>;
    };
    overview: {
      yearsOfExcellence: NumberField;
      projects: NumberField;
      housingUnits: NumberField;
      provinces: NumberField;
    };
    companyOverview: {
      items: ItemField<{
        icon: IconField;
        title: InputField;
        caption: InputField;
      }>;
      expectedFields: string[];
    };
    projectSlider: {
      items: ItemField<{
        location: InputField;
        area: InputField;
        video: VideoField;
        link?: InputField;
      }>;
      expectedFields: string[];
    };
    about: {
      title: InputField;
      caption: TextareaField;
      callToAction: InputField;
      image: ImageField;
    };
    callToAction: {
      title: RichTextField;
      caption: RichTextField;
      buttonText: InputField;
    };
  };
};

export type AboutPageContent = {
  name: 'about';
  sections: {
    hero: {
      headline: InputField;
      subheadline: TextareaField;
      image: ImageField;
      button1: InputField;
      button2: InputField;
      counters: ItemField<{ title: InputField; count: NumberField }>;
    };
    plan: {
      headline: InputField;
      subheadline: TextareaField;
      steps: ItemField<{
        title: InputField;
        caption: TextareaField;
        label: InputField;
      }>;
      expectedFields: string[];
    };
    overview: {
      headline: InputField;
      subheadline: TextareaField;
      ourMissionTitle: InputField;
      ourMissionCaption: TextareaField;
      ourVisionTitle: InputField;
      ourVisionCaption: TextareaField;
      coreValuesTitle: InputField;
      coreValuesCaption: RichTextField;
    };
    team: {
      headline: InputField;
      subheadline: TextareaField;
    };
  };
};

export type ProjectsPageContent = {
  name: 'projects';
  sections: {
    hero: {
      headline: InputField;
      subheadline: TextareaField;
      image: ImageField;
      button: InputField;
    };
    projects: {
      badge: InputField;
      headline: InputField;
    };
    gallery: {
      images: ImagesField<{ fileId: string; url: string }[]>;
    };
  };
};

export type ServicesPageContent = {
  name: 'services';
  sections: {
    hero: {
      headline: InputField;
      subheadline: TextareaField;
      images: ImagesField<{ fileId: string; url: string }[]>;
    };
    services: {
      items: ItemField<{
        icon: IconField;
        title: InputField;
        caption: TextareaField;
      }>;
      expectedFields: string[];
      maxItems: 'unlimited';
    };
    overview: {
      totalProjects: NumberField;
      yearsOfExperience: NumberField;
      happyCustomers: NumberField;
      provinces: NumberField;
      caption: TextareaField;
      image1: ImageField;
      image2: ImageField;
    };
    callToAction: {
      caption: TextareaField;
      button: InputField;
    };
  };
};

export type PortfolioPageContent = {
  name: 'partners';
  sections: {
    hero: {
      headline: RichTextField;
      caption: TextareaField;
      button: InputField;
    };
    whyPartnerWithUs: {
      reasons: ItemField<{
        icon: IconField;
        title: InputField;
        caption: TextareaField;
      }>;
      expectedFields: string[];
    };
    partnershipTypes: {
      badge: InputField;
      headline: InputField;
      subheadline: TextareaField;
      button: InputField;
      types: ItemField<{
        icon: IconField;
        title: InputField;
        caption: TextareaField;
      }>;
      expectedFields: string[];
    };
    callToAction: {
      badge: InputField;
      title: RichTextField;
      caption: RichTextField;
    };
    urukCityCampigns: {
      headline: InputField;
      image: ImageField;
      campigns: ItemField<{
        title: InputField;
        caption: TextareaField;
        tags: ItemField<InputField>;
      }>;
      residentialUnitsPlanned: NumberField;
    };
    clients: {
      headline: InputField;
    };
  };
};

export type ContactPageContent = {
  name: 'news & media';
  sections: {
    callToAction: {
      value: RichTextField;
    };
  };
};

export type StudioRentalPageContent = {
  name: 'careers';
  sections: {
    hero: {
      headline: InputField;
      subheadline: InputField;
    };
    jobs: {
      tagline: InputField;
      title: InputField;
      caption: RichTextField;
    };
    benefits: {
      tagline: InputField;
      title: InputField;
      caption: RichTextField;
      benefitsList: ItemField<{
        icon: IconField;
        title: InputField;
        caption: TextareaField;
      }>;
    };
    callToAction: {
      title: RichTextField;
      caption: RichTextField;
    };
  };
};

export type PropsRentalPageContent = {
  name: 'contact';
  sections: {
    header: {
      title: InputField;
      subtitle: InputField;
      caption: TextareaField;
    };
    contactInformation: {
      headline: InputField;
      caption: RichTextField;
      email: InputField;
      location: InputField;
      instagram: InputField;
      linkedin: InputField;
    };
    footer: {
      headline: InputField;
      caption: TextareaField;
      projects: ItemField<{ name: InputField }>;
      headOffice: {
        title: InputField;
        address: InputField;
        phoneNumber: string;
        email: string;
        website: string;
        facebook: string;
        instagram: string;
        whatsapp: string;
        youtube: string;
      };
    };
  };
};

export type PageContent =
  | HomePageContent
  | AboutPageContent
  | ServicesPageContent
  | PortfolioPageContent
  | ContactPageContent
  | StudioRentalPageContent
  | PropsRentalPageContent;
