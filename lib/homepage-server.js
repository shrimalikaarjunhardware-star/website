import { createClient } from "@supabase/supabase-js";
export async function getHomepageSlides() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return [];
  const supabase=createClient(url,key,{auth:{persistSession:false}});
  const {data,error}=await supabase.from("homepage_slides").select("*").eq("active",true).order("sort_order",{ascending:true}).order("created_at",{ascending:false});
  return error ? [] : (data||[]);
}
