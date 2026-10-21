type ListingDraft = {
  category?: string;
};

const draft: ListingDraft = {};
const listeners = new Set<() => void>();

export function getCategory(): string | undefined {
  return draft.category;
}

export function setCategory(category: string) {
  draft.category = category;
  listeners.forEach((listener) => listener());
}

export function subscribeToCategory(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let addressId: string | null = null;
export const getAddressId = () => addressId;
export const setAddressId = (id: string | null) => { addressId = id; };
