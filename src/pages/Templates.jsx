import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createInquiry } from "../admin/inquiries";

const CUSTOM_PALETTE_KEY = "custom";

const PAGE_COPY_BY_LANGUAGE = {
  en: {
    eyebrow: "Template Studio",
    headline: "Build the page structure before design debt starts.",
    copy:
      "This is a storefront-style template lab, not the configurator itself. Choose a template direction, swap palettes, add or reorder sections, and shape the full page experience the way a premium Shopify theme builder would.",
    builderLabel: "Theme Controls",
    builderTitle: "Set sections, styling, and template direction",
    builderCopy:
      "Use presets to establish a starting point, then compose the page section by section and preview the final storefront live.",
    previewLabel: "Live Storefront",
    previewTitle: "A full-page template preview, not just a block map",
    previewCopy:
      "Every section in the list is reflected on the right so you can judge pacing, hierarchy, and mood like a real template marketplace.",
    primaryAction: "Start a project",
    secondaryAction: "See pricing",
    metrics: {
      activeSections: "Active sections",
      currentPalette: "Current palette",
      previewMode: "Preview mode",
    },
    controls: {
      presets: "Template presets",
      palettes: "Color palettes",
      activeSections: "Active sections",
      inFlow: "in page flow",
      library: "Section library",
      addToPage: "Add to the page",
      inspector: "Section inspector",
      overview: "Overview",
      customPalette: "Custom Palette",
      customPaletteCopy: "Use your own canvas, page, surface, text, and accent colors.",
      canvas: "Canvas",
      page: "Page",
      surface: "Surface",
      text: "Text",
      accent: "Accent",
      useCustom: "Use custom palette",
      resetPreset: "Reset from preset",
      up: "Up",
      down: "Down",
      remove: "Del",
      desktop: "Desktop",
      mobile: "Mobile",
    },
    summary: {
      eyebrow: "Current Theme DNA",
      title: "Why this template works",
      copy:
        "The preset controls the overall pacing, the palette controls the mood, and the section stack shapes the full journey. That gives the page a clearer identity before UI polish starts.",
      presetIdentity: "Preset identity",
      colorDirection: "Color direction",
      selectedSection: "Selected section",
      sectionsInFlow: "Sections in flow",
    },
    save: {
      eyebrow: "Send This Design",
      title: "Send the template to Configuro",
      copy:
        "We'll receive a compact PNG preview together with the palette, preset, section order, and your short note.",
      fullName: "Name",
      email: "Email",
      company: "Company",
      note: "Project note",
      placeholders: {
        fullName: "Alex Morgan",
        email: "alex@company.com",
        company: "Studio or brand",
        note: "Tell us what you like about this direction or what should change next.",
      },
      download: "Save PNG",
      submit: "Send design",
      sending: "Preparing PNG...",
      successTitle: "Design sent",
      successCopy: "The template summary and PNG preview were saved to the inbox.",
    },
    preview: {
      pathBase: "configuro.studio/templates",
      brand: "Configuro Themes",
      footerNote: "Template system built for premium product storytelling.",
    },
  },
  az: {
    eyebrow: "Şablon Studiyası",
    headline: "Dizayn borcu başlamadan səhifə strukturunu qurun.",
    copy:
      "Bu, konfiquratorun özü deyil, storefront tipli şablon laboratoriyasıdır. İstiqaməti seçin, palitranı dəyişin, bölmələri əlavə edib sıralayın və tam səhifə təcrübəsini premium Shopify tərzi kimi formalaşdırın.",
    builderLabel: "Tema İdarəsi",
    builderTitle: "Bölmələri, üslubu və şablon istiqamətini qurun",
    builderCopy:
      "Preset ilə başlanğıc nöqtəsi seçin, sonra səhifəni bölmə-bölmə yığın və canlı storefront önizləməsinə baxın.",
    previewLabel: "Canlı Storefront",
    previewTitle: "Sadəcə blok xəritəsi deyil, tam səhifə önizləməsi",
    previewCopy:
      "Siyahıdakı hər bölmə sağ tərəfdə əks olunur ki, ritmi, iyerarxiyanı və ümumi hissi real template marketplace kimi qiymətləndirə biləsiniz.",
    primaryAction: "Layihəyə başla",
    secondaryAction: "Qiymətlərə bax",
    metrics: {
      activeSections: "Aktiv bölmələr",
      currentPalette: "Cari palitra",
      previewMode: "Önizləmə rejimi",
    },
    controls: {
      presets: "Şablon preset-ləri",
      palettes: "Rəng palitraları",
      activeSections: "Aktiv bölmələr",
      inFlow: "səhifə axınında",
      library: "Bölmə kitabxanası",
      addToPage: "Səhifəyə əlavə et",
      inspector: "Bölmə inspektoru",
      overview: "Ümumi baxış",
      customPalette: "Fərdi Palitra",
      customPaletteCopy: "Canvas, səhifə, səth, mətn və aksent rənglərini özünüz seçin.",
      canvas: "Canvas",
      page: "Səhifə",
      surface: "Səth",
      text: "Mətn",
      accent: "Aksent",
      useCustom: "Fərdi palitranı istifadə et",
      resetPreset: "Preset-dən sıfırla",
      up: "Yuxarı",
      down: "Aşağı",
      remove: "Sil",
      desktop: "Desktop",
      mobile: "Mobil",
    },
    summary: {
      eyebrow: "Cari Tema DNA-sı",
      title: "Bu şablon niyə işləyir",
      copy:
        "Preset ümumi ritmi, palitra vizual tonu, bölmə sırası isə tam yolçuluğu müəyyən edir. Beləliklə, UI cilalanmazdan əvvəl səhifənin kimliyi aydınlaşır.",
      presetIdentity: "Preset kimliyi",
      colorDirection: "Rəng istiqaməti",
      selectedSection: "Seçilən bölmə",
      sectionsInFlow: "Axındakı bölmələr",
    },
    save: {
      eyebrow: "Bu Dizaynı Göndər",
      title: "Şablonu Configuro-ya göndərin",
      copy:
        "Qısa qeydinizlə birlikdə kompakt PNG önizləmə, palitra, preset və bölmə sırası bizə göndəriləcək.",
      fullName: "Ad",
      email: "E-poçt",
      company: "Şirkət",
      note: "Layihə qeydi",
      placeholders: {
        fullName: "Əli Məmmədov",
        email: "ali@sirket.az",
        company: "Studiya və ya brend",
        note: "Bu istiqamətdə nəyi bəyəndiyinizi və ya növbəti addımda nə dəyişməli olduğunu yazın.",
      },
      download: "PNG saxla",
      submit: "Dizaynı göndər",
      sending: "PNG hazırlanır...",
      successTitle: "Dizayn göndərildi",
      successCopy: "Şablon xülasəsi və PNG önizləmə inbox-a yazıldı.",
    },
    preview: {
      pathBase: "configuro.studio/templates",
      brand: "Configuro Themes",
      footerNote: "Premium məhsul hekayəsi üçün qurulmuş template sistemi.",
    },
  },
  ru: {
    eyebrow: "Студия шаблонов",
    headline: "Соберите структуру страницы до того, как появится дизайн-долг.",
    copy:
      "Это не сам конфигуратор, а витринная лаборатория шаблонов. Выберите направление, смените палитру, добавляйте и переставляйте секции и формируйте полноценный page experience в духе премиального Shopify-builder.",
    builderLabel: "Управление темой",
    builderTitle: "Настройте секции, стиль и направление шаблона",
    builderCopy:
      "Начните с пресета, затем соберите страницу секция за секцией и сразу оценивайте итог в живом storefront-превью.",
    previewLabel: "Живой Storefront",
    previewTitle: "Полноценный превью-экран, а не просто карта блоков",
    previewCopy:
      "Каждая секция из списка отражается справа, чтобы можно было оценить ритм, иерархию и настроение как в реальном маркетплейсе шаблонов.",
    primaryAction: "Начать проект",
    secondaryAction: "Смотреть цены",
    metrics: {
      activeSections: "Активные секции",
      currentPalette: "Текущая палитра",
      previewMode: "Режим превью",
    },
    controls: {
      presets: "Пресеты шаблонов",
      palettes: "Цветовые палитры",
      activeSections: "Активные секции",
      inFlow: "в потоке страницы",
      library: "Библиотека секций",
      addToPage: "Добавить на страницу",
      inspector: "Инспектор секции",
      overview: "Обзор",
      customPalette: "Пользовательская палитра",
      customPaletteCopy: "Выберите свои цвета для canvas, страницы, поверхности, текста и акцента.",
      canvas: "Canvas",
      page: "Страница",
      surface: "Поверхность",
      text: "Текст",
      accent: "Акцент",
      useCustom: "Использовать свою палитру",
      resetPreset: "Сбросить от пресета",
      up: "Выше",
      down: "Ниже",
      remove: "Удал.",
      desktop: "Desktop",
      mobile: "Mobile",
    },
    summary: {
      eyebrow: "DNA текущей темы",
      title: "Почему этот шаблон работает",
      copy:
        "Пресет задаёт ритм, палитра определяет настроение, а стек секций формирует весь путь по странице. Поэтому у шаблона появляется ясная идентичность ещё до финального UI-polish.",
      presetIdentity: "Идентичность пресета",
      colorDirection: "Цветовое направление",
      selectedSection: "Выбранная секция",
      sectionsInFlow: "Секций в потоке",
    },
    save: {
      eyebrow: "Отправить этот дизайн",
      title: "Отправьте шаблон в Configuro",
      copy:
        "Мы получим компактный PNG-превью вместе с палитрой, пресетом, порядком секций и вашим кратким комментарием.",
      fullName: "Имя",
      email: "Email",
      company: "Компания",
      note: "Комментарий по проекту",
      placeholders: {
        fullName: "Алексей Морозов",
        email: "alex@company.com",
        company: "Студия или бренд",
        note: "Напишите, что вам нравится в этом направлении и что стоит доработать дальше.",
      },
      download: "Сохранить PNG",
      submit: "Отправить дизайн",
      sending: "Подготовка PNG...",
      successTitle: "Дизайн отправлен",
      successCopy: "Сводка шаблона и PNG-превью сохранены во входящие.",
    },
    preview: {
      pathBase: "configuro.studio/templates",
      brand: "Configuro Themes",
      footerNote: "Система шаблонов для премиального продуктового сторителлинга.",
    },
  },
  tr: {
    eyebrow: "Sablon Studyosu",
    headline: "Tasarim borcu baslamadan once sayfa yapisini kurun.",
    copy:
      "Bu sayfa configurator'un kendisi degil; storefront odakli bir sablon laboratuvari. Yonu secin, paleti degistirin, bolumleri ekleyip siralayin ve tam sayfa deneyimini premium bir Shopify builder gibi sekillendirin.",
    builderLabel: "Tema Kontrolleri",
    builderTitle: "Bolumleri, stili ve sablon yonunu ayarlayin",
    builderCopy:
      "Bir preset ile baslayin, sonra sayfayi bolum bolum kurun ve canli storefront onizlemesinde sonucu hemen gorun.",
    previewLabel: "Canli Storefront",
    previewTitle: "Sadece blok haritasi degil, tam sayfa onizleme",
    previewCopy:
      "Listedeki her bolum sag tarafta gorunur; boylece ritmi, hiyerarsiyi ve genel hissi gercek bir template marketplace gibi degerlendirebilirsiniz.",
    primaryAction: "Proje baslat",
    secondaryAction: "Fiyatlara bak",
    metrics: {
      activeSections: "Aktif bolumler",
      currentPalette: "Mevcut palet",
      previewMode: "Onizleme modu",
    },
    controls: {
      presets: "Sablon preset'leri",
      palettes: "Renk paletleri",
      activeSections: "Aktif bolumler",
      inFlow: "sayfa akisinda",
      library: "Bolum kutuphanesi",
      addToPage: "Sayfaya ekle",
      inspector: "Bolum denetleyicisi",
      overview: "Genel bakis",
      customPalette: "Ozel Palet",
      customPaletteCopy: "Canvas, sayfa, yuzey, metin ve vurgu renklerini kendiniz secin.",
      canvas: "Canvas",
      page: "Sayfa",
      surface: "Yuzey",
      text: "Metin",
      accent: "Vurgu",
      useCustom: "Ozel paleti kullan",
      resetPreset: "Preset'ten sifirla",
      up: "Yukari",
      down: "Asagi",
      remove: "Sil",
      desktop: "Desktop",
      mobile: "Mobil",
    },
    summary: {
      eyebrow: "Mevcut Tema DNA'si",
      title: "Bu sablon neden calisiyor",
      copy:
        "Preset genel ritmi belirler, palet duyguyu kurar ve bolum sirasi tum yolculugu sekillendirir. Boylece arayuz cilasindan once sayfanin kimligi netlesir.",
      presetIdentity: "Preset kimligi",
      colorDirection: "Renk yonu",
      selectedSection: "Secili bolum",
      sectionsInFlow: "Akistaki bolumler",
    },
    save: {
      eyebrow: "Bu Tasarimi Gonder",
      title: "Sablonu Configuro'ya gonderin",
      copy:
        "Kisa notunuzla birlikte kompakt PNG onizleme, palet, preset ve bolum sirasi bize ulasacak.",
      fullName: "Ad",
      email: "E-posta",
      company: "Sirket",
      note: "Proje notu",
      placeholders: {
        fullName: "Ali Yilmaz",
        email: "ali@sirket.com",
        company: "Stüdyo veya marka",
        note: "Bu yon hakkinda neyi begendiginizi veya sonraki asamada neyin degismesi gerektigini yazin.",
      },
      download: "PNG kaydet",
      submit: "Tasarimi gonder",
      sending: "PNG hazirlaniyor...",
      successTitle: "Tasarim gonderildi",
      successCopy: "Sablon ozeti ve PNG onizleme gelen kutusuna kaydedildi.",
    },
    preview: {
      pathBase: "configuro.studio/templates",
      brand: "Configuro Themes",
      footerNote: "Premium urun hikaye anlatimi icin tasarlanmis template sistemi.",
    },
  },
};

