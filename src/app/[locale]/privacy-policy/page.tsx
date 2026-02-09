import LegalLayout from "@/components/LegalLayout";
import { useTranslations, useFormatter } from "next-intl";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | Gayatri Pariwar Bhiwandi",
    description: "Privacy policy outlining how we handle user information.",
};

export default function PrivacyPolicy() {
    const t = useTranslations('legal.privacy');
    const tLegal = useTranslations('legal');
    const format = useFormatter();

    const lastUpdatedDate = new Date('2026-02-04');
    const formattedDate = format.dateTime(lastUpdatedDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <LegalLayout title={tLegal('privacy_title')} lastUpdated={formattedDate}>
            <p className="lead text-xl text-slate-600 dark:text-slate-400 mb-8 font-serif">
                {t('lead')}
            </p>

            <h2>{t('collect_title')}</h2>
            <p>
                {t('collect_text')}
            </p>
            <ul>
                <li><strong>{t('collect_list_1_title')}</strong>{t('collect_list_1_text')}</li>
                <li><strong>{t('collect_list_2_title')}</strong>{t('collect_list_2_text')}</li>
            </ul>

            <h2>{t('usage_title')}</h2>
            <p>
                {t('usage_text')}
            </p>
            <ul>
                <li>{t('usage_list_1')}</li>
                <li>{t('usage_list_2')}</li>
                <li>{t('usage_list_3')}</li>
            </ul>

            <h2>{t('cookies_title')}</h2>
            <p>
                {t('cookies_text')}
            </p>
            <ul>
                <li>{t('cookies_list_1')}</li>
                <li>{t('cookies_list_2')}</li>
            </ul>
            <p>{t('cookies_note')}</p>

            <h2>{t('embedded_title')}</h2>
            <p>
                {t('embedded_text')}
            </p>

            <h2>{t('security_title')}</h2>
            <p>
                {t('security_text')}
            </p>
        </LegalLayout>
    );
}
