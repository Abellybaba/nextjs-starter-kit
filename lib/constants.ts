import {
    Twitter, X, Instagram, Facebook, Linkedin,
    Github, Youtube, Twitch, MessageCircle,
    BookOpenCheck, MessageCircleHeart, Wallet, // Using Wallet for Whatsapp until a better icon is found
    Frame, Dribbble, Rss,
    CircleDollarSign,
    Clapperboard,
    Video, // Using Video for Vimeo
    Heart, // Using Heart for Patreon
    Coffee,
    CreditCard, // Using CreditCard for Stripe
    Store, // Using Store for Shopify
    Book,
    Calendar, NotepadText, Figma,
    Gitlab, Codepen, CaseSensitive,
    Music, // Using Music for Spotify
    Podcast,
    AppWindow,
    Mail, Phone, Globe,
    Signal, Slack, Fullscreen, Link as LinkIcon
} from 'lucide-react';
import { Template } from '@/utils/types';
import NeobrutalismTemplate from '@/components/templates/NeobrutalismTemplate';
import GlassmorphismTemplate from '@/components/templates/GlassmorphismTemplate';
import Vcard7Template from '@/components/templates/Vcard7Template';
import ModernTemplate from '@/components/templates/Modern';
import RichProfileTemplate from '@/components/templates/RichProfileTemplate';
import DeluxeTemplate from '@/components/templates/Deluxe';


