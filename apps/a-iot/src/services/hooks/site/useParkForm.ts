import { useState } from 'react';
import type { Site, SiteCreateRequest } from '../../types/site/site.ts';

export function useParkForm() {
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

    const setFormFromPark = (park: Site) => {
        setFormData({
            name: park.name,
            location: park.location,
            description: park.description
        });
    };

    const updateFormField = (field: keyof SiteCreateRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        resetForm,
        setFormFromPark,
        updateFormField
    };
}