const SECTION_LIBRARY = {
  hero: {
    label: "Hero Story",
    group: "Essential",
    description: "A premium opening with headline, CTA, and visual lead-in.",
  },
  announcement: {
    label: "Announcement Strip",
    group: "Commerce",
    description: "Short utility or trust messaging above the fold.",
  },
  collection: {
    label: "Featured Collection",
    group: "Commerce",
    description: "Product cards, launches, or best-selling groups.",
  },
  story: {
    label: "Editorial Split",
    group: "Story",
    description: "A text-and-visual section for positioning and explanation.",
  },
  mosaic: {
    label: "Media Mosaic",
    group: "Visual",
    description: "Layered media blocks for launches, campaigns, and lookbooks.",
  },
  comparison: {
    label: "Comparison Table",
    group: "Evaluation",
    description: "Plans, packages, tiers, or feature comparisons.",
  },
  testimonials: {
    label: "Testimonials",
    group: "Trust",
    description: "Proof cards, reviews, and credibility moments.",
  },
  faq: {
    label: "FAQ",
    group: "Support",
    description: "Objection handling and practical details.",
  },
  cta: {
    label: "CTA Footer",
    group: "Conversion",
    description: "A strong closing band with next-step messaging.",
  },
};

const TEMPLATE_PRESETS = [
  {
    key: "atelier",
    label: "Atelier Commerce",
    badge: "Curated Store",
    headline: "A storefront that feels designed, not assembled.",
    copy:
      "Balanced between product story and conversion. Best for premium brands that need hierarchy, product cards, and enough atmosphere to feel elevated.",
    defaultPalette: "linen",
    sections: ["hero", "announcement", "collection", "story", "testimonials", "cta"],
    strengths: ["Editorial pacing", "Premium product cards", "Clean CTA rhythm"],
  },
  {
    key: "drop",
    label: "Launch Drop",
    badge: "Campaign Theme",
    headline: "Built for product drops, reveals, and high-energy pages.",
    copy:
      "Stronger contrast, more visual momentum, and section sequencing tuned for launches where attention and energy matter.",
    defaultPalette: "signal",
    sections: ["hero", "mosaic", "collection", "comparison", "testimonials", "cta"],
    strengths: ["Campaign sequencing", "Visual density", "Stronger urgency"],
  },
  {
    key: "catalog",
    label: "Minimal Catalog",
    badge: "Clean Store",
    headline: "A quieter commerce template for clarity-first brands.",
    copy:
      "Leaner, calmer, and more product-forward. Good for teams that want sections to stay useful and commercial without feeling over-designed.",
    defaultPalette: "skyline",
    sections: ["hero", "collection", "story", "faq", "cta"],
    strengths: ["Product-first layout", "Simple navigation", "Low-friction browsing"],
  },
];

