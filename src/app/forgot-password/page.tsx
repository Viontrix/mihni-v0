"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [sent,setSent] = useState(false);

  const sendReset = async (e:any) => {
    e.preventDefault();

    setLoading(true);

    const {error} = await supabase.auth.resetPasswordForEmail(email,{
      redirectTo:`${window.location.origin}/reset-password`
    });

    setLoading(false);

    if(error){
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return(
    <div className="max-w-md mx-auto mt-40">

      <h1 className="text-2xl font-bold mb-6 text-center">
        استعادة كلمة المرور
      </h1>

      {sent ? (
        <div className="text-center">
          تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني
        </div>
      ) : (

      <form onSubmit={sendReset} className="space-y-4">

        <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full border p-3 rounded"
        required
        />

        <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded"
        >

        {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}

        </button>

      </form>

      )}

    </div>
  )

}