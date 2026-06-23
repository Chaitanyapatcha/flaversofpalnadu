export function ShippingPolicy() {
  return (
    <div>
      <div className="bg-cream border-b border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Shipping Policy</h1>
          <p className="text-sm text-gray-500">Everything you need to know about our delivery process.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Delivery Areas</h2>
            <p className="text-sm text-gray-600 leading-relaxed">We ship across all states and union territories of India. Delivery to major cities typically takes 3-5 business days, while remote areas may take 5-7 business days.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Shipping Charges</h2>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Flat shipping fee of ₹60 on all orders.</li>
              <li>All orders are shipped via standard courier services.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Processing Time</h2>
            <p className="text-sm text-gray-600 leading-relaxed">All orders are processed within 1-2 business days (Monday to Saturday). Orders placed on Sunday or public holidays will be processed on the next working day.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Tracking</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Once your order is dispatched, you will receive an email and SMS with a tracking link. You can also track your order from the "Track Order" page on our website.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Packaging</h2>
            <p className="text-sm text-gray-600 leading-relaxed">We use food-grade packaging with bubble wrap and secure sealing to ensure your products reach you in perfect condition. Glass jars are packed with extra cushioning.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
