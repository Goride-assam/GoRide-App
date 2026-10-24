import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  "https://jjtaxfpwijenwdonynzl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_yEtghOJ_tVWzTRumQLxzbA_AzJVJHkA";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
