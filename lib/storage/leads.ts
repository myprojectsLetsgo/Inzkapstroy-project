import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import type { Lead, LeadStatus, LeadStore } from "@/lib/types/lead";
import { DATA_DIR, LEADS_FILE } from "@/lib/storage/paths";

async function ensureStore(): Promise<LeadStore> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw) as LeadStore;
    if (Array.isArray(parsed.leads)) return parsed;
  } catch {
    /* first run */
  }
  const empty: LeadStore = { leads: [] };
  await writeFile(LEADS_FILE, JSON.stringify(empty, null, 2), "utf8");
  return empty;
}

async function saveStore(store: LeadStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LEADS_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string;
  description?: string;
  ipHash?: string | null;
}): Promise<Lead> {
  const store = await ensureStore();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: randomUUID(),
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    description: input.description ?? null,
    status: "new",
    source: "website",
    ipHash: input.ipHash ?? null,
    createdAt: now,
    updatedAt: now,
  };
  store.leads.unshift(lead);
  await saveStore(store);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const store = await ensureStore();
  return [...store.leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const store = await ensureStore();
  const index = store.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  store.leads[index] = {
    ...store.leads[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await saveStore(store);
  return store.leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  const store = await ensureStore();
  const before = store.leads.length;
  store.leads = store.leads.filter((l) => l.id !== id);
  if (store.leads.length === before) return false;
  await saveStore(store);
  return true;
}
