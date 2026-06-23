export function ReturnPolicy() {
  return (
    <div>
      <div className="bg-cream border-b border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Return & Refund Policy</h1>
          <p className="text-sm text-gray-500">Our commitment to your satisfaction.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Returns for Damaged Items</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Due to the perishable nature of food products, we do not accept general returns. However, if your order arrives damaged or you receive an incorrect product, we will gladly replace it or issue a full refund.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">How to Report a Problem</h2>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
              <li>Contact us within 24 hours of delivery.</li>
              <li>Email photos of the damaged/incorrect item to hello@flavoursofpalnadu.com.</li>
              <li>Include your order ID and a brief description of the issue.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Refund Process</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Once we verify your claim, refunds will be processed within 5-7 business days. For UPI payments, refunds will be credited back to the original UPI ID. For COD orders, refunds will be processed via bank transfer or UPI.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Cancellation</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Orders can be cancelled before they are dispatched. Please contact us immediately after placing an order if you wish to cancel. Once an order is shipped, it cannot be cancelled.</p>
          </section>
          <section>
            <h2 className="font-semibold text-charcoal mb-2">Contact</h2>
            <p className="text-sm text-gray-600 leading-relaxed">For any return or refund queries, reach us at <a href="mailto:hello@flavoursofpalnadu.com" className="text-deep-green hover:underline">hello@flavoursofpalnadu.com</a> or call <a href="tel:+919876543210" className="text-deep-green hover:underline">+91 98765 43210</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
