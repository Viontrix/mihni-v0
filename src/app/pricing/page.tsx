export default function PricingPage() {
  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10 text-center">
        خطط الاشتراك
      </h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            المجانية
          </h2>

          <p className="text-gray-600 mb-6">
            أدوات محدودة
          </p>

          <button className="w-full bg-gray-200 py-2 rounded">
            الباقة الحالية
          </button>
        </div>

        <div className="border rounded-xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Pro
          </h2>

          <p className="text-gray-600 mb-6">
            أدوات أكثر وميزات متقدمة
          </p>

          <button className="w-full bg-green-600 text-white py-2 rounded">
            ترقية
          </button>

        </div>

        <div className="border rounded-xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Business
          </h2>

          <p className="text-gray-600 mb-6">
            استخدام احترافي للشركات
          </p>

          <button className="w-full bg-green-600 text-white py-2 rounded">
            ترقية
          </button>

        </div>

      </div>

    </div>
  )
}