export const platforms = [
    // Social
    { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username', type: 'social' },
    { name: 'X', icon: X, placeholder: 'https://x.com/username', type: 'social' },
    { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username', type: 'social' },
    { name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username', type: 'social' },
    { name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', type: 'social' },
    { name: 'GitHub', icon: Github, placeholder: 'https://github.com/username', type: 'social' },
    { name: 'TikTok', icon: Music, placeholder: 'https://tiktok.com/@username', type: 'social' }, // Using Music as a placeholder for Tiktok
    { name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/c/username', type: 'video' },
    { name: 'Twitch', icon: Twitch, placeholder: 'https://twitch.tv/username', type: 'video' },
    { name: 'Discord', icon: MessageCircle, placeholder: 'https://discord.gg/invitecode', type: 'social' },
    { name: 'Reddit', icon: BookOpenCheck, placeholder: 'https://reddit.com/user/username', type: 'social' },
    { name: 'Snapchat', icon: MessageCircle, placeholder: 'https://snapchat.com/add/username', type: 'social' }, // Using MessageCircle as a placeholder for Snapchat
    { name: 'Pinterest', icon: MessageCircleHeart, placeholder: 'https://pinterest.com/username', type: 'social' },
    { name: 'Telegram', icon: MessageCircle, placeholder: 'https://t.me/username', type: 'social' },
    { name: 'WhatsApp', icon: Wallet, placeholder: 'https://wa.me/1234567890', type: 'contact' },
    { name: 'Behance', icon: Frame, placeholder: 'https://www.behance.net/username', type: 'professional' },
    { name: 'Dribbble', icon: Dribbble, placeholder: 'https://dribbble.com/username', type: 'professional' },
    { name: 'Medium', icon: Rss, placeholder: 'https://medium.com/@username', type: 'blog' },
    { name: 'Substack', icon: Rss, placeholder: 'https://username.substack.com', type: 'blog' },
    { name: 'OnlyFans', icon: CircleDollarSign, placeholder: 'https://onlyfans.com/username', type: 'social' },
    { name: 'Clubhouse', icon: Clapperboard, placeholder: 'https://www.clubhouse.com/@username', type: 'social' },
    { name: 'Vimeo', icon: Video, placeholder: 'https://vimeo.com/username', type: 'video' },
    { name: 'Patreon', icon: Heart, placeholder: 'https://www.patreon.com/username', type: 'monetization' },
    { name: 'Kofi', icon: Coffee, placeholder: 'https://ko-fi.com/username', type: 'monetization' },
    { name: 'Buy Me a Coffee', icon: Coffee, placeholder: 'https://www.buymeacoffee.com/username', type: 'monetization' },
    { name: 'PayPal', icon: Wallet, placeholder: 'https://paypal.me/username', type: 'monetization' },
    { name: 'Cash App', icon: Wallet, placeholder: 'https://cash.app/$username', type: 'monetization' },
    { name: 'Venmo', icon: Wallet, placeholder: 'https://venmo.com/username', type: 'monetization' },
    { name: 'Stripe', icon: CreditCard, placeholder: 'https://buy.stripe.com/your-link', type: 'monetization' },
    { name: 'Shopify', icon: Store, placeholder: 'https://your-store.myshopify.com', type: 'e-commerce' },
    { name: 'Etsy', icon: Store, placeholder: 'https://www.etsy.com/shop/yourshop', type: 'e-commerce' },
    { name: 'Gumroad', icon: Book, placeholder: 'https://username.gumroad.com', type: 'e-commerce' },
    { name: 'Calendly', icon: Calendar, placeholder: 'https://calendly.com/username', type: 'contact' },
    { name: 'Notion', icon: NotepadText, placeholder: 'https://your-workspace.notion.site/your-page', type: 'professional' },
    { name: 'Figma', icon: Figma, placeholder: 'https://www.figma.com/@username', type: 'professional' },
    { name: 'GitLab', icon: Gitlab, placeholder: 'https://gitlab.com/username', type: 'professional' },
    { name: 'Codepen', icon: Codepen, placeholder: 'https://codepen.io/username', type: 'professional' },
    { name: 'Stack Overflow', icon: CaseSensitive, placeholder: 'https://stackoverflow.com/users/userid/username', type: 'professional' },

    // Music
    { name: 'Spotify', icon: Music, placeholder: 'https://open.spotify.com/artist/your-id', type: 'music' },
    { name: 'Apple Music', icon: Music, placeholder: 'https://music.apple.com/us/artist/your-name/your-id', type: 'music' },
    { name: 'SoundCloud', icon: Music, placeholder: 'https://soundcloud.com/username', type: 'music' },
    { name: 'Bandcamp', icon: Music, placeholder: 'https://username.bandcamp.com', type: 'music' },
    { name: 'Tidal', icon: Music, placeholder: 'https://tidal.com/browse/artist/your-id', type: 'music' },
    { name: 'YouTube Music', icon: Youtube, placeholder: 'https://music.youtube.com/channel/your-id', type: 'music' },
    { name: 'Deezer', icon: Music, placeholder: 'https://www.deezer.com/en/artist/your-id', type: 'music' },
    { name: 'Amazon Music', icon: Store, placeholder: 'https://music.amazon.com/artists/your-id', type: 'music' },
    { name: 'Apple Podcasts', icon: Podcast, placeholder: 'https://podcasts.apple.com/us/podcast/your-podcast/id-your-id', type: 'music' },
    { name: 'Google Podcasts', icon: Podcast, placeholder: 'https://podcasts.google.com/feed/your-feed-url', type: 'music' },

    // App Stores
    { name: 'App Store', icon: AppWindow, placeholder: 'https://apps.apple.com/us/app/your-app/id-your-id', type: 'app' },
    { name: 'Google Play', icon: AppWindow, placeholder: 'https://play.google.com/store/apps/details?id=com.your.app', type: 'app' },

    // Contact
    { name: 'Email', icon: Mail, placeholder: 'mailto:hello@example.com', type: 'contact' },
    { name: 'Phone', icon: Phone, placeholder: 'tel:+1234567890', type: 'contact' },
    { name: 'Website', icon: Globe, placeholder: 'https://example.com', type: 'contact' },
    { name: 'Signal', icon: Signal, placeholder: 'https://signal.me/#p/+1234567890', type: 'contact' },
    { name: 'Slack', icon: Slack, placeholder: 'https://your-workspace.slack.com/team/your-user-id', type: 'contact' },
    { name: 'Zoom', icon: Fullscreen, placeholder: 'https://zoom.us/j/your-meeting-id', type: 'contact' },

    // Generic
    { name: 'Generic Link', icon: LinkIcon, placeholder: 'https://example.com', type: 'generic' },
];

export const linkTypes = [
    {
        title: 'Social',
        links: platforms.filter(p => p.type === 'social')
    },
    {
        title: 'Music & Podcasts',
        links: platforms.filter(p => p.type === 'music')
    },
    {
        title: 'Video',
        links: platforms.filter(p => p.type === 'video')
    },
    {
        title: 'Professional',
        links: platforms.filter(p => p.type === 'professional')
    },
    {
        title: 'Blog',
        links: platforms.filter(p => p.type === 'blog')
    },
    {
        title: 'Monetization & E-commerce',
        links: platforms.filter(p => p.type === 'monetization' || p.type === 'e-commerce')
    },
    {
        title: 'App Stores',
        links: platforms.filter(p => p.type === 'app')
    },
    {
        title: 'Contact',
        links: platforms.filter(p => p.type === 'contact')
    },
];

export const templates: Template[] = [
    {
        name: 'Rich Profile',
        component: RichProfileTemplate,
        type: 'VCARD',
        image: 'data:image/jpeg;base64,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',
    },
    {
        name: 'Deluxe',
        component: DeluxeTemplate,
        type: 'VCARD',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    },
    {
        name: 'Neobrutalism',
        component: NeobrutalismTemplate,
        type: 'VLINK',
        image: 'https://plus.unsplash.com/premium_photo-1664443577580-dd2674e9d359?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    },
    {
        name: 'Glassmorphism',
        component: GlassmorphismTemplate,
        type: 'VLINK',
        image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    },
    {
        name: 'V-Card',
        component: Vcard7Template,
        type: 'VLINK',
        image: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
    },
    {
        name: 'Modern',
        component: ModernTemplate,
        type: 'VLINK',
        image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D',
    },
];