const PALETTES = [
  {
    key: "linen",
    label: "Linen / Ink",
    mood: "Soft, premium, editorial",
    swatches: ["#f4efe8", "#ffffff", "#1b2330", "#b98152"],
    canvas: "#f6f1ea",
    frame: "#fdfaf6",
    page: "#fffaf4",
    surface: "#ffffff",
    surfaceStrong: "#f3ede6",
    text: "#181d28",
    muted: "#67707b",
    accent: "#1f2a3d",
    accentSoft: "rgba(31, 42, 61, 0.08)",
    border: "rgba(24, 29, 40, 0.09)",
    hero: "linear-gradient(135deg, #f8f2ea 0%, #efe5da 55%, #e3d3c1 100%)",
    shadow: "0 24px 60px rgba(24, 29, 40, 0.08)",
    inverse: "#11161e",
  },
  {
    key: "skyline",
    label: "Skyline",
    mood: "Crisp, modern, commerce-led",
    swatches: ["#ebf2fb", "#ffffff", "#10233f", "#4e7dc8"],
    canvas: "#eef4fb",
    frame: "#fbfdff",
    page: "#ffffff",
    surface: "#ffffff",
    surfaceStrong: "#eef3f9",
    text: "#162235",
    muted: "#607187",
    accent: "#214b87",
    accentSoft: "rgba(33, 75, 135, 0.09)",
    border: "rgba(22, 34, 53, 0.08)",
    hero: "linear-gradient(135deg, #eff5fd 0%, #dde8f8 48%, #c7daf4 100%)",
    shadow: "0 24px 60px rgba(33, 75, 135, 0.08)",
    inverse: "#10233f",
  },
  {
    key: "grove",
    label: "Grove Studio",
    mood: "Warm, crafted, material-led",
    swatches: ["#f0ece3", "#faf7f0", "#243127", "#6e8b66"],
    canvas: "#efebe2",
    frame: "#f8f5ee",
    page: "#f9f7f1",
    surface: "#ffffff",
    surfaceStrong: "#ece8de",
    text: "#1f2922",
    muted: "#667266",
    accent: "#304934",
    accentSoft: "rgba(48, 73, 52, 0.09)",
    border: "rgba(31, 41, 34, 0.08)",
    hero: "linear-gradient(135deg, #f5f1e8 0%, #e5ddcc 52%, #d4d0be 100%)",
    shadow: "0 24px 60px rgba(31, 41, 34, 0.08)",
    inverse: "#1f2922",
  },
  {
    key: "signal",
    label: "Signal Night",
    mood: "High-contrast, launch-ready, bold",
    swatches: ["#0d1118", "#171d27", "#ffffff", "#f36f45"],
    canvas: "#0f131b",
    frame: "#11161f",
    page: "#131925",
    surface: "#181f2c",
    surfaceStrong: "#202839",
    text: "#eef3ff",
    muted: "#a8b3c6",
    accent: "#ff7a4e",
    accentSoft: "rgba(255, 122, 78, 0.14)",
    border: "rgba(255, 255, 255, 0.09)",
    hero: "linear-gradient(135deg, #151d2a 0%, #101723 48%, #1f2938 100%)",
    shadow: "0 24px 60px rgba(0, 0, 0, 0.26)",
    inverse: "#f4f6fb",
  },
  {
    key: "terracotta",
    label: "Terracotta",
    mood: "Warm, fashion-led, launch-ready",
    swatches: ["#f5ebe3", "#fffaf7", "#2b1d1a", "#c96b47"],
    canvas: "#f4ece5",
    frame: "#fffaf6",
    page: "#fffaf7",
    surface: "#ffffff",
    surfaceStrong: "#f0e5dc",
    text: "#261b18",
    muted: "#7a6660",
    accent: "#b95d3a",
    accentSoft: "rgba(185, 93, 58, 0.12)",
    border: "rgba(38, 27, 24, 0.08)",
    hero: "linear-gradient(135deg, #f8efe7 0%, #edd8cc 52%, #ddb59f 100%)",
    shadow: "0 24px 60px rgba(38, 27, 24, 0.09)",
    inverse: "#261b18",
  },
  {
    key: "harbor",
    label: "Harbor",
    mood: "Cool, structured, premium tech",
    swatches: ["#e8eff3", "#fdfefe", "#13232a", "#2e7486"],
    canvas: "#edf2f5",
    frame: "#fbfdfe",
    page: "#fdfefe",
    surface: "#ffffff",
    surfaceStrong: "#e7eef1",
    text: "#16252d",
    muted: "#62737a",
    accent: "#2d6f84",
    accentSoft: "rgba(45, 111, 132, 0.1)",
    border: "rgba(22, 37, 45, 0.08)",
    hero: "linear-gradient(135deg, #eff5f7 0%, #d7e6eb 50%, #b9d5dd 100%)",
    shadow: "0 24px 60px rgba(22, 37, 45, 0.08)",
    inverse: "#16252d",
  },
  {
    key: "mono",
    label: "Mono Contrast",
    mood: "Sharp, minimal, editorial retail",
    swatches: ["#f1f1ef", "#ffffff", "#111214", "#4e535c"],
    canvas: "#efefec",
    frame: "#fbfbf8",
    page: "#ffffff",
    surface: "#ffffff",
    surfaceStrong: "#ecece7",
    text: "#17181b",
    muted: "#63666e",
    accent: "#2b313b",
    accentSoft: "rgba(43, 49, 59, 0.1)",
    border: "rgba(23, 24, 27, 0.08)",
    hero: "linear-gradient(135deg, #f7f7f4 0%, #e7e6e1 52%, #d2d3cf 100%)",
    shadow: "0 24px 60px rgba(23, 24, 27, 0.08)",
    inverse: "#17181b",
  },
];

