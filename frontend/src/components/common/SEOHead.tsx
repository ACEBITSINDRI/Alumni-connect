import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Alumni Connect - BIT Sindri Dhanbad | Civil Engineering Alumni Network',
  description = 'Official Alumni Network of Department of Civil Engineering, BIT Sindri Dhanbad. Connect with 1,250+ Civil Engineering Alumni from Birla Institute of Technology Sindri. Find mentorship, jobs, events, and networking opportunities.',
  keywords = 'BIT Sindri, BIT Dhanbad, Birla Institute of Technology Sindri, Civil Engineering Alumni, ACE BIT Sindri, BIT Sindri Alumni, Engineering College Dhanbad, Top Engineering Colleges Jharkhand, Civil Engineering Department, Alumni Network India, BIT Sindri Placement, Civil Engineering Jobs, Engineering Mentorship, Alumni Association, Civil Engineering Career, BIT Sindri Students, Engineering Alumni Network, Dhanbad Engineering College, Civil Engineering BIT, BIT Sindri Civil Department, Alumni Mentorship Program, Engineering Jobs India, BIT Alumni Association, Civil Engineering Networking, Top Civil Engineers India, BIT Sindri Alumni Directory, Engineering Career Guidance, Civil Engineering Placements, BIT Sindri Events, Alumni Success Stories, Engineering Student Network, Civil Engineering Research, BIT Sindri Faculty, Alumni Reunion, Engineering Community India, Civil Engineering Companies, Infrastructure Projects India, Construction Industry Jobs, Structural Engineering, Geotechnical Engineering, Transportation Engineering, Environmental Engineering, Water Resources Engineering, Building Technology, Concrete Technology, Steel Structures, Foundation Engineering, Highway Engineering, Railway Engineering, Bridge Engineering, Dam Engineering, Coastal Engineering, Urban Planning, Project Management Civil, Construction Management, Quantity Surveying, AutoCAD Civil, STAAD Pro, Revit Architecture, Civil 3D, Building Information Modeling, Sustainable Construction, Green Building, Smart Cities India, Infrastructure Development, Engineering Consultancy, L&T Careers, TATA Projects Jobs, Shapoorji Pallonji, ACC Cement, Ultratech Cement, NBCC India, RITES Limited, Indian Railways Civil, CPWD Jobs, PWD Jharkhand, Engineering PSU Jobs, GATE Civil Engineering, ESE Civil Engineering, IES Preparation, Civil Services Engineering, PSC Engineering Posts, UPSC Engineering, SSC JE Civil, State PSC Civil, Engineering Competitive Exams',
  image = '/og-image-alumni-connect.jpg',
  url = 'https://alumni-connect.bitsindri.ac.in',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  noindex = false,
}) => {
  const siteName = 'Alumni Connect - ACE BIT Sindri';
  const twitterHandle = '@ACEBITSindri';

  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Alumni Association of Civil Engineering - BIT Sindri',
    alternateName: 'ACE BIT Sindri',
    url: 'https://alumni-connect.bitsindri.ac.in',
    logo: 'https://alumni-connect.bitsindri.ac.in/logo.png',
    description: 'Official Alumni Network of Department of Civil Engineering, Birla Institute of Technology Sindri, Dhanbad, Jharkhand',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BIT Sindri Campus',
      addressLocality: 'Sindri',
      addressRegion: 'Jharkhand',
      postalCode: '828123',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-6542-XXXXXX',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://www.facebook.com/ACEBITSindri',
      'https://twitter.com/ACEBITSindri',
      'https://www.linkedin.com/company/ace-bit-sindri',
      'https://www.instagram.com/acebit_sindri',
    ],
    alumni: {
      '@type': 'AlumniAssociation',
      name: 'ACE BIT Sindri Alumni Network',
      numberOfMembers: '1250+',
    },
    department: {
      '@type': 'Organization',
      name: 'Department of Civil Engineering',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'Birla Institute of Technology Sindri',
        alternateName: 'BIT Sindri',
      },
    },
  };

  // Structured Data for Website
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: url,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || 'ACE BIT Sindri'} />
      <link rel="canonical" href={url} />

      {/* Robots Meta */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ea580c" />
      <meta name="msapplication-TileColor" content="#ea580c" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />

      {/* Geographic Tags for Local SEO */}
      <meta name="geo.region" content="IN-JH" />
      <meta name="geo.placename" content="Sindri, Dhanbad, Jharkhand" />
      <meta name="geo.position" content="23.6844;86.4489" />
      <meta name="ICBM" content="23.6844, 86.4489" />

      {/* Language */}
      <meta httpEquiv="content-language" content="en-IN" />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead;
