import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phoneNumber = '9492433581'
  const message = 'Hello Flavours of Palnadu! I would like to place an order.'

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="white" />
    </a>
  )
}
