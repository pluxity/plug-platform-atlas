import { useState } from 'react';
import type { Site, SiteCreateRequest } from '../../../../../services/types/site.ts';

export function useSiteForm() {
    const [formData, setFormData] = useState<SiteCreateRequest>({
        name: '',
        location: '',
        description: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            description: ''
        });
    };

    const setFormFromSite = (site: Site) => {
        setFormData({
            name: site.name,
            location: site.location,
            description: site.description
        });
    };

    const updateFormField = (field: keyof SiteCreateRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        resetForm,
        setFormFromSite,
        updateFormField
    };
}