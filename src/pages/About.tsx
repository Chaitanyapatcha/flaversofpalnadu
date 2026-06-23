import { motion } from 'framer-motion'
import { Leaf, Heart, Award, Users, MapPin, Clock, Utensils } from 'lucide-react'

export function About() {
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every jar of pickle and every batch of snacks is prepared with the same love and care that our grandmothers put into their cooking.',
    },
    {
      icon: Leaf,
      title: 'Farm Fresh Ingredients',
      description: 'We source the freshest ingredients from local farms in Palnadu. Our mangoes, chilies, and herbs are handpicked at the peak of their season.',
    },
    {
      icon: Award,
      title: 'Authentic Recipes',
      description: 'Our recipes have been passed down through three generations. We follow traditional methods without any shortcuts or artificial substitutes.',
    },
    {
      icon: Users,
      title: 'Family Business',
      description: 'Flavours of Palnadu is a family-run business from Sattenapalle. When you buy from us, you support a local artisan family.',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Sourcing',
      icon: MapPin,
      description: 'We personally visit local farms to select the best raw mangoes, gongura leaves, lemons, and garlic. Only the finest produce makes it to our kitchen.',
    },
    {
      step: '02',
      title: 'Preparation',
      icon: Utensils,
      description: 'Ingredients are washed, dried, and prepared by hand. Spices are roasted and ground fresh in small batches for maximum aroma and flavor.',
    },
    {
      step: '03',
      title: 'Sun Curing',
      icon: Clock,
      description: 'Our pickles are sun-cured for several weeks under the Palnadu sun. This traditional method develops the deep, complex flavors that our customers love.',
    },
    {
      step: '04',
      title: 'Packing',
      icon: Award,
      description: 'Every jar is packed by hand with care. We use food-grade glass jars and airtight packaging to ensure freshness during transit.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-deep-green text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold text-sm font-semibold uppercase tracking-wider">Our Story</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-3 mb-6">
                Flavours of Palnadu
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Bringing the authentic taste of Andhra Pradesh to homes across India. Our journey started in a small kitchen in Sattenapalle, and today we proudly serve thousands of families who crave genuine homemade flavors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-4">
                A Family Tradition Since 1985
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Flavours of Palnadu began in the heart of Sattenapalle, a small town in the Palnadu district of Andhra Pradesh. What started as a grandmother making extra jars of her famous Avakaya pickle for neighbors and relatives, soon grew into something much bigger.
                </p>
                <p>
                  Our founder, Smt. Lakshmi Devi, believed that the true taste of Andhra could only be captured through patience, traditional methods, and the finest local ingredients. She passed these values to her children, who now carry forward the legacy with the same dedication.
                </p>
                <p>
                  Today, we operate from a clean, modern kitchen facility in Sattenapalle, but our methods remain rooted in tradition. Every batch is still prepared by hand, sun-cured in the open air, and packed with personal care.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Traditional spices"
                className="rounded-xl w-full h-56 object-cover"
                loading="lazy"
              />
              <img
                src="https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Pickle preparation"
                className="rounded-xl w-full h-56 object-cover mt-8"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Our Mission & Values</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              We are committed to preserving Andhra culinary heritage while delivering the highest quality homemade products.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-deep-green/10 flex items-center justify-center">
                  <v.icon size={22} className="text-deep-green" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Our Preparation Process</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              From farm to jar, every step is handled with care and tradition.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="bg-cream rounded-xl p-6 border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-deep-green text-white flex items-center justify-center text-sm font-bold">
                      <p.icon size={18} />
                    </div>
                    <span className="text-gold text-xs font-bold uppercase">Step {p.step}</span>
                  </div>
                  <h3 className="font-semibold text-charcoal mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-14 bg-deep-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">From Palnadu, With Love</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Sattenapalle is a historic town in the Palnadu district of Andhra Pradesh, known for its rich agricultural landscape and culinary traditions. The region's fertile soil produces some of the finest mangoes, chilies, and herbs in India. Our products carry the essence of this land - the warmth of its sun, the richness of its soil, and the flavor of its heritage.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin size={16} className="text-gold" />
                  Sattenapalle, Palnadu District, Andhra Pradesh, India - 522403
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Clock size={16} className="text-gold" />
                  Monday - Saturday, 9:00 AM - 7:00 PM
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30573.6360601963!2d80.175!3d16.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0c5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sSattenapalle%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Flavours of Palnadu Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
