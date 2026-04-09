/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_EMAILJS_SERVICE_ID?: string;
  readonly PUBLIC_EMAILJS_PUBLIC_KEY?: string;
  readonly PUBLIC_EMAILJS_OWNER_TEMPLATE_ID?: string;
  readonly PUBLIC_EMAILJS_USER_TEMPLATE_ID?: string;
  readonly PUBLIC_EMAILJS_TO_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
