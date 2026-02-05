"use server";

export type GenerateLogoInput = {
  business_name: string;
  business_type: string;
  style: string;
  color_scheme: string;
  additional_elements: string;
};

export async function generateLogo(input: GenerateLogoInput) {
  const webhookUrl = process.env.WEBHOOK_URL ?? "";
  const body = {
    model: "logo-generator",
    input: {
      business_name: input.business_name,
      business_type: input.business_type,
      style: input.style,
      color_scheme: input.color_scheme,
      additional_elements: input.additional_elements,
    },
    webhook: webhookUrl,
  };

  const res = await fetch("https://api.artificialstudio.ai/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.ARTIFICIAL_STUDIO_API_KEY ?? "",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}
