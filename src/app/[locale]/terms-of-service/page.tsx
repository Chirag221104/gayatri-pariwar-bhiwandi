import LegalLayout from "@/components/LegalLayout";
import { useTranslations, useFormatter } from "next-intl";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | Gayatri Pariwar Bhiwandi",
    description: "Terms of service and usage guidelines for the Gayatri Pariwar Bhiwandi website.",
};

export default function TermsOfService() {
    const t = useTranslations('legal.terms');
    const common = useTranslations('common');
    const tLegal = useTranslations('legal');
    const format = useFormatter();

    const lastUpdatedDate = new Date('2026-02-04');
    const formattedDate = format.dateTime(lastUpdatedDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <LegalLayout title={tLegal('terms_title')} lastUpdated={formattedDate}>
            <p className="lead text-xl text-slate-600 dark:text-slate-400 mb-8 border-l-4 border-saffron pl-4 italic">
                {t('lead')}
            </p>

            <h2>{t('intro_title')}</h2>
            <p>
                {useTranslations('legal.terms')('intro_text', { brand: common('brand') })}
            </p>

            <h2>{t('ip_title')}</h2>
            <p>
                {t('ip_text')}
            </p>
            <ul>
                <li><strong>{t('ip_list_1_title')}</strong>{t('ip_list_1_text')}</li>
                <li><strong>{t('ip_list_2_title')}</strong>{t('ip_list_2_text')}</li>
                <li><strong>{t('ip_list_3_title')}</strong>{t('ip_list_3_text')}</li>
            </ul>

            <h2>{t('guidelines_title')}</h2>
            <p>
                {t('guidelines_text')}
            </p>
            <ul>
                <li>{t('guidelines_list_1')}</li>
                <li>{t('guidelines_list_2')}</li>
                <li>{t('guidelines_list_3')}</li>
            </ul>

            <h2>{t('liability_title')}</h2>
            <p>
                {t('liability_text')}
            </p>

            <h2>{t('governance_title')}</h2>
            <p>
                {t('governance_text')}
            </p>
        </LegalLayout>
    );
}
