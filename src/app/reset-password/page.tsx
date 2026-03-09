"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword(){

  const router = useRouter();

  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const updatePassword = async (e:any)=>{
    e.preventDefault();

    setLoading(true);

    const {error} = await supabase.auth.updateUser({
      password
    });

    setLoading(false);

    if(error){
      alert(error.message);
      return;
    }

    alert("تم تغيير كلمة المرور بنجاح");

    router.push("/login");
  }

  return(

  <div className="max-w-md mx-auto mt-40">

    <h1 className="text-2xl font-bold mb-6 text-center">
    تعيين كلمة مرور جديدة
    </h1>

    <form onSubmit={updatePassword} className="space-y-4">

      <input
      type="password"
      placeholder="كلمة المرور الجديدة"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      className="w-full border p-3 rounded"
      required
      />

      <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white p-3 rounded"
      >

      {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}

      </button>

    </form>

  </div>

  )
}