const PREVIEW_MODES = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

function createSection(type, index = 0) {
  return {
    id: `${type}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    type,
  };
}

function instantiateSections(sectionKeys) {
  return sectionKeys.map((type, index) => createSection(type, index));
}

function createPresetState(preset) {
  const nextSections = instantiateSections(preset.sections);
  return {
    sections: nextSections,
    selectedSectionId: nextSections[0]?.id ?? "",
  };
}

function moveItem(array, fromIndex, toIndex) {
  const next = [...array];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized.split("").map((value) => `${value}${value}`).join("")
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(safeHex)) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Number.parseInt(safeHex.slice(0, 2), 16),
    g: Number.parseInt(safeHex.slice(2, 4), 16),
    b: Number.parseInt(safeHex.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(baseHex, accentHex, ratio) {
  const base = hexToRgb(baseHex);
  const accent = hexToRgb(accentHex);
  return rgbToHex({
    r: base.r + (accent.r - base.r) * ratio,
    g: base.g + (accent.g - base.g) * ratio,
    b: base.b + (accent.b - base.b) * ratio,
  });
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function paletteToCustomColors(palette) {
  return {
    canvas: palette.canvas,
    page: palette.page,
    surface: palette.surface,
    text: palette.text,
    accent: palette.accent,
  };
}

function buildCustomPalette(customColors) {
  const isDarkPalette = getLuminance(customColors.page) < 0.3;

  return {
    key: CUSTOM_PALETTE_KEY,
    label: "Custom Palette",
    mood: "Personalized theme colors",
    swatches: [
      customColors.canvas,
      customColors.page,
      customColors.surface,
      customColors.text,
      customColors.accent,
    ],
    canvas: customColors.canvas,
    frame: mixHex(customColors.page, "#ffffff", isDarkPalette ? 0.08 : 0.55),
    page: customColors.page,
    surface: customColors.surface,
    surfaceStrong: mixHex(customColors.surface, customColors.canvas, 0.5),
    text: customColors.text,
    muted: withAlpha(customColors.text, 0.7),
    accent: customColors.accent,
    accentSoft: withAlpha(customColors.accent, isDarkPalette ? 0.18 : 0.12),
    border: withAlpha(customColors.text, isDarkPalette ? 0.16 : 0.1),
    hero:
      `linear-gradient(135deg, ${mixHex(customColors.canvas, customColors.page, 0.3)} 0%, ` +
      `${mixHex(customColors.page, customColors.accent, 0.12)} 52%, ` +
      `${mixHex(customColors.surface, customColors.accent, 0.3)} 100%)`,
    shadow: isDarkPalette
      ? "0 28px 72px rgba(0, 0, 0, 0.34)"
      : "0 24px 60px rgba(24, 29, 40, 0.1)",
    inverse: customColors.text,
  };
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle = "") {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

function buildTemplateSnapshot({ brand, preset, palette, sections, previewMode }) {
  const canvas = document.createElement("canvas");
  canvas.width = 880;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  ctx.fillStyle = palette.canvas;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(ctx, 36, 36, 808, 568, 28, palette.frame);
  drawRoundedRect(ctx, 56, 96, 768, 468, 24, palette.page, palette.border);

  ctx.fillStyle = palette.text;
  ctx.font = "700 28px Sora, sans-serif";
  ctx.fillText(brand, 64, 74);
  ctx.font = "600 14px Manrope, sans-serif";
  ctx.fillStyle = palette.muted;
  ctx.fillText(`${preset.label} · ${palette.label} · ${previewMode}`, 64, 560);

  ctx.fillStyle = withAlpha(palette.text, 0.14);
  ctx.beginPath();
  ctx.arc(74, 74, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(94, 74, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(114, 74, 6, 0, Math.PI * 2);
  ctx.fill();

  drawRoundedRect(ctx, 84, 124, 320, 164, 24, palette.hero);
  drawRoundedRect(ctx, 432, 124, 308, 164, 24, palette.surface, palette.border);
  drawRoundedRect(ctx, 84, 318, 656, 90, 22, palette.surfaceStrong, palette.border);
  drawRoundedRect(ctx, 84, 430, 212, 92, 20, palette.surface, palette.border);
  drawRoundedRect(ctx, 314, 430, 212, 92, 20, palette.surface, palette.border);
  drawRoundedRect(ctx, 544, 430, 196, 92, 20, palette.accent, "");

  ctx.fillStyle = palette.text;
  ctx.font = "700 34px Sora, sans-serif";
  ctx.fillText(preset.label, 112, 178);
  ctx.font = "500 16px Manrope, sans-serif";
  ctx.fillStyle = palette.muted;
  ctx.fillText(`${sections.length} sections configured`, 112, 212);

  ctx.fillStyle = palette.accent;
  ctx.font = "700 13px Manrope, sans-serif";
  ctx.fillText("SECTIONS", 112, 342);

  let chipX = 112;
  let chipY = 366;
  sections.slice(0, 6).forEach((section) => {
    const label = section.label;
    const width = Math.max(84, ctx.measureText(label).width + 28);
    if (chipX + width > 716) {
      chipX = 112;
      chipY += 38;
    }

    drawRoundedRect(ctx, chipX, chipY, width, 28, 14, palette.surface, palette.border);
    ctx.fillStyle = palette.text;
    ctx.font = "600 12px Manrope, sans-serif";
    ctx.fillText(label, chipX + 14, chipY + 18);
    chipX += width + 10;
  });

  [palette.canvas, palette.page, palette.surface, palette.text, palette.accent].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(466 + index * 34, 190, 11, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = palette.text;
  ctx.font = "700 15px Manrope, sans-serif";
  ctx.fillText("Compact PNG summary", 456, 156);
  ctx.font = "500 13px Manrope, sans-serif";
  ctx.fillStyle = palette.muted;
  ctx.fillText("Saved with preset, palette, section stack, and preview mode.", 456, 218);

  ctx.fillStyle = palette.page;
  ctx.font = "700 15px Manrope, sans-serif";
  ctx.fillText("Send design", 600, 482);

  return canvas.toDataURL("image/png");
}

function downloadDataUrl(dataUrl, fileName) {
  if (!dataUrl || typeof document === "undefined") {
    return;
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function PreviewSection({ section, index, preset, isSelected, onSelect }) {
  const definition = SECTION_LIBRARY[section.type];

  if (!definition) {
    return null;
  }

  const baseProps = {
    className: `theme-preview-section theme-preview-${section.type} ${isSelected ? "is-selected" : ""}`,
    onClick: () => onSelect(section.id),
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(section.id);
      }
    },
    role: "button",
    tabIndex: 0,
    "aria-pressed": isSelected,
  };

  if (section.type === "hero") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Hero Story</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-hero-grid">
          <div className="theme-preview-copy">
            <h2>{preset.headline}</h2>
            <p>{preset.copy}</p>
            <div className="theme-preview-action-row">
              <span className="theme-preview-primary">Shop the story</span>
              <span className="theme-preview-secondary">View collection</span>
            </div>
          </div>
          <div className="theme-preview-hero-stack">
            <div className="theme-preview-float-card">
              <strong>Palette-ready</strong>
              <span>Hero adapts instantly to the selected color system.</span>
            </div>
            <div className="theme-preview-float-card is-offset">
              <strong>Theme-driven layout</strong>
              <span>Structure stays consistent while tone changes with the preset.</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "announcement") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-announcement-grid">
          <span>Free shipping over $250</span>
          <span>New collection live now</span>
          <span>Premium support within 24h</span>
        </div>
      </section>
    );
  }

  if (section.type === "collection") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Featured Collection</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-block-head">
          <h3>Merchandising that still feels designed.</h3>
          <p>Three product cards, strong image rhythm, and just enough copy to support the sale.</p>
        </div>
        <div className="theme-preview-card-grid">
          {[1, 2, 3].map((item) => (
            <article className="theme-preview-product-card" key={item}>
              <div className="theme-preview-product-media" />
              <strong>Signature Product {item}</strong>
              <span>Material highlight and short conversion copy.</span>
              <small>From $240</small>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "story") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Editorial Split</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-story-grid">
          <div className="theme-preview-copy">
            <h3>Give the product a point of view.</h3>
            <p>
              Use this section for craftsmanship, category positioning, brand philosophy, or the reason the product
              deserves its price.
            </p>
          </div>
          <div className="theme-preview-story-panel">
            <div className="theme-preview-story-frame" />
            <div className="theme-preview-story-caption">
              <strong>Material system / brand note</strong>
              <span>Supporting caption, texture note, or launch detail.</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "mosaic") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Media Mosaic</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-mosaic-grid">
          <div className="theme-preview-mosaic-card is-large" />
          <div className="theme-preview-mosaic-card" />
          <div className="theme-preview-mosaic-card" />
        </div>
      </section>
    );
  }

  if (section.type === "comparison") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Comparison Table</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-compare-grid">
          {["Core", "Plus", "Studio"].map((tier) => (
            <article className="theme-preview-compare-card" key={tier}>
              <strong>{tier}</strong>
              <span>Designed for a clearer package story.</span>
              <ul>
                <li>Premium visual layout</li>
                <li>Section-ready copy</li>
                <li>Sharper CTA handoff</li>
              </ul>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "testimonials") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">Proof Layer</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-quote-grid">
          {["Marketing Lead", "Founder", "Creative Director"].map((author) => (
            <article className="theme-preview-quote-card" key={author}>
              <p>
                "This section gives the template a stronger sense of trust without breaking the visual rhythm of the
                page."
              </p>
              <strong>{author}</strong>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === "faq") {
    return (
      <section {...baseProps}>
        <div className="theme-preview-section-top">
          <span className="theme-preview-kicker">FAQ</span>
          <span className="theme-preview-index">0{index + 1}</span>
        </div>
        <div className="theme-preview-faq-list">
          {[
            "Can this template support multiple collections?",
            "Does the palette update every section automatically?",
            "Can sections be reordered for launches or seasonal drops?",
          ].map((question) => (
            <div className="theme-preview-faq-item" key={question}>
              <strong>{question}</strong>
              <span>A practical answer lives here, helping the page stay commercial and clear.</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section {...baseProps}>
      <div className="theme-preview-cta-band">
        <div>
          <span className="theme-preview-kicker">Final CTA</span>
          <h3>Close the page with a confident next step.</h3>
        </div>
        <div className="theme-preview-action-row">
          <span className="theme-preview-primary">Start your build</span>
          <span className="theme-preview-secondary">Request a review</span>
        </div>
      </div>
    </section>
  );
}

function Templates({ content, language }) {
  const page = PAGE_COPY_BY_LANGUAGE[language] ?? PAGE_COPY_BY_LANGUAGE.en;
  const defaultPreset = TEMPLATE_PRESETS[0];
  const initialState = useMemo(() => createPresetState(defaultPreset), [defaultPreset]);
  const defaultPalette = PALETTES.find((palette) => palette.key === defaultPreset.defaultPalette) ?? PALETTES[0];
  const [presetKey, setPresetKey] = useState(defaultPreset.key);
  const [paletteKey, setPaletteKey] = useState(defaultPreset.defaultPalette);
  const [previewMode, setPreviewMode] = useState(PREVIEW_MODES[0].key);
  const [sections, setSections] = useState(initialState.sections);
  const [selectedSectionId, setSelectedSectionId] = useState(initialState.selectedSectionId);
  const [customColors, setCustomColors] = useState(() => paletteToCustomColors(defaultPalette));
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    note: "",
  });
  const [snapshotPreview, setSnapshotPreview] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const activePreset = TEMPLATE_PRESETS.find((preset) => preset.key === presetKey) ?? defaultPreset;
  const activePresetPalette = PALETTES.find((palette) => palette.key === activePreset.defaultPalette) ?? PALETTES[0];
  const basePalette = PALETTES.find((palette) => palette.key === paletteKey) ?? PALETTES[0];
  const activePalette = paletteKey === CUSTOM_PALETTE_KEY ? buildCustomPalette(customColors) : basePalette;
  const selectedSection = sections.find((section) => section.id === selectedSectionId) ?? sections[0];
  const selectedDefinition = selectedSection ? SECTION_LIBRARY[selectedSection.type] : null;
  const primaryActionLabel = page.primaryAction ?? content.nav?.cta ?? "Start a project";
  const sectionLabels = sections.map((section) => ({
    key: section.id,
    label: SECTION_LIBRARY[section.type]?.label ?? section.type,
  }));
  const themeStyle = useMemo(
    () => ({
      "--theme-canvas": activePalette.canvas,
      "--theme-frame": activePalette.frame,
      "--theme-page": activePalette.page,
      "--theme-surface": activePalette.surface,
      "--theme-surface-strong": activePalette.surfaceStrong,
      "--theme-text": activePalette.text,
      "--theme-muted": activePalette.muted,
      "--theme-accent": activePalette.accent,
      "--theme-accent-soft": activePalette.accentSoft,
      "--theme-border": activePalette.border,
      "--theme-hero": activePalette.hero,
      "--theme-shadow": activePalette.shadow,
      "--theme-inverse": activePalette.inverse,
    }),
    [activePalette],
  );

  const designBrief = useMemo(() => {
    const summaryLines = [
      form.note.trim(),
      `Preset: ${activePreset.label}`,
      `Palette: ${activePalette.label}`,
      `Preview: ${previewMode}`,
      `Sections: ${sectionLabels.map((section) => section.label).join(", ")}`,
    ].filter(Boolean);

    return summaryLines.join("\n\n");
  }, [activePalette.label, activePreset.label, form.note, previewMode, sectionLabels]);

  const applyPreset = (preset) => {
    const nextSections = instantiateSections(preset.sections);
    const nextPalette = PALETTES.find((palette) => palette.key === preset.defaultPalette) ?? PALETTES[0];
    setPresetKey(preset.key);
    setPaletteKey(nextPalette.key);
    setCustomColors(paletteToCustomColors(nextPalette));
    setSections(nextSections);
    setSelectedSectionId(nextSections[0]?.id ?? "");
  };

  const selectPalette = (palette) => {
    setPaletteKey(palette.key);
    setCustomColors(paletteToCustomColors(palette));
  };

  const updateCustomColor = (field, value) => {
    setPaletteKey(CUSTOM_PALETTE_KEY);
    setCustomColors((currentColors) => ({
      ...currentColors,
      [field]: value,
    }));
  };

  const resetCustomPalette = () => {
    setPaletteKey(CUSTOM_PALETTE_KEY);
    setCustomColors(paletteToCustomColors(activePresetPalette));
  };

  const updateForm = (field, value) => {
    setSent(false);
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const generateSnapshot = () => {
    const png = buildTemplateSnapshot({
      brand: page.preview.brand,
      preset: activePreset,
      palette: activePalette,
      sections: sectionLabels,
      previewMode,
    });
    setSnapshotPreview(png);
    return png;
  };

  const handleDownload = () => {
    const png = generateSnapshot();
    downloadDataUrl(png, `configuro-template-${activePreset.key}.png`);
  };

  const handleSendDesign = (event) => {
    event.preventDefault();
    setSending(true);

    const png = generateSnapshot();

    createInquiry({
      source: "templates-studio",
      fullName: form.fullName,
      email: form.email,
      company: form.company,
      productName: activePreset.label,
      projectType: page.builderLabel,
      brief: designBrief,
      goals: sectionLabels.map((section) => section.label),
      deliverables: [activePalette.label, page.controls[previewMode]],
      designPreviewPng: png,
      templateDesign: {
        language,
        presetKey: activePreset.key,
        presetLabel: activePreset.label,
        paletteKey: activePalette.key,
        paletteLabel: activePalette.label,
        previewMode,
        sections: sectionLabels,
      },
    });

    setSending(false);
    setSent(true);
  };

  const addSection = (type) => {
    const nextSection = createSection(type, sections.length);
    setSections((currentSections) => [...currentSections, nextSection]);
    setSelectedSectionId(nextSection.id);
  };

  const removeSection = (id) => {
    if (sections.length === 1) {
      return;
    }

    const nextSections = sections.filter((section) => section.id !== id);
    setSections(nextSections);
    if (selectedSectionId === id) {
      setSelectedSectionId(nextSections[0]?.id ?? "");
    }
  };

  const moveSection = (id, direction) => {
    const index = sections.findIndex((section) => section.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= sections.length) {
      return;
    }

    setSections(moveItem(sections, index, targetIndex));
  };

  return (
    <main className="theme-lab-page">
      <section className="section-block theme-lab-hero">
        <div className="container">
          <div className="theme-lab-hero-grid">
            <div className="theme-lab-copy">
              <div className="eyebrow reveal">{page.eyebrow}</div>
              <h1 className="reveal">{page.headline}</h1>
              <p className="theme-lab-subline reveal">{page.copy}</p>

              <div className="theme-lab-chip-row reveal">
                <span className="tag">Shopify-style structure</span>
                <span className="tag">Section control</span>
                <span className="tag">Palette switching</span>
                <span className="tag">Live storefront preview</span>
              </div>
            </div>

            <article className="glass-card theme-lab-hero-panel reveal">
              <span className="metric-label">{page.previewLabel}</span>
              <h2>{page.previewTitle}</h2>
              <p>{page.previewCopy}</p>

              <div className="theme-lab-hero-metrics">
                <div className="theme-lab-hero-metric">
                  <strong>{sections.length}</strong>
                  <span>{page.metrics.activeSections}</span>
                </div>
                <div className="theme-lab-hero-metric">
                  <strong>{activePalette.label}</strong>
                  <span>{page.metrics.currentPalette}</span>
                </div>
                <div className="theme-lab-hero-metric">
                  <strong>{previewMode === "desktop" ? "1440" : "430"}px</strong>
                  <span>{page.metrics.previewMode}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block theme-lab-builder">
        <div className="container">
          <div className="theme-lab-grid">
            <aside className="glass-card theme-control-panel reveal">
              <div className="theme-panel-head">
                <span className="metric-label">{page.builderLabel}</span>
                <h2>{page.builderTitle}</h2>
                <p>{page.builderCopy}</p>
              </div>

              <section className="theme-panel-section">
                <div className="theme-panel-title-row">
                  <strong>{page.controls.presets}</strong>
                  <span>{activePreset.badge}</span>
                </div>

                <div className="theme-preset-grid">
                  {TEMPLATE_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      className={`theme-preset-card ${preset.key === activePreset.key ? "is-active" : ""}`}
                      type="button"
                      onClick={() => applyPreset(preset)}
                    >
                      <span className="theme-preset-badge">{preset.badge}</span>
                      <strong>{preset.label}</strong>
                      <small>{preset.copy}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="theme-panel-section">
                <div className="theme-panel-title-row">
                  <strong>{page.controls.palettes}</strong>
                  <span>{activePalette.mood}</span>
                </div>

                <div className="theme-palette-grid">
                  {PALETTES.map((palette) => (
                    <button
                      key={palette.key}
                      className={`theme-palette-card ${palette.key === activePalette.key ? "is-active" : ""}`}
                      type="button"
                      onClick={() => selectPalette(palette)}
                    >
                      <div className="theme-palette-swatches">
                        {palette.swatches.map((swatch, index) => (
                          <span key={`${palette.key}-${swatch}-${index}`} style={{ backgroundColor: swatch }} />
                        ))}
                      </div>
                      <strong>{palette.label}</strong>
                      <small>{palette.mood}</small>
                    </button>
                  ))}

                  <button
                    className={`theme-palette-card theme-palette-card-custom ${paletteKey === CUSTOM_PALETTE_KEY ? "is-active" : ""}`}
                    type="button"
                    onClick={() => setPaletteKey(CUSTOM_PALETTE_KEY)}
                  >
                    <div className="theme-palette-swatches">
                      {buildCustomPalette(customColors).swatches.map((swatch, index) => (
                        <span key={`custom-${swatch}-${index}`} style={{ backgroundColor: swatch }} />
                      ))}
                    </div>
                    <strong>{page.controls.customPalette}</strong>
                    <small>{page.controls.customPaletteCopy}</small>
                  </button>
                </div>

                <div className="theme-custom-grid">
                  {[
                    { key: "canvas", label: page.controls.canvas },
                    { key: "page", label: page.controls.page },
                    { key: "surface", label: page.controls.surface },
                    { key: "text", label: page.controls.text },
                    { key: "accent", label: page.controls.accent },
                  ].map((field) => (
                    <label className="theme-custom-field" key={field.key}>
                      <span>{field.label}</span>
                      <div className="theme-custom-input-row">
                        <input
                          type="color"
                          value={customColors[field.key]}
                          onChange={(event) => updateCustomColor(field.key, event.target.value)}
                          aria-label={`${field.label} color`}
                        />
                        <strong>{customColors[field.key].toUpperCase()}</strong>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="theme-custom-actions">
                  <button
                    className={`theme-utility-button ${paletteKey === CUSTOM_PALETTE_KEY ? "is-active" : ""}`}
                    type="button"
                    onClick={() => setPaletteKey(CUSTOM_PALETTE_KEY)}
                  >
                    {page.controls.useCustom}
                  </button>
                  <button className="theme-utility-button" type="button" onClick={resetCustomPalette}>
                    {page.controls.resetPreset}
                  </button>
                </div>
              </section>

              <section className="theme-panel-section">
                <div className="theme-panel-title-row">
                  <strong>{page.controls.activeSections}</strong>
                  <span>{sections.length} {page.controls.inFlow}</span>
                </div>

                <div className="theme-section-stack">
                  {sections.map((section, index) => {
                    const definition = SECTION_LIBRARY[section.type];
                    const isFirst = index === 0;
                    const isLast = index === sections.length - 1;
                    const isSelected = selectedSectionId === section.id;

                    return (
                      <article
                        className={`theme-section-row ${isSelected ? "is-selected" : ""}`}
                        key={section.id}
                      >
                        <button
                          className="theme-section-main"
                          type="button"
                          onClick={() => setSelectedSectionId(section.id)}
                        >
                          <span className="theme-section-number">0{index + 1}</span>
                          <div>
                            <strong>{definition.label}</strong>
                            <small>{definition.description}</small>
                          </div>
                        </button>

                        <div className="theme-section-actions">
                          <button
                            type="button"
                            onClick={() => moveSection(section.id, "up")}
                            disabled={isFirst}
                            aria-label={`Move ${definition.label} up`}
                          >
                            {page.controls.up}
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(section.id, "down")}
                            disabled={isLast}
                            aria-label={`Move ${definition.label} down`}
                          >
                            {page.controls.down}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            disabled={sections.length === 1}
                            aria-label={`Remove ${definition.label}`}
                          >
                            {page.controls.remove}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="theme-panel-section">
                <div className="theme-panel-title-row">
                  <strong>{page.controls.library}</strong>
                  <span>{page.controls.addToPage}</span>
                </div>

                <div className="theme-library-grid">
                  {Object.entries(SECTION_LIBRARY).map(([key, definition]) => (
                    <button
                      key={key}
                      className="theme-library-card"
                      type="button"
                      onClick={() => addSection(key)}
                    >
                      <span>{definition.group}</span>
                      <strong>{definition.label}</strong>
                      <small>{definition.description}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="theme-panel-section">
                <div className="theme-panel-title-row">
                  <strong>{page.controls.inspector}</strong>
                  <span>{selectedDefinition?.group ?? page.controls.overview}</span>
                </div>

                <article className="theme-inspector-card">
                  <strong>{selectedDefinition?.label ?? page.controls.inspector}</strong>
                  <p>
                    {selectedDefinition?.description ??
                      "Choose a section from the stack to see what role it plays inside the page."}
                  </p>
                  <div className="theme-inspector-tags">
                    <span className="tag">{activePreset.label}</span>
                    <span className="tag">{activePalette.label}</span>
                    <span className="tag">{selectedDefinition?.group ?? page.controls.overview}</span>
                  </div>
                </article>
              </section>
            </aside>

            <div className="theme-preview-column">
              <article className="glass-card theme-preview-toolbar reveal">
                <div>
                  <span className="metric-label">{page.previewLabel}</span>
                  <h2>{activePreset.label}</h2>
                </div>

                <div className="theme-preview-toolbar-actions">
                  <div className="theme-view-toggle">
                    {PREVIEW_MODES.map((mode) => (
                      <button
                        key={mode.key}
                        className={previewMode === mode.key ? "is-active" : ""}
                        type="button"
                        onClick={() => setPreviewMode(mode.key)}
                      >
                        {page.controls[mode.key]}
                      </button>
                    ))}
                  </div>
                  <div className="theme-preview-toolbar-tags">
                    {activePreset.strengths.map((item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>

              <article className="theme-browser-shell reveal" style={themeStyle}>
                <div className="theme-browser-bar">
                  <div className="theme-browser-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="theme-browser-path">{page.preview.pathBase}/{activePreset.key}</span>
                </div>

                <div className={`theme-browser-canvas is-${previewMode}`}>
                  <div className={`theme-store-preview is-${previewMode}`}>
                    <header className="theme-store-nav">
                      <strong>{page.preview.brand}</strong>
                      <nav>
                        <span>Shop</span>
                        <span>Collections</span>
                        <span>Journal</span>
                        <span>Support</span>
                      </nav>
                  <div className="theme-store-nav-actions">
                    <span>Search</span>
                    <span>Cart (2)</span>
                  </div>
                    </header>

                    <div className="theme-store-sections">
                      {sections.map((section, index) => (
                        <PreviewSection
                          key={section.id}
                          section={section}
                          index={index}
                          preset={activePreset}
                          isSelected={selectedSectionId === section.id}
                          onSelect={setSelectedSectionId}
                        />
                      ))}
                    </div>

                    <footer className="theme-store-footer">
                      <div>
                        <strong>{page.preview.brand}</strong>
                        <span>{page.preview.footerNote}</span>
                      </div>
                      <div className="theme-store-footer-links">
                        <span>Shipping</span>
                        <span>Returns</span>
                        <span>Contact</span>
                      </div>
                    </footer>
                  </div>
                </div>
              </article>

              <article className="glass-card theme-summary-shell reveal">
                <div className="theme-summary-copy">
                  <span className="metric-label">{page.summary.eyebrow}</span>
                  <h2>{page.summary.title}</h2>
                  <p>{page.summary.copy}</p>
                </div>

                <div className="theme-summary-grid">
                  <div className="theme-summary-card">
                    <strong>{activePreset.badge}</strong>
                    <span>{page.summary.presetIdentity}</span>
                  </div>
                  <div className="theme-summary-card">
                    <strong>{activePalette.label}</strong>
                    <span>{page.summary.colorDirection}</span>
                  </div>
                  <div className="theme-summary-card">
                    <strong>{selectedDefinition?.label ?? page.controls.overview}</strong>
                    <span>{page.summary.selectedSection}</span>
                  </div>
                  <div className="theme-summary-card">
                    <strong>{sections.length}</strong>
                    <span>{page.summary.sectionsInFlow}</span>
                  </div>
                </div>

                <div className="theme-summary-actions">
                  <Link className="primary-button" to="/contact">
                    {primaryActionLabel}
                  </Link>
                  <Link className="secondary-button" to="/pricing">
                    {page.secondaryAction}
                  </Link>
                </div>
              </article>

              <article className="glass-card theme-save-shell reveal">
                <div className="theme-save-copy">
                  <span className="metric-label">{page.save.eyebrow}</span>
                  <h2>{page.save.title}</h2>
                  <p>{page.save.copy}</p>
                </div>

                {snapshotPreview ? (
                  <div className="theme-save-preview">
                    <img src={snapshotPreview} alt={activePreset.label} />
                  </div>
                ) : null}

                {sent ? (
                  <div className="theme-save-success">
                    <strong>{page.save.successTitle}</strong>
                    <p>{page.save.successCopy}</p>
                  </div>
                ) : (
                  <form className="theme-save-form" onSubmit={handleSendDesign}>
                    <div className="theme-save-grid">
                      <label className="theme-save-field">
                        <span>{page.save.fullName}</span>
                        <input
                          type="text"
                          value={form.fullName}
                          placeholder={page.save.placeholders.fullName}
                          onChange={(event) => updateForm("fullName", event.target.value)}
                          required
                        />
                      </label>
                      <label className="theme-save-field">
                        <span>{page.save.email}</span>
                        <input
                          type="email"
                          value={form.email}
                          placeholder={page.save.placeholders.email}
                          onChange={(event) => updateForm("email", event.target.value)}
                          required
                        />
                      </label>
                    </div>

                    <label className="theme-save-field">
                      <span>{page.save.company}</span>
                      <input
                        type="text"
                        value={form.company}
                        placeholder={page.save.placeholders.company}
                        onChange={(event) => updateForm("company", event.target.value)}
                      />
                    </label>

                    <label className="theme-save-field">
                      <span>{page.save.note}</span>
                      <textarea
                        rows="4"
                        value={form.note}
                        placeholder={page.save.placeholders.note}
                        onChange={(event) => updateForm("note", event.target.value)}
                      />
                    </label>

                    <div className="theme-save-actions">
                      <button className="secondary-button" type="button" onClick={handleDownload}>
                        {page.save.download}
                      </button>
                      <button className="primary-button" type="submit" disabled={sending}>
                        {sending ? page.save.sending : page.save.submit}
                      </button>
                    </div>
                  </form>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Templates;
