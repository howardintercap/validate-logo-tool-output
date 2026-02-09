"use client";

import { useState } from "react";
import { generateLogo } from "../actions";
import "./logo-page.css";

const logoStyles = [
    "Modern",
    "Minimalist",
    "Vintage/Retro",
    "Abstract",
    "Geometric",
    "Illustrative",
    "3D",
    "Mascot",
    "Flat Design",
];

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const MOCK_RESPONSES = Array.from({ length: 4 }, (_, index) => ({
    id: `mock-${index + 1}`,
    status: "success",
    output: "https://files.artificialstudio.ai/6c197443-49d0-4c01-a333-f25e33d1978b.png",
    model: "logo-generator",
    type: "image",
    payload: {
        business_name: "intercap",
        business_type: "business",
        style: "Minimalist",
        color_scheme: "red and purple",
        additional_elements: "add a cat",
        image_size: "1024x1024",
    },
}));

function getImageUrl(data: Record<string, unknown> | null): string | null {
    const out = data?.output;
    return typeof out === "string" ? out : null;
}

export default function Home() {
    const [businessName, setBusinessName] = useState("");
    const [industry, setIndustry] = useState("");
    const [logoStyle, setLogoStyle] = useState("");
    const [colorScheme, setColorScheme] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [logoUrls, setLogoUrls] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    function pollResult(expectedCount: number) {
        let attempts = 0;
        const maxAttempts = 60;
        const seenIds = new Set<string>();
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await fetch("/api/result");
                const data = await res.json();
                const id = data?.id;
                const url = getImageUrl(data);
                if (url && id && !seenIds.has(id)) {
                    seenIds.add(id);
                    setLogoUrls((prev) => [...prev, url]);
                    if (seenIds.size >= expectedCount) {
                        setIsGenerating(false);
                        clearInterval(interval);
                        return;
                    }
                }
            } catch {
                // ignore
            }
            if (attempts >= maxAttempts) {
                setIsGenerating(false);
                clearInterval(interval);
            }
        }, 2000);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLogoUrls([]);
        setIsGenerating(true);
        const input = {
            business_name: businessName,
            business_type: industry,
            style: logoStyle,
            color_scheme: colorScheme,
            additional_elements: additionalDetails,
        };
        try {
            const data = USE_MOCK_API
                ? MOCK_RESPONSES
                : await Promise.all([
                    generateLogo(input),
                    generateLogo(input),
                    generateLogo(input),
                    generateLogo(input),
                ]);
            const items = Array.isArray(data) ? data : data ? [data] : [];
            const urls = items.map(getImageUrl).filter((u): u is string => !!u);
            if (urls.length === 4) {
                setLogoUrls(urls);
                setIsGenerating(false);
            } else {
                pollResult(4 - urls.length);
            }
        } catch {
            setIsGenerating(false);
        }
    }

    return (
        <main className="logo-page">
            <div className="logo-page__container">
                <form className="logo-page__form" onSubmit={handleSubmit}>
                    <div className="logo-page__field">
                        <label htmlFor="business-name" className="logo-page__label">
                            Business / Brand name
                        </label>
                        <input
                            id="business-name"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="logo-page__input"
                        />
                    </div>
                    <div className="logo-page__field">
                        <label htmlFor="industry" className="logo-page__label">
                            Select your industry
                        </label>
                        <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="logo-page__input"
                        />
                    </div>
                    <div className="logo-page__field">
                        <label htmlFor="logo-style" className="logo-page__label">
                            Logo style
                        </label>
                        <select
                            id="logo-style"
                            value={logoStyle}
                            onChange={(e) => setLogoStyle(e.target.value)}
                            className="logo-page__input logo-page__select"
                        >
                            <option value="">Choose a style</option>
                            {logoStyles.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div className="logo-page__field">
                        <label htmlFor="color-scheme" className="logo-page__label">
                            Color scheme
                        </label>
                        <input
                            id="color-scheme"
                            type="text"
                            value={colorScheme}
                            onChange={(e) => setColorScheme(e.target.value)}
                            className="logo-page__input"
                        />
                    </div>
                    <div className="logo-page__field">
                        <label htmlFor="additional-details" className="logo-page__label">
                            Additional details
                        </label>
                        <textarea
                            id="additional-details"
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            rows={4}
                            className="logo-page__input logo-page__textarea"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="logo-page__button"
                    >
                        {isGenerating ? "Generating…" : "Generate logo"}
                    </button>
                </form>

                {isGenerating && (
                    <p className="logo-page__status">Generating your logo…</p>
                )}
                {logoUrls.length > 0 && (
                    <div className="logo-page__result">
                        <p className="logo-page__result-title">Your logos</p>
                        <div className="logo-page__result-grid">
                            {logoUrls.map((url, index) => (
                                <img key={`${url}-${index}`} src={url} alt="Generated logo" className="logo-page__result-image" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
