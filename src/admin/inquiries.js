const INQUIRIES_STORAGE_KEY = "morphix.admin.inquiries.v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function createInquiryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `inq_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function persistInquiries(inquiries) {
  const storage = getStorage();
  if (!storage) return inquiries;

  storage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  return inquiries;
}

export function readInquiries() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.sort(
      (left, right) => new Date(right.receivedAt).getTime() - new Date(left.receivedAt).getTime(),
    );
  } catch {
    return [];
  }
}

export function createInquiry(payload) {
  const nextInquiry = {
    id: createInquiryId(),
    status: "new",
    receivedAt: new Date().toISOString(),
    source: payload.source ?? "website",
    fullName: payload.fullName?.trim() ?? "",
    email: payload.email?.trim() ?? "",
    company: payload.company?.trim() ?? "",
    website: payload.website?.trim() ?? "",
    productName: payload.productName?.trim() ?? "",
    brief: payload.brief?.trim() ?? "",
    projectType: payload.projectType ?? "",
    productStage: payload.productStage ?? "",
    goals: Array.isArray(payload.goals) ? payload.goals : [],
    deliverables: Array.isArray(payload.deliverables) ? payload.deliverables : [],
    timeline: payload.timeline ?? "",
    budget: payload.budget ?? "",
  };

  return persistInquiries([nextInquiry, ...readInquiries()])[0];
}

export function updateInquiryStatus(inquiryId, status) {
  const nextInquiries = readInquiries().map((inquiry) => (
    inquiry.id === inquiryId
      ? {
        ...inquiry,
        status,
        statusUpdatedAt: new Date().toISOString(),
      }
      : inquiry
  ));

  return persistInquiries(nextInquiries);
}
