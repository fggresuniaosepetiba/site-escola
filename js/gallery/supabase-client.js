const appEnv = window.APP_ENV || {};

const supabaseUrl = appEnv.SUPABASE_URL;
const supabaseAnonKey = appEnv.SUPABASE_ANON_KEY;

function isMissingConfig(value) {
  return !value || value === "COLE_AQUI";
}

export function validateSupabaseConfig() {
  const missing = [];

  if (isMissingConfig(supabaseUrl)) {
    missing.push("SUPABASE_URL");
  }

  if (isMissingConfig(supabaseAnonKey)) {
    missing.push("SUPABASE_ANON_KEY");
  }

  if (missing.length) {
    const message = `Configuracao ausente: preencha ${missing.join(", ")} em js/gallery/supabase-env.js`;
    return { ok: false, message };
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    return { ok: false, message: "SDK do Supabase nao carregado. Verifique o script CDN." };
  }

  return { ok: true, message: "ok" };
}

const configStatus = validateSupabaseConfig();

export const supabaseClient = configStatus.ok
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : null;
