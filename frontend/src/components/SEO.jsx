import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SEO({ 
    title = 'Zymerce - E-Commerce Store', 
    description = 'Shop the best electronics, headphones, furniture, and beauty products at Zymerce. Free shipping, 30-day returns, and secure payments.',
    keywords = 'e-commerce, online shopping, electronics, headphones, furniture, beauty products, India',
    image = '/og-image.jpg',
    type = 'website'
}) {
    const location = useLocation();
    const url = `https://zymerce.com${location.pathname}`;

    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta tags
        updateMetaTag('description', description);
        updateMetaTag('keywords', keywords);

        // Open Graph tags
        updateMetaTag('og:title', title, 'property');
        updateMetaTag('og:description', description, 'property');
        updateMetaTag('og:image', image, 'property');
        updateMetaTag('og:url', url, 'property');
        updateMetaTag('og:type', type, 'property');

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image', 'name');
        updateMetaTag('twitter:title', title, 'name');
        updateMetaTag('twitter:description', description, 'name');
        updateMetaTag('twitter:image', image, 'name');

        // Canonical URL
        updateCanonicalLink(url);
    }, [title, description, keywords, image, url, type]);

    const updateMetaTag = (name, content, attribute = 'name') => {
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }
        
        element.setAttribute('content', content);
    };

    const updateCanonicalLink = (href) => {
        let element = document.querySelector('link[rel="canonical"]');
        
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', 'canonical');
            document.head.appendChild(element);
        }
        
        element.setAttribute('href', href);
    };

    return null;
}

export default SEO;
